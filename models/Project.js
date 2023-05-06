import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 1,
      required: [true, 'Please provide title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export default mongoose.model('Project', ProjectSchema);
