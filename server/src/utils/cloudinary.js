import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./apiResponse.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    const resCloud = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log(resCloud.url, "File Uploaded Successfully on Cloudinary");
    fs.unlinkSync(localPath);
    return resCloud;
  } catch (err) {
    console.log(err, "This is File Error of Cloudinary");
    return null;
  }
};

//function to check the existance file in cloudinary
const checkIfFileExists = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    console.log(result)
    return !!result;
  } catch (error) {
    if (error.http_code === 404) {
      return false;
    } else {
      throw new ApiError(400, "Error checking file existence");
    }
  }
};

// Function to delete a file from Cloudinary
const deleteFileFromCloudinary = async (id) => {
  try {
    const exists = await checkIfFileExists(id);
    if (!exists) {
      throw new ApiError(404, "File not found");
    }

    const result = await cloudinary.uploader.destroy(id);
    console.log("Previous Image Deleted Successfully", result);
    return result;
  } catch (error) {
    throw new ApiError(400, `There is an error in deleting the file: ${error.message}`);
  }
};
export {uploadOnCloudinary,deleteFileFromCloudinary};