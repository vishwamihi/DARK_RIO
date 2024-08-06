import ping from "./commands/ping.js";
import time from "./commands/time.js";
import date from "./commands/date.js"; 
import menu from "./commands/menu.js";  // This should now work correctly

let lastProcessed = new Map();  // To store timestamps of last processed messages

export const Handler = async (chatUpdate, Matrix, logger) => {
  try {
    const message = chatUpdate.messages[0];
    if (!message.message) return;

    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? message.key.participant : from;

    console.log(`Received a message from ${sender}`);

    // Check for duplicate message processing
    const currentTime = new Date().getTime();
    if (lastProcessed.has(from) && (currentTime - lastProcessed.get(from)) < 5000) {
      // Skip processing if last message was processed less than 5 seconds ago
      return;
    }
    lastProcessed.set(from, currentTime);

    // Command prefix
    const prefix = /^[\\/!#.]/gi.test(message.message.conversation) ? message.message.conversation.match(/^[\\/!#.]/gi)[0] : '.';
    const command = message.message.conversation.startsWith(prefix) ? message.message.conversation.slice(prefix.length).toLowerCase() : '';

    // Handle commands
    if (command === 'ping') {
      await ping(message, Matrix);
    } else if (command === 'time') {
      await time(message, Matrix);
    } else if (command === 'date') {
      await date(message, Matrix);
    } else if (command === 'menu') {
      await menu(message, Matrix);  // Handle the .menu command
    } else {
      // Optionally handle unknown commands
      console.log(`Unknown command: ${command}`);
    }
  } catch (err) {
    logger.error("Error handling message:", err);
  }
};

export const Callupdate = async (json, Matrix) => {
  console.log("Call update:", json);
  // Handle call updates
};

export const GroupUpdate = async (Matrix, message) => {
  console.log("Group update:", message);
  // Handle group participant updates
};
