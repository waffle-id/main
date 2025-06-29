import { Router } from "express";
import { findAll, findByAddress, findByUsername } from "../controller/find";
import { add } from "../controller/save";

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
