import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
    },
    description: {
      type: String,
    },

    list: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'Please provide list'],
    },

    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    due_date: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Task', TaskSchema);
