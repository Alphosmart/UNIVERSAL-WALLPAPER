const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.log('MongoDB connection error:', err);
        throw err;
    }    
}

module.exports = connectDB