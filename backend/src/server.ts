import express from "express"
import cors from "cors"
import campaignRouter from "./routes/campaign.routes.js"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import connectToDatabase from "./database/db.js"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/errorHandler.middleware.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001


const allowedOrigins = [
    "http://localhost:5173",
    "https://campaign-os.vercel.app",
    "https://campaignos.billiondollardevs.com",
  ]
  
  app.use(
    cors({
      origin: function (origin, callback) {

        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      },
      credentials: true,
    })
  )

app.use(express.json())

// Routes
app.use("/api/campaign", campaignRouter)
app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)

app.use("/", (req, res) => {
    res.status(200).json({message: "App is live"})
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, async()=> {
    console.log(`App is listening on http://localhost:${PORT}`)
    await connectToDatabase()
})