const app = require('./app');
const dotenv = require('dotenv');
const { path } = require('./app');
const connectDataBase = require('./config/database');
// handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message); // print the error message  to the console  for debugging   purposes
    process.exit(1); // exit the process with an error code
});

// configure
dotenv.config({ path: "backend/config/config.env" });
connectDataBase();
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

// unhandeled promise error
process.on('unhandledRejection', (err) => {
    console.log('Unhandled EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message); // print the error message  to the console  for debugging   purposes
    // close server and exit process
    server.close(() => process.exit(1));
});

