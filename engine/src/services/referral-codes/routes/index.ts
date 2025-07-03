import { Router } from "express";
import { create, updateByCode } from "../controller/save";
import { deleteByCode, findByCode } from "../controller/find";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      const error = Error("Code is required");
      (error as any).code = "400";
      throw error;
    }
    const createdCode = await create(code);
    res.status(201).json(createdCode);
  } catch (err) {
    next(err);
  }
});

// PUT /:code (update isExpired status)
router.put("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { isExpired } = req.body;

    if (typeof isExpired !== "boolean") {
      const error = Error("isExpired (boolean) is required in body");
      (error as any).statusCode = 400;
      throw error;
    }

    const updated = await updateByCode(code, { isExpired });

    if (!updated) {
      const error = Error("Code not found");
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /:code (get code info)
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const found = await findByCode(code);
    if (!found) {
      const error = Error("Code not found");
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json(found);
  } catch (err) {
    next(err);
  }
});

// DELETE /:code
router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const deleted = await deleteByCode(code);
    if (!deleted) {
      const error = Error("Code not found");
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
});

export { router };
