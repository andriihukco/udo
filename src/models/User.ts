import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: Date;
  updatedAt: Date;
}

// Get or create User model
export function getUserModel(): Model<IUser> {
  // Check if the model is already defined
  try {
    return mongoose.model<IUser>('User');
  } catch {
    // Define the model if it doesn't exist
    const UserSchema = new mongoose.Schema<IUser>(
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

    return mongoose.model<IUser>('User', UserSchema);
  }
}

export default getUserModel(); 