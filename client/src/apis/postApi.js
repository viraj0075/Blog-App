import { uploadToCloudinary } from "./userApi";

export const postById = async (id) => {
  const postById = await fetch(
    `http://localhost:4000/api/v1/users/postdetails/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!postById.ok) {
    throw new Error("Failed to Get Post By Id");
  }
  const data = await postById.json();
  // console.log("This is Post By Id",data);
  return data;
};


export const newPost = async(incomingData) => 
{
  console.log(incomingData);
  const {title,summary,text} = incomingData;
  let {file} = incomingData;
  console.log(title,summary,text,file,"data from create post");

  let newObj;
  if(incomingData?.file)
  {
    const res = await uploadToCloudinary(incomingData?.file);
    newObj = {...incomingData,file:res};
    console.log("THis is the New post",newObj);
  }
  else{
    newObj = {...incomingData}
  }

  const post = await fetch(`http://localhost:4000/api/v1/users/createpost`,
    {
      method:"POST",
      credentials:"include",
      body:JSON.stringify(newObj),
      headers:{"Content-Type": "application/json"}
    }
  )
  const data = await post.json();
  console.log(data);
  return data;
}


export const editPost = async (id, incomingData) => {
  console.log(id, incomingData);

  const { title, summary, text } = incomingData;
  let { file } = incomingData;
  console.log(title, summary, text, file);

  let newObj;
  if (incomingData?.file) {
    const response = await uploadToCloudinary(incomingData?.file);
    newObj = {...incomingData,file:response};
    console.log(newObj);
  }
  else{
    newObj = {...incomingData}
  }

  const edit = await fetch(
    `http://localhost:4000/api/v1/users/editpost/` + id,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(newObj),
      headers:{"Content-Type": "application/json"}
    }
  );

  const data = await edit.json();
  console.log(data);
  return data;
};
