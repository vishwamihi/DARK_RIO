export default async (message, Matrix) => {
  const from = message.key.remoteJid;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    timeZone: 'Asia/Colombo',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Send the message with the current date
  await Matrix.sendMessage(from, { text: `📅 *Current date is*: ${currentDate}` });

  // Optionally, add a reaction
  await Matrix.sendMessage(from, { react: { text: '📅', key: message.key } });
};
