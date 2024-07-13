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
      <div className="bg-[#030d2e] min-h-screen p-4 md:p-8">

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {
            postList.length > 0 && postList.map(items =>
            (
              <Postdetails key={items.id} {...items} />
            ))
          }
        </div>
      </div>

    </>
  );
};
export default Post;
