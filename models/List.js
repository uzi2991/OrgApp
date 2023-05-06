import mongoose, { Schema } from 'mongoose';

const ListSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Please provide project'],
    },
  },
  { timestamps: true },
);

export default mongoose.model('List', ListSchema);
