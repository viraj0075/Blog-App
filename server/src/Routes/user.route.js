import { Router } from "express";
import {
  createPost,
  editPost,
  loginUser,
  logoutUser,
  postById,
  postList,
  registerUser,
  userProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/registeruser").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(userProfile);
router.route("/logout").post(logoutUser);
router.route("/createpost").post(
  upload.fields([
    {
      name: "file",
      maxcount: 10,
    },
  ]),
  createPost
);
router.route("/postlist").get(postList);
router.route("/postdetails/:id").get(postById);
router.route("/editpost/:id").put(
  upload.fields([
    {
      name: "file",
      maxcount: 10,
    },
  ]),
  editPost
);

export default router;
