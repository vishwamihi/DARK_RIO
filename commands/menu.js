import pkg from '@whiskeysockets/baileys';
const { MessageType, proto, generateWAMessageFromContent, prepareWAMessageMedia } = pkg;
import os from 'os';

async function sendMenu(client, message) {
  try {
    const from = message.key.remoteJid;
    const mode = 'ExampleMode';  // Replace with actual mode if available
    const runMessage = 'ExampleRunMessage';  // Replace with actual runtime message if available

    // Define the command list
    const commandList = `
╭─★ *ᴄᴏᴍᴍᴀɴᴅꜱ* ★─╮
  .ping  : Get the bot's response time.
  .time  : Get the current time.
  .date  : Get the current date.
  .menu  : Show this list of commands.
╰────────────────╯`;

    // Menu text with image and command list
    const menuText = `
╰─╴─★ *ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ* ★─╴──╯
╭─★────────────★─╮
  🔐 *ʙᴏᴛ ɴᴀᴍᴇ* : *ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ*
  👨‍💻 *ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ* : *ᴅᴀʀᴋ-ʀɪᴏ-ʙʀᴏᴛʜᴇʀꜱ*
  💦 *ᴡᴏʀᴋᴛʏᴘᴇ* : *${mode}*
  🎓 *ᴘʀᴇꜰɪx* : *[Multi-Prefix]*
  📞 *ɴᴜᴍʙᴇʀ* : 94702481115
  📡 *ᴘʟᴀᴛꜰᴏʀᴍᴇ* : *${os.platform()}*
  ───★ ʀᴜɴᴛɪᴍᴇ ★───
  ${runMessage}
╰─★──────────★───╯
> ᴄᴇʏʟᴏɴ ʙᴇꜱᴛ ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ
*Available Commands:*
${commandList}`;

    // URL of the image
    const imageUrl = 'https://i.ibb.co/C26D2mF/ethix.jpg';

    // Prepare media message
    const mediaMessage = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: client.waUploadToServer });

    // Create the message content with caption
    const messageContent = {
      imageMessage: mediaMessage.imageMessage,
      caption: menuText,
    };

    // Generate the full message from content
    const preparedMessage = generateWAMessageFromContent(from, proto.Message.fromObject({ imageMessage: messageContent.imageMessage }), {});

    // Send the message
    await client.relayMessage(from, preparedMessage.message, { messageId: preparedMessage.key.id });

    // Send a reaction to the message (if reactions are supported)
    await client.sendMessage(from, {
      react: {
        text: '🦜',
        key: message.key
      }
    });

  } catch (error) {
    console.error("Failed to send menu message:", error);
    // Send a user-friendly error message to the user
    await client.sendMessage(from, { text: 'An error occurred while processing your request.' }, MessageType.text);
  }
}

export default sendMenu;
