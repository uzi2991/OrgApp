import mongoose, { Schema } from 'mongoose';

const ListSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
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
