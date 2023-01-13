const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvent = async (message, fileName = "tech-notes.log") => {
  // Get the current date and time in the required format
  const dateTime = format(new Date(), "dd-MM-yyyy HH:mm:ss");
  // Create the string to be logged
  const logItem = `${uuid()}\t${dateTime} \t${message}\n`;

  const LOG_FOLDER_PATH = path.join(__dirname, "..", "logs");
  const LOG_FILE_PATH = path.join(__dirname, "..", "logs", fileName);
  const MAX_LOG_FILE_SIZE_IN_KB = 10;

  try {
    // Create the log folder in client machine (if doesn't already exist)
    if (!fs.existsSync(LOG_FOLDER_PATH)) {
      await fsPromise.mkdir(LOG_FOLDER_PATH);
    }
    // If file doesn't exist append message
    if (!fs.existsSync(LOG_FILE_PATH)) {
      await fsPromise.appendFile(LOG_FILE_PATH, logItem);
    } else {
      // Read size of file
      // If size greater than 10KB, replace content else append
      const fileSizeInBytes = (await fsPromise.stat(LOG_FILE_PATH)).size;
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > MAX_LOG_FILE_SIZE_IN_KB) {
        await fsPromise.writeFile(LOG_FILE_PATH, logItem);
      } else {
        await fsPromise.appendFile(LOG_FILE_PATH, logItem);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  logEvent(`${req.method} ${req.originalUrl}`, "tech-notes.log");
  next();
};

module.exports = { logEvent, logger };
