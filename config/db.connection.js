import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectToDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/LMS"
    );

    if (connection) {
      console.log(`Connected to MongoDb: ${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToDb;
