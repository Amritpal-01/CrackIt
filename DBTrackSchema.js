import mongoose from "mongoose";

const DBTrackSchema = new mongoose.Schema({
    trackId : String,
    passTrack : String,
    digiTrack : Number
})

export default mongoose.model("DBTrack", DBTrackSchema);