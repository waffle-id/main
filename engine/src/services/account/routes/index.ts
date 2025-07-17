import { Router } from "express";
import {
  findAll,
  findByAddress,
  findByUsername,
  findByUsernameFullData,
  findByAddressFullData,
  getTotalUsers,
} from "../controller/find";
import { findByCode as findReferralByCode } from "../../referral-codes/controller/find";
import { update as updateReferralCode } from "../../referral-codes/controller/save";
import { update, create } from "../controller/save";
import { add } from "../controller/save";
import { CONFIG } from "../../../config";
import jwt from "jsonwebtoken";
import { verifyWalletSignature } from "@/helpers/verify-signature";
import { deleteNonce, generateNonce, getNonce } from "@/helpers/nonce-store";
import { findAllByUsername } from "@/services/user-persona-scores/controller/find";
import {
  getReviewsReceivedByUserCount,
  getReviewsWrittenByUserCount,
} from "@/services/reviews/controller/find";

const router = Router();

type UserSort = "username" | "reputationScore" | "createdAt";
type SortDirection = "asc" | "desc";
interface GetUserRequest {
  page: number | null;
  size: number | null;
  sortBy: UserSort | null;
  order: SortDirection | null;
}

router.get("/", async (req, res) => {
  try {
    const query = req.query as Partial<GetUserRequest>;

    const page = query.page ? query.page : 1;
    const size = query.size ? query.size : 20;

    const validSortFields: UserSort[] = [
      "username",
      "reputationScore",
      "createdAt",
    ];
    const validOrders: SortDirection[] = ["asc", "desc"];

    const sortBy = validSortFields.includes(query.sortBy as UserSort)
      ? (query.sortBy as UserSort)
      : null;

    const order = validOrders.includes(query.order as SortDirection)
      ? (query.order as SortDirection)
      : null;

    const shouldSort = sortBy !== null;

    const skip = (page - 1) * size;

    const users = await findAll(shouldSort, sortBy, order, skip, size);
    // Fetch review counts for the listed users
    const usernames = users.map((u) => u.username);
    const writtenReviewsCount = await getReviewsWrittenByUserCount(
      usernames as string[]
    );
    const receivedReviewsCount = await getReviewsReceivedByUserCount(
      usernames as string[]
    );
    // Create lookup maps
    const writtenMap = Object.fromEntries(
      writtenReviewsCount.map((r) => [r._id, r.count])
    );
    const receivedMap = Object.fromEntries(
      receivedReviewsCount.map((r) => [r._id, r.count])
    );

    // Merge review data into users
    const usersWithReviews = users.map((user) => ({
      ...user.toObject(),
      writtenReviewCount: writtenMap[user.username as string] ?? 0,
      receivedReviewCount: receivedMap[user.username as string] ?? 0,
    }));

    const total = await getTotalUsers();

    res.status(200).json({
      users: usersWithReviews,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
        sort: shouldSort ? { by: sortBy, order: order ?? "desc" } : null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      const error = Error("Username is required");
      (error as any).statusCode = 400;
      throw error;
    }

    const user = await findByUsername(username);

    if (!user) {
      const error = Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }
    const userPersonaScores = await findAllByUsername(username);
    const response = {
      ...(user.toObject?.() ?? user),
      userPersonaScores,
    };

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get("/nonce/:address", async (req, res, next) => {
  try {
    const { address } = req.params;
    if (!address) {
      const error = Error("Address is required");
      (error as any).statusCode = 400;
      throw error;
    }

    const nonce = generateNonce(address);
    res.status(200).json({
      isSuccess: true,
      nonce,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { address, signature } = req.body;
    if (!address || !signature) {
      const error = Error("Missing fields");
      (error as any).statusCode = 400;
      throw error;
    }

    const user = await findByAddressFullData(address);
    if (!user) {
      const error = Error("You have not registered yet");
      (error as any).statusCode = 401;
      throw error;
    }

    const nonce = getNonce(address);
    if (!nonce) {
      const error = Error("Nonce expired or missing");
      (error as any).statusCode = 401;
      throw error;
    }

    const expectedMessage = `Sign in to Waffle App\nNonce: ${nonce}`;
    const isSignatureValid = verifyWalletSignature({
      address,
      message: expectedMessage,
      signature,
    });
    if (!isSignatureValid) {
      const error = Error("Invalid signature");
      (error as any).statusCode = 401;
      throw error;
    }

    deleteNonce(address);

    const token = jwt.sign(
      {
        id: user._id,
        address: user.address,
        username: user.username,
      },
      CONFIG.JWT_SECRET,
      { expiresIn: "1w" }
    );
    res.status(200).json({
      token,
      isSuccess: true,
      user: {
        id: user._id,
        address: user.address,
        username: user.username,
        hasInvitationAuthority: user.hasInvitationAuthority,
        reputationScore: user.reputationScore,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, address, referralCode, fullName, bio, avatarUrl } =
      req.body;

    if (!username || !address || !referralCode) {
      const error = Error("Bad request");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingUser = await findByUsernameFullData(username);

    if (existingUser?.address != null) {
      const error = Error("User is already registered");
      (error as any).statusCode = 409;
      throw error;
    }

    const existingReferralCode = await findReferralByCode(referralCode);
    if (!existingReferralCode) {
      const error = Error("You are not invited");
      (error as any).statusCode = 401;
      throw error;
    }

    if (existingReferralCode.isExpired) {
      const error = Error("Your referral code sucks");
      (error as any).statusCode = 401;
      throw error;
    }

    // existingReferralCode.isExpired = true; // temporary disable
    await updateReferralCode(existingReferralCode);

    let user;
    if (existingUser != null) {
      existingUser.address = address;
      user = await update(existingUser);
    } else {
      user = await create({
        username,
        address,
        hasInvitationAuthority: false,
        reputationScore: 1000,
        avatarUrl: avatarUrl,
        bio: bio,
        fullName: fullName,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        address: user.address,
        username: user.username,
      },
      CONFIG.JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.status(200).json({
      isSuccess: true,
      token,
      user: {
        id: user._id,
        address: user.address,
        username: user.username,
        hasInvitationAuthority: user.hasInvitationAuthority,
        reputationScore: user.reputationScore,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register-scraper", async (req, res, next) => {
  try {
    const { username, fullName, bio, avatarUrl } = req.body;

    if (!username) {
      const error = Error("Username is required");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingUser = await findByUsernameFullData(username);

    let user;
    if (existingUser != null) {
      const updatedData = {
        ...existingUser,
        fullName: fullName || existingUser.fullName,
        bio: bio || existingUser.bio,
        avatarUrl: avatarUrl || existingUser.avatarUrl,
      };
      user = await update(updatedData);
      console.log(`🔄 Updated existing user: ${username}`);
    } else {
      user = await create({
        username,
        address: "",
        hasInvitationAuthority: false,
        reputationScore: 1000,
        avatarUrl: avatarUrl,
        bio: bio,
        fullName: fullName,
      });
      console.log(`🆕 Created new user: ${username}`);
    }

    res.status(200).json({
      isSuccess: true,
      user: {
        id: user._id,
        address: user.address,
        username: user.username,
        hasInvitationAuthority: user.hasInvitationAuthority,
        reputationScore: user.reputationScore,
      },
    });
  } catch (err) {
    console.error("Error in register-scraper:", err);
    next(err);
  }
});

router.post("/", async (req, res) => {
  const id = await add(req.body);
  res.json({ success: true, id });
});

router.post("/check", async (req, res) => {
  console.log(req.body);
  const { address } = req.body;
  if (!address) {
    throw new Error("Address is required");
  }

  const user = await findByAddress(address as string);
  if (user) {
    res.json({ success: true, username: user.username, address: user.address });
  } else {
    res.json({ success: false, username: "", address: "" });
  }
});

export { router };
