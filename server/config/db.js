import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrivision';
  const localUri = 'mongodb://127.0.0.1:27017/agrivision';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Primary Database connection failed: ${error.message}`);
    
    if (primaryUri !== localUri) {
      console.log(`Attempting fallback to local MongoDB instance: ${localUri}`);
      try {
        const conn = await mongoose.connect(localUri);
        console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
      } catch (localError) {
        console.error(`❌ Local database fallback also failed: ${localError.message}`);
        console.warn('⚠️ WARNING: Running server without database connection. Data persistence disabled.');
      }
    } else {
      console.warn('⚠️ WARNING: Running server without database connection. Data persistence disabled.');
    }
  }
};

export default connectDB;
