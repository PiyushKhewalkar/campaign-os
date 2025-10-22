import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Campaign",
    },
    platform: {
      type: String,
      enum: ["x", "instagram", "linkedin", "reddit"],
      required: true,
    },

    // 💡 Fully dynamic JSON field
    script: [
      {
        type: mongoose.Schema.Types.Mixed, // allows any JSON structure
      },
    ],

    scheduled_on: { type: Date },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
