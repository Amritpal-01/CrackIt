import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
    password: Number
})

export default mongoose.model("Password", PasswordSchema);