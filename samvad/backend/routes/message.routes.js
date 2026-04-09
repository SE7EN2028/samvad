import express from "express";
import { deleteMessage, editMessage, getMessages, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);
router.put("/edit/:id", protectRoute, editMessage);

export default router;
