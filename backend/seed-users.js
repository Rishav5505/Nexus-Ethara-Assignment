const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/astral-flow-sync').then(async () => {
  const User = require('./models/User');
  const pwd = await bcrypt.hash('password123', 10);
  
  await User.updateOne(
    { email: 'alex@example.com' }, 
    { $set: { name: 'Alex Admin', password: pwd, role: 'admin' } }, 
    { upsert: true }
  );
  
  await User.updateOne(
    { email: 'sarah@example.com' }, 
    { $set: { name: 'Sarah Member', password: pwd, role: 'member' } }, 
    { upsert: true }
  );
  
  console.log('Users seeded successfully!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
