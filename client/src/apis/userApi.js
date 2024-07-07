export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary");
  }
  const data = await response.json();
  console.log(data);
  console.log(data?.secure_url);
  return data?.secure_url;
};


export const registerUser = async (userData,id) => 
{
    console.log(userData,id)
    const response = await fetch("http://localhost:4000/api/v1/users/updateuser/" + id,
      {
        method:'PUT',
        credentials:"include",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(userData)
      }
    );
    if(!response.ok)
    {
       throw new Error("Failed to put the data")
    }
    const data = await response.json();
    console.log(data,"This is the Updated Data");
    return data;

}

export const getUserByIdData = async (id) =>
{
     const response = await fetch("http://localhost:4000/api/v1/users/userdetails/" + id,
      {
        method:"GET",
        credentials:"include"
      }
     );
     if(!response.ok)
     {
        throw new Error("Error in Fetching details of User")
     }
     const data = await response.json();
     console.log(data,"This is the User data by id");
     return data;
}