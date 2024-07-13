import { Router } from "express";
import {
  createPost,
  deletePost,
  editPost,
  postById,
  postList,
} from "../controllers/post.controller.js";

import { loginUser,userProfile,logoutUser,registerUser, updateUserProfile,getUserById } from "../controllers/user.controller.js";
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
router.route("/editpost/:id").put(editPost);
router.route("/deletepost/:id").delete(deletePost);
router.route("/updateuser/:id").put(updateUserProfile);
router.route("/userdetails/:id").get(getUserById);

export default router;
