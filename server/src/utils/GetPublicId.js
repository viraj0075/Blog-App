export const GetPublicId = (url) => {
    // Split the URL by '/' and get the last part which contains the public ID and extension
    const parts = url?.split('/');
    console.log(parts);
    const filename = parts[parts?.length - 1];
    
    // Split the filename by '.' and get the first part which is the public ID
    const publicId = filename?.split('.')[0];
    
    return publicId;
  };