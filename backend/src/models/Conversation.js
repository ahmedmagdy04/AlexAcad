import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    // Stored for registration validation bubbles so they survive page reloads
    validation: {
      type: [mongoose.Schema.Types.Mixed],
      default: undefined
    }
  },
  { timestamps: true }
)

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      default: "New Chat",
      maxlength: 120
    },
    messages: {
      type: [messageSchema],
      default: []
    }
  },
  { timestamps: true }
)

export default mongoose.model("Conversation", conversationSchema)
