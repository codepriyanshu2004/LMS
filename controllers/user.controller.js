
import User from "../model/user.model.js"
import AppError from "../utils/error.util.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";

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

    const userExist = await User.findOne({email});

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

    if(req.file){
        console.log(req.file);

        try {
           const result = await cloudinary.uploader.upload(req.file.path, {
                folder:"lms",
                width:250,
                height:250,
                gravity:"faces",
                crop:"fill"
            });

            if(result){
                user.avatar.public_id= result.public_id;
                user.avatar.secure_url= result.secure_url;

                //Remove file from server

              await  fs.rm(`uploads/${req.file.filename}`)
            }
            
        } catch (error) {
            return next(new AppError(error || "File not uploaded, please try again",500));
            
        }
        
    }

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

const login = async (req,res,next) =>{
    
    const {email,password} = req.body;

   try {

     if(!email || !password){
        return next(new AppError("All field are required",400));

    }

    const user = await User.findOne({email}).select("+password");

    
    if (!user) {
      return next(new AppError("Email or password does not match", 400));
    }

   
      const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError("Email or password does not match", 400));
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

     return next(new AppError(error.message,500));
   }


} ;

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



const getProfile = async (req,res) =>{

   try {

     const userId = req.user.id;
    const user = await User.findById(userId);
    
    res.status(200).json({
        success:true,
        message:"User details",
        user
    })
    
   } catch (e) {

    return next(new AppError("Failed to fatch profile"),500);
    
   }
    
}

const forgotPassword = async(req,res,next)=>{
    
    const {email} = req.body;

    if(!email){
        return next(new AppError("Email is required",400));
    }

    const user = await User.findOne({email});

    if(!user){
         return next(new AppError("Email not registered",400));

    }
   
    const resetToken = await user.generatePasswordToken();
    
    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
    console.log(resetPassword);
    
      const subject = "Reset Password";
      const message = `
    <p>You requested a password reset.</p>
    <p>
        <a href="${resetPasswordURL}">Reset your password</a>
    </p>
    <p>If you did not request this, please ignore this email.</p>
`;

    try {
        await sendEmail(email, subject, message);
        
        res.status(200).json({
            success:true,
            message: `Reset password token has been sent to ${email} successfully`
        })
    } catch (error) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();
        return next(new AppError(error.message,500))
    }

}

const resetPassword = (req,res)=>{

}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword
}