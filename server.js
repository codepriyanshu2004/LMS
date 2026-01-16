
import app from "./app.js"
import connectToDb from "./config/db.connection.js";


const PORT  = process.env.PORT || 5000;




app.listen(PORT, async()=>{
    await connectToDb();
    console.log(`App is running at http:localhost:${PORT}`);
    

});
