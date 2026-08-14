import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/post.controller.js";

const router = Router();
router.use(protect);
router.route("/").get(getPosts).post(createPost);
router.route("/:id").put(updatePost).delete(deletePost);
export default router;
