import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

// Log the MongoDB URI to verify it's loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');

// Define User schema directly in this script
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password should be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    // Check if MongoDB URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ email: 'marina@u-do.shop' });
    
    if (existingAdmin) {
      console.log('Superadmin already exists');
      return;
    }

    // Create superadmin user
    const superadmin = new User({
      name: 'Marina',
      email: 'marina@u-do.shop',
      password: 'motherlord', // Will be hashed by the pre-save hook
      role: 'superadmin',
    });

    await superadmin.save();
    console.log('Superadmin user created successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seedAdmin(); 