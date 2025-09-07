import mongoose from "mongoose";

const connetDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/codeclash");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Mongoose Connection Error", error);
    process.exit(1);
  }
};

export default connetDB;
