import { AsyncHandlers } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { veriftJwtToken } from "../utils/jwtToken.js";
import { Post } from "../models/post.model.js";
import {
  deleteFileFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { GetPublicId } from "../utils/GetPublicId.js";

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
  console.log(fileUpload, "This is the Cloudinary Data");
  const publicIdOfImage = GetPublicId(fileUpload?.secure_url);
  console.log(publicIdOfImage);

  const newPost = await Post.create({
    title,
    summary,
    text,
    publicId: publicIdOfImage,
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
  // // const { file } = req.files;
  const { title, summary, text, file } = req.body;
  console.log(id, title, summary, text, file);

  const { accessToken } = req.cookies;
  // console.log(accessToken);
  const verifiedToken = await veriftJwtToken(accessToken);
  if (!verifiedToken)
    throw new ApiError(
      400,
      "Login Again or Register if you dont have  registered"
    );

  const posDoc = await Post.findById(id);
  if (!posDoc) throw new ApiError(400, "Error for Fetching the Post");

  let newFileUrl = posDoc?.file;
  const Author = posDoc?.author?._id;
  const verfiedId = verifiedToken?._id;
  const isAuthor = Author.toString() === verfiedId;
  if (!isAuthor) throw new ApiError(401, "You are not Author");
  console.log(posDoc);

  let newImageId;
  console.log(newFileUrl, "This is New File Url");
  if (file) {
    if (newFileUrl) {
      const getImageId = GetPublicId(newFileUrl);
      console.log(getImageId, "This is getImageId ");
      if (getImageId) {
        const res = await deleteFileFromCloudinary(getImageId);
        const upload_response = res;
        console.log(upload_response, "This is Upload response");
      }
    }
  }
  newImageId = GetPublicId(file);
  console.log(newImageId, "This is the newId");

  const updatedFeild = {};

  if (text) {
    updatedFeild.text = text;
  }
  if (summary) {
    updatedFeild.summary = summary;
  }
  if (title) {
    updatedFeild.title = title;
  }
  if (file) {
    updatedFeild.file = file;
  }
  if (newImageId) {
    updatedFeild.publicId = newImageId;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $set: updatedFeild,
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

export { createPost, postList, postById, editPost, deletePost };
