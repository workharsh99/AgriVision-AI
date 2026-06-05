import mongoose from 'mongoose';

// Shorten MongoDB Atlas hostname (e.g., ac-mfhk8zs-shard-00-00.owinezn.mongodb.net -> owinezn.mongodb.net)
const getShortHost = (host) => {
  if (host && host.includes('.mongodb.net')) {
    return host.split('.').slice(-3).join('.');
  }
  return host || 'localhost';
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/agrivision';

  try {
    // Try to connect to the cloud MongoDB Atlas database
    if (!primaryUri) {
      throw new Error('No MONGO_URI environment variable set');
    }
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${getShortHost(conn.connection.host)}`);
  } catch (error) {
    console.warn(`⚠️ Primary Database connection failed: ${error.message}`);
    console.log(`Attempting fallback to local MongoDB: ${localUri}`);
    
    try {
      // Connect to the local MongoDB database fallback
      const conn = await mongoose.connect(localUri);
      console.log(`MongoDB Connected (Local Fallback): ${getShortHost(conn.connection.host)}`);
    } catch (localError) {
      console.error(`❌ Local database fallback also failed: ${localError.message}`);
      console.warn('⚠️ WARNING: Running server without database connection. Data persistence disabled.');
    }
  }
};

export default connectDB;
