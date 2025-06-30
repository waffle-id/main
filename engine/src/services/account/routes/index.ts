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

const router = Router();

router.get("/", async (req, res) => {
  const items = await findAll();
  res.json(items);
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new Error("Username is required");
  }

  const user = await findByUsername(req.params.username);

  if (!user) {
    throw new Error("Not found");
  }

  res.send(user);
});

router.post("/login", async (req, res, next) => {
  try {
    const { address } = req.body;
    const user = await findByAddressFullData(address);
    if (!user) {
      const error = Error("You have not registered yet");
      (error as any).statusCode = 401;
      throw error;
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
