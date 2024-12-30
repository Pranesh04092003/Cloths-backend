const mongoose = require('mongoose');

const connectDB = async () => {
  const chalk = (await import('chalk')).default;
  const MONGODB_URI = "mongodb+srv://test123:testing2003@cluster0.abeugnm.mongodb.net/E-commerce-cloths-Backend";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(chalk.bgYellow('Connected to DataBase'));
    console.log(chalk.blueBright('Database connected:', mongoose.connection.name));

  } catch (err) {
    console.error(chalk.red('Error connecting to MongoDB:', err));
    process.exit(1);
  }
};

module.exports = connectDB;
