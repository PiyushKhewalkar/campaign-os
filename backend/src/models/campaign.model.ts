import mongoose from "mongoose"

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    postIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    platforms: [{
        type: String,
        enum: ["x", "instagram", "linkedin", "reddit"],
        required: true
    }]
},
{
    timestamps: true
}
)

const Campaign = mongoose.model("Campaign", campaignSchema)

export default Campaign