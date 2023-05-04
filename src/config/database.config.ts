import mongoose from "mongoose"; 
import dotenv from "dotenv"

dotenv.config();

export const db = async () => { 
  try { await mongoose.connect(process.env.MONGO_URL!, { useNewUrlParser: true, 
    useUnifiedTopology: true, } as mongoose.ConnectOptions); 
  } catch (err) { console.log(err); } };