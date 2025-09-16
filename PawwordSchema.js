import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
    password: String
})

export default mongoose.model("Password", PasswordSchema);