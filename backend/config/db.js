import mongoose from "mongoose";

const connectedDb = async () => {
    console.log("DB FUNCTION STARTED");

    try {
        console.log("MONGODB_URL EXISTS:", Boolean(process.env.MONGODB_URL));

        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected");
        return true;

    } catch (error) {
        console.error("MONGODB ERROR:");
        console.error(error.message);
        return false;
    }
};

export default connectedDb;