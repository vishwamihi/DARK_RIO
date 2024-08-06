export default async (message, Matrix) => {
  const from = message.key.remoteJid;

  // Send 'Pinging...' message and store the message ID
  const pingMessage = await Matrix.sendMessage(from, { text: '```Pinging...```' });

  // React with an emoji to the original message
  await Matrix.sendMessage(from, { react: { text: '⚡', key: message.key } });

  // Calculate response time
  const start = new Date().getTime();
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));  // Adjust delay as needed
  const end = new Date().getTime();
  const responseTime = (end - start) / 1000;

  // Update the 'Pinging...' message with response time
  await Matrix.sendMessage(from, {
    text: `*Pong! Response time: ${responseTime.toFixed(2)} s*`,
    quoted: pingMessage,
  });

  // Delete the original 'Pinging...' message
  await Matrix.deleteMessage(from, pingMessage.key);
};
