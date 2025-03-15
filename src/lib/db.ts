import mongoose from 'mongoose';

// Primary MongoDB URI (Atlas)
const MONGODB_URI = process.env.MONGODB_URI;
// Fallback to local MongoDB if available
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/udo-druk';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not defined, will try to use local MongoDB');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      retryReads: true,
    };

    // Try to connect to the primary MongoDB first
    try {
      console.log('Attempting to connect to primary MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('Connected to primary MongoDB');
        return mongoose;
      });
    } catch (primaryError) {
      console.error('Failed to connect to primary MongoDB:', primaryError);
      
      // If primary connection fails, try the local fallback
      console.log('Attempting to connect to local MongoDB...');
      cached.promise = mongoose.connect(LOCAL_MONGODB_URI, opts).then((mongoose) => {
        console.log('Connected to local MongoDB');
        return mongoose;
      });
    }
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 