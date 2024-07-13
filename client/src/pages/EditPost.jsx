import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import Editor from "../components/Editor";
import { postById,editPost } from '../apis/postApi';


const EditPost = () => {
    const { id } = useParams();
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editedData, setEditedData] = useState({
        title: "",
        summary: "",
        file: null
    });
    const [text, setText] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (name === "file") {
            console.log(files);
            setEditedData({ ...editedData, file: files?.[0] })
        }
        else {
            setEditedData({
                ...editedData,
                [name]: value,
            })
        }
        console.log(editedData);
    }

    const editPostById = async () => {
        const getPostData = await postById(id);
        const { title, summary, text } = getPostData?.data?.postData;
        setEditedData({
            title: title,
            summary: summary,
        });
        setText(text);

    }
    useEffect(() => {
        editPostById()
    }, []);

    const editedPost = async (e) => {
        e.preventDefault();
        console.log(editedData);
        const newObj = {...editedData,text}
        const data = await editPost(id,newObj);
        if (data.ok) {
            console.log(data.json().then(data => console.log(data)), "Post Successfully Updated")
            setRedirect(true)
        }

    }

    if (redirect) {
        return <Navigate to={"/"} />
    }



    return (
        <>
            <div className="lg:mx-[18rem] mx-[2rem] p-4 bg-[#030d2e]">
                <div>
                    <h2 className="mt-6 text-center text-4xl leading-9 font-extrabold text-orange-500">
                        Edit Post
                    </h2>
                </div>

                <form onSubmit={editedPost} className="space-y-4">
                    <label
                        htmlFor="image"
                        className="block text-lg font-medium text-white"
                    >
                        Title
                    </label>
                    <input type="text"
                        name="title"
                        placeholder="Title"
                        value={editedData.title}
                        onChange={handleChange}
                        className="w-full p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <label
                        htmlFor="image"
                        className="block text-lg font-medium text-white"
                    >
                        Summary
                    </label>
                    <input type="text"
                        name="summary"
                        placeholder="Summary"
                        value={editedData.summary}
                        onChange={handleChange}
                        className="w-full p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <label
                        htmlFor="image"
                        className="block text-lg font-medium text-white"
                    >
                        Cover Image
                    </label>
                    <input type="file"
                        name="file"
                        placeholder='Choose the Cover image to update '
                        onChange={handleChange}
                        className="w-full p-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <label
                        htmlFor="image"
                        className="block text-lg font-medium text-white"
                    >
                        Content
                    </label>
                    <Editor name="text" onChange={setText} value={text} className="w-full bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600" type='submit'>Update post</button>
                </form>
            </div>
        </>
    )
}

export default EditPost;