import mongoose from "mongoose";

const connect = async ()=>{
    try {
        const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance' 
        await mongoose.connect(dbUrl)
        console.log("Data Base Connected Successfully!!")
    } catch (error ) {
        console.log("Error While Connecting to the Database." , error.message)
        process.exit(1)        
    }
    
}
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("Database connection closed due to application termination.");
    process.exit(0);
});
export default connect;