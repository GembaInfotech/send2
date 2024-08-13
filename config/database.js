const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

class Database {
  constructor(uri, options = {}) {
    this.uri = uri;
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    };
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, this.options);
      console.log(
        `Connected to database: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error connecting to database:`,
        error
      );
      // Retry logic could be added here
      process.exit(1); // Optionally exit the process if a critical failure
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(
        `Disconnected from database: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error disconnecting from database:`,
        error
      );
    }
  }
}

module.exports = Database;
