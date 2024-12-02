import { InferSchemaType, model, Schema } from "mongoose";

// create a note schema
const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    text: { type: String },
  },
  { timestamps: true }
);

// define type of this noteSchema
type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
