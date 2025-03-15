import mongoose, { Schema, Document } from 'mongoose';

export interface IPrint extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrintSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the print'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the print'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price for the print'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image for the print'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for the print'],
      enum: {
        values: ['abstract', 'landscape', 'portrait', 'urban', 'nature', 'other'],
        message: '{VALUE} is not a valid category',
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent overwriting during hot reloads
const Print = mongoose.models.Print || mongoose.model<IPrint>('Print', PrintSchema);

export default Print; 