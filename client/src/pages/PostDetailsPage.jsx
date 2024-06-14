import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'

const PostDetailsPage = () => {

    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const userInfo = useSelector(state => state.user.userInfo);




    const postInfoById = async () => {
        const postById = await fetch(
            `http://localhost:4000/api/v1/users/postdetails/${id}`,
            {
                method: "GET",
            },
        );

        if (postById.ok) {
            postById
                .json()
                .then((userdata) => {
                    console.log((userdata?.data?.postData), "This is Post Datas by Ids")
                    setPostInfo(userdata?.data?.postData)
                })
        }
        else {

        }
    };

    useEffect(() => {
        postInfoById()
    }, []);
    console.log(userInfo?._id)


    return (
        <>
            <div className="lg:mx-[18rem] mx-[2rem] p-4 bg:[#030d2e]">
                <div className="space-y-4 mt-6">
                    <h1 className="w-full p-2 bg-transparent text-white placeholder-gray-400 font-bold text-3xl text-center">{postInfo?.title}</h1>
                    <div className='p-2 rounded-lg border-none flex justify-center items-center'>
                        <img className=' object-cover' src={postInfo?.file} alt="" />
                    </div>
                    <h1 className="w-full p-2 bg-transparent text-white placeholder-gray-400 font-semibold text-xl text-center">Created By: @ {postInfo?.author?.username}</h1>
                    <h1 className="w-full p-2 bg-transparent text-white placeholder-gray-400 font-thin text-xl text-center">Date: {postInfo?.createdAt}</h1>

                    <div className='flex items-center justify-around'>
                   
                    {userInfo._id === postInfo?.author?._id &&
                    <Link to={`/editpost/${postInfo?._id}`}>
                        (<button className="w-[150px]  bg-orange-500 text-white p-2 rounded hover:bg-orange-600">Update post</button>)
                    </Link>
                        
                        }
                    {userInfo._id === postInfo?.author?._id &&
                        (<button className="w-[150px]  bg-orange-500 text-white p-2 rounded hover:bg-orange-600">Delete post</button>)
                        
                        }
                    </div>


                    <div className='flex items-center content-center lg:mx-[8rem] mx-[1rem]'>

                        <div
                            className="p-2 bg-transparent text-white placeholder-gray-400 text-xl text-left custom-content "
                            dangerouslySetInnerHTML={{ __html: postInfo?.text }}
                        ></div>
                    </div>


                    {/* <Editor onChange={setContent} value={content} className="w-full bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500" /> */}
                </div>
            </div>
        </>

    )
}

export default PostDetailsPage;