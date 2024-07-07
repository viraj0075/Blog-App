// src/UserProfile.js
import React, { useEffect, useState } from 'react';
import { uploadToCloudinary,registerUser,getUserByIdData } from '../apis/userApi';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../store/userSlice';


const UserProfile = () => {
  const {id} = useParams();
  const [userData, setUserData] = useState({
    file: null,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [uploading, setUploading] = useState(false);
  const [imagelink,setImageLink]= useState("");
  const newUserName = useSelector(state =>  state.user.name);
  console.log(newUserName)
  const dispatch = useDispatch();



  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    if (name === "file") {
      console.log(files?.[0])
      setUserData({ ...userData, file: files[0] })
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
    console.log(userData)
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { file, username, email, password, confirmPassword } = userData;
    console.log(file, username, email, password, confirmPassword);
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setUploading(true);
    try {
    let imageUrl = imagelink;
      if(file)
      {
      const data =  await uploadToCloudinary(file)
       console.log(data);
       imageUrl = data;
       setImageLink(data)
        // console.log(imageUrl)  
      }
      await registerUser({ username, password, imageUrl },id);
      alert('User registered successfully!');
      setUploading(false);
    }
    catch (err) {
      console.error('Error uploading file or user data:', err);
      alert('Failed to upload file or register user.');
      setUploading(false);
    }


  
    console.log('Form submitted:', userData);
  };

  const getUserDetails = async () => 
  {
     const userDataById = await getUserByIdData(id);
     const {username,email,imageUrl} = userDataById?.data?.userData;
     setUserData({
      username:username,
      email:email,
     })
     setImageLink(imageUrl);  
     dispatch(updateUserInfo(userDataById?.data?.userData));
  }
  useEffect(() => 
  {
    getUserDetails();
  },[])

  return (
    <div className="min-h-screen bg-[#030d2e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-transparent shadow-md rounded-lg p-6">
        <div className="flex justify-center -mt-16">
          <img
            className="w-32 h-32 rounded-full border-2 border-white object-cover"
            src={imagelink || "https://via.placeholder.com/150"}
            alt="User profile"
          />
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-gray-100">Profile</h2>
        </div>
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-100">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-100">Email</label>
            <input
              readOnly
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-100">Update Profile Image</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              placeholder="Enter URL of your profile photo"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-100">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-100">Confirm Password</label>
            <input
              type="text"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter confirm password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            disabled={uploading}
          >
            {uploading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
