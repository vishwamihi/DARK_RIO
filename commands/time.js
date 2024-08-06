export default async (message, Matrix) => {
  try {
    const from = message.key.remoteJid;

    // Get the current time in Asia/Colombo timezone
    const options = {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Use 12-hour time format with AM/PM
    };

    const currentTime = new Intl.DateTimeFormat('en-GB', options).format(new Date());

    console.log(`Sending time message to ${from}: ${currentTime}`);

    // Send the time message
    await Matrix.sendMessage(from, { text: `*⌚ Current time is*: ${currentTime}` });

    console.log(`Time message sent to ${from}`);

    // React with the clock emoji
    await Matrix.sendMessage(from, {
      react: { text: '⌚', key: message.key }
    });

    console.log(`Reaction sent to ${from}`);
  } catch (error) {
    console.error("Failed to send time message or reaction:", error);
    // Optionally, send an error message to the user
    await Matrix.sendMessage(from, { text: 'An error occurred while processing your request.' });
  }
};
