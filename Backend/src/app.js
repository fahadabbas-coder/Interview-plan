const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("./routes/auth")
const interviewRouter=require("./routes/interview")


const app = express()

if (!process.env.ORIGIN_URL) {
    throw new Error("ORIGIN_URL environment variable is required")
}

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}))

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is awake and running!',
    timestamp: new Date().toISOString()
  });
});



app.use("/api/auth", authRouter)
app.use("/api/interview",interviewRouter)


module.exports = app