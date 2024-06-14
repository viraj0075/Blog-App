import jwt from "jsonwebtoken";
const genrateAccessToken = async (_id,email,username,password) => {
    const jwtAccessToken = await jwt.sign(
      {
        _id: _id,
        username:username,
        email: email,
        password: password,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    return jwtAccessToken;
  };

const veriftJwtToken = async (token) => {
    const verifiedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    console.log("Verifird Tokem",verifiedToken)
    return verifiedToken;
  };

export {genrateAccessToken,veriftJwtToken};