import mongoose from 'mongoose';

const getShortHost = (host) => {
  if (!host) return 'unknown';
  if (host === '127.0.0.1' || host.toLowerCase() === 'localhost') {
    return '127.0.0.1';
  }
  if (host.includes('.mongodb.net')) {
    const parts = host.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      const tenant = parts[parts.length - 3];
      const cleanSub = subdomain.split('-shard-')[0];
      if (cleanSub.startsWith('ac-') || cleanSub.length > 15) {
        return `${tenant}.mongodb.net`;
      }
      return `${cleanSub}.${tenant}.mongodb.net`;
    }
  }
  return host;
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrivision';
  const localUri = 'mongodb://127.0.0.1:27017/agrivision';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${getShortHost(conn.connection.host)}`);
  } catch (error) {
    console.error(`⚠️ Primary Database connection failed: ${error.message}`);
    
    if (primaryUri !== localUri) {
      console.log(`Attempting fallback to local MongoDB instance: ${localUri}`);
      try {
        const conn = await mongoose.connect(localUri);
        console.log(`MongoDB Connected (Local Fallback): ${getShortHost(conn.connection.host)}`);
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
