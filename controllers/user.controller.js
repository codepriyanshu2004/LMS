import User from "../model/user.model.js"
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge: 7*24*60*60*1000, //7 days
    httpOnly:true,
    secure:true
}

const register = async(req,res,next) =>{
    const {fullName,email,password} = req.body;
    
    if(!fullName || !email || !password){
        return next(new AppError("All fields are required",400));

    }

    const userExist = User.findOne({email});

    if(userExist){
        return next(new AppError("Email already exist",400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:"https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"
        }

    });

    if(!user){
        return next(new AppError("User registtration failed, please try again",400));
    }
    
    //TODO: File upload;

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie("token",token,cookieOptions);

    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user,
    });


};

const login = async (req,res) =>{
    
    const {email,password} = req.body;

   try {

     if(!email || !password){
        return next(new AppError("All field are required",400));

    }

    const user = await User.findOne({email}).select("+password");

    if(!user || !user.comparePassword(password)){
        return next(new AppError("Email or Password does not mathc",400));

    }

     const token = await user.generateJWTToken();
     
     user.password = undefined;

    res.cookie("token",token,cookieOptions);

    res.status(201).json({
        success:true,
        message:"User loggedin successfully",
        user,
    });
    
   } catch (error) {

     return next(new AppError(e.message,500));
   }


} 

const logout = (req,res) =>{

    res.cookie("token",null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })
    

};



const getProfile = (req,res) =>{
    
}

export {
    register,
    login,
    logout,
    getProfile
}