import mongoose, { Schema } from 'mongoose';

const LabelSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
    },
    color: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Label', LabelSchema);
