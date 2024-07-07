import { AsyncHandlers } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {  veriftJwtToken } from "../utils/jwtToken.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



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

  console.log(id, title, summary, text, file[0]?.path);

  const { accessToken } = req.cookies;
  console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  if (!verifiedToken)
    throw new ApiError(
      400,
      "Login Again or Register if you dont have  registered"
    );

  const filePath = file[0]?.path;
  console.log(filePath);
  if (!filePath) {
    throw new ApiError(400, "File Path is Not found", Error);
  }

  const fileUpload = await uploadOnCloudinary(filePath);
  if (!fileUpload) throw new ApiError(400, "Cant Upload on the Cloudinary");

  console.log(accessToken);

  const posDoc = await Post.findById(id);
  if (!posDoc) throw new ApiError(400, "Error for Fetching the Post");
  console.log(posDoc);

  const Author = posDoc?.author?._id;
  const verfiedId = verifiedToken?._id;
  const isAuthor = Author.toString() === verfiedId;
  if (!isAuthor) throw new ApiError(401, "You are not Author");

  const updatedPost = await Post.findByIdAndUpdate(
    id,
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

const deletePost = AsyncHandlers(async (req, res) => {
  const { id } = req.params;
  const { accessToken } = req.cookies;
  console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  if (!verifiedToken)
    throw new ApiError(
      400,
      "Login Again or Register if you dont have  registered"
    );

  //for the finding the Id
  const posDoc = await Post.findById(id);
  if (!posDoc) throw new ApiError(400, "Error for Fetching the Post");
  console.log(posDoc);

  //For the author Verfication
  const Author = posDoc?.author?._id;
  const verfiedId = verifiedToken?._id;
  console.log(Author, verfiedId);
  const isAuthor = Author.toString() === verfiedId;
  if (!isAuthor) throw new ApiError(401, "You are not Author");

  const deletedPost = await Post.findByIdAndDelete(id, {
    new: true,
  });

  res
  .status(200)
  .json(new ApiResponse(200, { deletedPost }, "Post Deleted Successfully"));
});

export {
  createPost,
  postList,
  postById,
  editPost,
  deletePost
};
