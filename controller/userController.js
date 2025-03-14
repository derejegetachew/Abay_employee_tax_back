const axios = require('axios');
const AppError = require("../utils/appError");
const catchasyncHandler = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
// get  user login
const loginUser = catchasyncHandler(async (req,res)=>{
  const {username, password} = req.body;
  if (!username | !password) {
    throw new AppError(`All Fields are mandatory.`, 400);
  }
  const response = await axios.post(process.env.LOGIN_API, {
    username,
    password,
  });
   if(response.data.message!="SUCCESS"){
    throw new AppError(`The user have no access please check Your user name and password .`, 401);
   }
   else{ 
    const allowedBranchIds = ['112','423', '473']; 

    if (response.data.branch_type === 'HQ' && !allowedBranchIds.includes(response.data.branch_id)) {
        throw new AppError(`Your department has no access. Please check your username and password.`, 401);
    }
    const accessToken=jwt.sign({
        user:response.data    
       }, 
  process.env.ACCESS_TOKEN_SECERET,
  {expiresIn:"50m"}
  );
  res.status(200).json({accessToken});
}
});
module.exports={loginUser}
