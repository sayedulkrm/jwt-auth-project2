import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected on : ${connection.host}`);
    } catch (error) {
        console.log("Opps something happened during connect to Mongoose");
    }
};
