import mongoose from "mongoose";
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required"],
      validate: {
        validator: function (v) {
          if (typeof v !== "string") return false;
          return v !== v.toUpperCase();
        },
        message: function (props) {
          return `Title Shouldn't Be Entirely Uppercase`;
        },
      },
    },
    content: {
      type: String,
      required: [true, "Content Is Required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    collection: "ROUTE_NOTES",
    timestamps: true,
  },
);
noteSchema.index({ content: "text", title: "text" });
export const NoteModel =
  mongoose.models.Note || mongoose.model("Note", noteSchema);
