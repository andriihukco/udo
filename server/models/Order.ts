import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
  productId: string;
  productType: 'product' | 'print';
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder extends Document {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'items.productType',
  },
  productType: {
    type: String,
    required: true,
    enum: ['product', 'print'],
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  image: {
    type: String,
    required: true,
  },
});

const ShippingAddressSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
});

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    items: {
      type: [CartItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function(v: CartItem[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one item is required',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent overwriting during hot reloads
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 