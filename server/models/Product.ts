import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the product'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the product'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price for the product'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image for the product'],
      validate: {
        validator: function(v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for the product'],
      enum: {
        values: ['clothing', 'accessories', 'home', 'stationery', 'other'],
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
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product; 