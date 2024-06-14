import { useEffect, useState } from "react";
import Postdetails from "../components/PostDetails";
const Post = () => {

  const [postList, setPostList] = useState([]);


  const fetchMovieList = async () => {
    const list = await fetch(
      "http://localhost:4000/api/v1/users/postlist",
      {
        method: "GET"
      },
    );

    if (list.ok) {
      list
        .json()
        .then((userdata) => {
          // console.log((userdata?.data?.listOfPost), "This is Post Datas")
          setPostList(userdata?.data?.listOfPost)
        })
    }
  };



  useEffect(() => {
    fetchMovieList()
  }, [])



  return (
    <>
      {
        postList.length > 0 && postList.map(items =>
        (
          <Postdetails key={items.id} {...items} />
        ))
      }
    </>
  );
};
export default Post;
