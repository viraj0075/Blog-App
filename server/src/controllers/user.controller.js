import { User } from "../models/user.model.js";
import { AsyncHandlers } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { genrateAccessToken, veriftJwtToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = AsyncHandlers(async (req, res) => {
  const { email, username, password, confirmpassword } = req.body;
  console.log(email, "-", username, "-", password, "-", confirmpassword);

  //all feilds are required
  if (
    [email, username, password, confirmpassword].some(
      (items) => items?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Feilds Are Required");
  }

  //for the password and the Confirm Password
  if (password !== confirmpassword) {
    throw new ApiError(401, "Password does not match");
  }

  //chk if the User and email is alredy Registered
  const useroremail = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (useroremail) {
    console.log(useroremail, "User Alredy Exist");
    throw new ApiError(409, "User or email already Registered");
  }

  const newUser = await User.create({
    email,
    username,
    password,
  });
  if (!newUser) {
    console.log(error, "This is error in new User");
    throw new ApiError(400, "User Register failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { newUser }, "User registered Successfully"));
});

const loginUser = AsyncHandlers(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((items) => items?.trim === "")) {
    throw new ApiError(400, "All Feilds is Required");
  }

  const findEmailofUser = await User.findOne({
    $or: [{ email }],
  });

  if (!findEmailofUser) {
    throw new ApiError(400, "Email is not registered");
  }

  const comaprePassword = await bcrypt.compare(
    password,
    findEmailofUser?.password
  );
  console.log(comaprePassword);
  if (!comaprePassword) {
    console.log("This is indiode if");
    throw new ApiError(401, "Invalid credentails");
  }

  const token = await genrateAccessToken(
    findEmailofUser?._id,
    findEmailofUser?.username,
    findEmailofUser?.email,
    findEmailofUser?.password
  );
  console.log(token, "This is Token");
  if (!token) {
    new ApiError(401, "Error in Token Genration");
  }

  const loggedInUser = await User.findById(findEmailofUser._id).select(
    "-password"
  );

  console.log(loggedInUser, "This is logged in User");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", token, options)
    .json(new ApiResponse(200, { loggedInUser }, "User login Successfully"));
});

const userProfile = AsyncHandlers(async (req, res) => {
  const { accessToken } = req.cookies;
  // console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  // console.log(verifiedToken);

  return res
    .status(200)
    .json(new ApiResponse(200, { verifiedToken }, "This is Cookies"));
});

const logoutUser = AsyncHandlers(async (req, res) => {
  let { accessToken } = req.cookies;
  accessToken = "";

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", "", options)
    .json(new ApiResponse(200, { accessToken }, "User Logout Successfully"));
});

const createPost = AsyncHandlers(async (req, res) => {
  const { accessToken } = req.cookies;
  console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  if (!verifiedToken)
    throw new ApiError(
      400,
      "Login Again or Register if you dont have  registered"
    );
  // console.log(verifiedToken?._id, "This is Verfieed Token id ");

  const { file } = req.files;
  const { title, summary, text } = req.body;

  const filePath = file[0]?.path;
  if (!filePath) {
    throw new ApiError(400, "File Path is Not found", Error);
  }

  const fileUpload = await uploadOnCloudinary(filePath);
  if (!fileUpload) throw new ApiError(400, "Cant Upload on the Cloudinary");
  // console.log("File UPloaded Sucesfully on the Cloudinary",fileUpload?.url);
  // console.log(fileUpload?.url, title, summary, text);

  const newPost = await Post.create({
    title,
    summary,
    text,
    file: fileUpload?.url,
    author: verifiedToken?._id,
  });
  if (!newPost) {
    new ApiError(401, "There is Error in Creating Post");
  }
  console.log("newPost is Created Successfully", newPost);

  return res
    .status(200)
    .json(new ApiResponse(200, { newPost }, "NewPost is Created Successfully"));
});

const postList = AsyncHandlers(async (req, res) => {
  const listOfPost = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  return res
    .status(200)
    .json(new ApiResponse(200, { listOfPost }, "Post list Fetched"));
});

const postById = AsyncHandlers(async (req, res) => {
  const { id } = req.params;
  const postData = await Post.findById(id).populate("author", ["username"]);
  if (!postData) throw new ApiError(404, "Post is Not Availble");
  console.log(postData, "This is Post Data by Id");
  res
    .status(200)
    .json(new ApiResponse(200, { postData }, "Post Feteched Successfully"));
});

const editPost = AsyncHandlers(async (req, res) => {
  const { id } = req.params;
  const { file } = req.files;
  const { title, summary, text } = req.body;
  const  {accessToken}  = req.cookies;
  console.log(accessToken);

  console.log(new Object(file));
  const filePath = file[0]?.path;
  console.log(filePath);
  if (!filePath) {
    throw new ApiError(400, "File Path is Not found", Error);
  }

  const fileUpload = await uploadOnCloudinary(filePath);
  if (!fileUpload) throw new ApiError(400, "Cant Upload on the Cloudinary");

  console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  console.log(verifiedToken?._id);
  if (!verifiedToken)
    throw new ApiError(
      400,
      "Login Again or Register if you dont have  registered"
    );

  const posDoc = await Post.findById(id);
  if (!posDoc) throw new ApiError(400, "Error for Fetching the Post");
  console.log(posDoc);

  const Author = posDoc?.author?._id;
  const verfiedId = verifiedToken?._id;
  console.log(Author, verfiedId);
  const isAuthor = Author.toString() === verfiedId;
  if (!isAuthor) throw new ApiError(401, "You are not Author");

  const updatedPost = await Post.findByIdAndUpdate(id,
    {
      $set: {
        title,
        summary,
        text,
        file: fileUpload?.url,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, { updatedPost }, "Post Updated Successfully"));
});

export {
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
  createPost,
  postList,
  postById,
  editPost,
};
