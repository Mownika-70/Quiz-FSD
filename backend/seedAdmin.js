require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const adminUsername = 'sparkie';
    const adminPassword = 'admin123'; 

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    await new User({ username: adminUsername, password: hashed, role: 'admin' }).save();
    console.log('Admin created successfully!');
    process.exit();
  })
  .catch(err => console.error(err));
