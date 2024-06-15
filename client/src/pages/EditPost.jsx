import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import Editor from "../components/Editor";

const EditPost = () => {
    const { id } = useParams();
    console.log(id)
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);


    const editPostById = async () => {
        const postById = await fetch(
            `http://localhost:4000/api/v1/users/postdetails/${id}`,
            {
                method: "GET",
                credentials: "include"
            },
        );
        if (postById.ok) {
            console.log("INside Post By ID")
            postById.json().then(response => {
                setTitle(response?.data?.postData?.title);
                setContent(response?.data?.postData?.text);
                setSummary(response?.data?.postData?.summary);
                console.log(response)
            });
        }
    }
    useEffect(() => {
        editPostById()
    }, []);

    const editedPost = async (ev) => {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('text', content);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        console.log(data)
        const edit = await fetch("http://localhost:4000/api/v1/users/editpost/" + id, {
            method: "PUT",
            body: data,
            credentials: "include"
        });
        if (edit.ok) {
            console.log(edit.json().then(data => console.log(data)), "Post Successfully Updated")
            setRedirect(true)
        }

    }

    if (redirect) {
        return <Navigate to={"/"} />
    }



    return (
        <>
            <div className="lg:mx-[18rem] mx-[2rem] p-4 bg-[#030d2e]">
                <form onSubmit={editedPost} className="space-y-4">
                    <input type="text"
                        placeholder="Title"
                        value={title}
                        onChange={ev => setTitle(ev.target.value)}
                        className="w-full p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="text"
                        placeholder="Summary"
                        value={summary}
                        onChange={ev => setSummary(ev.target.value)}
                        className="w-full p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="file"
                        placeholder='Choose the Cover image to update '
                        onChange={ev => setFiles(ev.target.files)}
                        className="w-full p-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <Editor onChange={setContent} value={content} className="w-full bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600" type='submit'>Update post</button>
                </form>
            </div>
        </>
    )
}

export default EditPost;