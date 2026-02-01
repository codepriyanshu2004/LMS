import AppError from "../utils/error.util.js";


const getRazorpayApiKey = async(req,res,next) =>{

    try {
        res.status(200).json({
            success:true,
            message: "Razorpay API key",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        
        return next(new AppError(error.message,500) )
    }

}


const buySubscription = async(req,res,next) =>{
    
}


const verifySubscription = async(req,res,next) =>{
    
}


const cancelSubscription = async(req,res,next) =>{
    
}


const allPayment = async(req,res,next) =>{
    
}

export  {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayment
}