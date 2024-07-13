import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import "../_textEditor.scss";
import ReactQuill from 'react-quill';
import { Navigate } from "react-router-dom";
import { newPost } from "../apis/postApi";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    summary: "",
    file: "",
  });



  const [text, setText] = useState("");
  const handleContent = (value) => {
    setText(value);
    console.log(text);
  }



  const [errors, setErrors] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    if (name === 'file') {
      console.log(files);
      setBlogData({ ...blogData, file: files?.[0] });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }


    console.log(blogData)
  };
  const data = new FormData();
  data.set('title', blogData.title);
  data.set('summary', blogData.summary);
  data.set('file', blogData.file);
  data.set('text', text);


  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newObject = { ...blogData, text: text }
    console.log(newObject, "THis is object from the create post");
    setLoading(true);
    setDisabled(true);


    const post = await newPost(newObject);
    toast.loading("Uploading your blog", {
      duration: 3000
    });
    if (post.ok) {
      console.log(post.json().then(data => console.log(data)), "Post Successfully Created")
      toast.success("Created your blog sucessfully", {
        duration: 3000
      });
      setRedirect(true)
    }
    setLoading(false);
    setDisabled(false);
    setRedirect(true);


    setBlogData({
      title: "",
      summary: "",
      file: "",
    });
    setText("")
    setErrors("");
    alert("Form submitted successfully");
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-48">
      <div className="w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl leading-9 font-extrabold text-orange-500">
            Create New Post
          </h2>
        </div>
        <form aria-disabled={disabled} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="py-4">
              <label
                htmlFor="title"
                className="block text-lg font-medium text-white"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={blogData.title}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border  placeholder-gray-500 text-orange-500 rounded-t-md focus:outline-none focus:ring-[#030d2e] focus:z-10 text-lg bg-opacity-50 bg-[#030d2e] border-blue-950"
                placeholder="Enter title"
              />
            </div>
            <div className="py-4">
              <label
                htmlFor="summary"
                className="block text-lg font-medium text-white"
              >
                Summary
              </label>
              <input
                id="summary"
                name="summary"
                type="text"
                value={blogData.summary}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border  placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-[#030d2e] focus:z-10 text-lg bg-opacity-50 bg-[#030d2e] border-blue-950"
                placeholder="Enter summary"
              />
            </div>
            <div className="py-4">
              <label
                htmlFor="image"
                className="block text-lg font-medium text-white"
              >
                Cover image
              </label>
              <input
                id="file"
                name="file"
                type="file"
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-4 py-3 border-blue-950 text-white rounded-t-md focus:outline-none focus:ring-[#030d2e] focus:z-10 text-lg bg-opacity-50  bg-[#030d2e]"
              />
            </div>
            <div className="py-4">
              <label
                htmlFor="text"
                className="block text-lg font-medium text-white"
              >
                Content
              </label>
              <ReactQuill
                name="text"
                value={text}
                onChange={handleContent}
                modules={modules}
                formats={formats}
                className="quill-editor ql-error placeholder-white"
                placeholder="Enter Content"
              />
            </div>
          </div>

          <div>
            <button
              disabled={disabled}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-orange-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              {loading ? <Loading /> : "Submit"}
            </button>
          </div>
        </form>
        {errors && (
          <p className="text-red-600 text-center">All feilds Are Required</p>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
