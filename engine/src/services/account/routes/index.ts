import { Router } from "express";
import {
  findAll,
  findByAddress,
  findByUsername,
  findByUsernameFullData,
  findByAddressFullData,
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

const router = Router();

router.get("/", async (req, res) => {
  const items = await findAll();
  res.json(items);
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
      ...(user.toObject?.() ?? user), // for Mongoose documents
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
      { expiresIn: "1h" }
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

    existingReferralCode.isExpired = true;
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
      { expiresIn: "1h" }
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
