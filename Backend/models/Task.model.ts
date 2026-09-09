import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  assignedTo: mongoose.Types.ObjectId;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assignee is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;