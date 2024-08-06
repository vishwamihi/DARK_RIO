import dotenv from "dotenv";
dotenv.config();

import {
  makeWASocket,
  Browsers,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import express from "express";
import pino from "pino";
import fs from "fs";
import NodeCache from "node-cache";
import path from "path";
import chalk from "chalk";
import axios from "axios";
import fetch from "node-fetch";
import { Handler, Callupdate, GroupUpdate } from "./Handler.js";

// Environment Variables
const sessionName = "session";
const PORT = process.env.PORT || 3000;
const SESSION_ID = process.env.SESSION_ID;
const MAIN_LOGGER = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const app = express();

// Path Setup
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const sessionDir = path.join(__dirname, "session");
const credsPath = path.join(sessionDir, "creds.json");

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Download session data from pastebin using SESSION_ID
async function downloadSessionData() {
  if (!SESSION_ID) {
    console.error("Please add your session to SESSION_ID env !!");
    process.exit(1);
  }
  const sessdata = SESSION_ID.split("DARK-RIO-MD&")[1];
  const url = `https://pastebin.com/raw/${sessdata}`;
  try {
    const response = await axios.get(url);
    const data = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    await fs.promises.writeFile(credsPath, data);
    console.log("🔒 Session Successfully Loaded !!");
  } catch (error) {
    console.error("Failed to download session data:", error);
    process.exit(1);
  }
}

if (!fs.existsSync(credsPath)) {
  downloadSessionData();
}

let initialConnection = true;

async function start() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`🌠 DARK-RIO-MD WA BOT v${version.join(".")}, isLatest: ${isLatest}`);

    const Matrix = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: true,
      browser: ["DARK-RIO-MD", "safari", "3.3"],
      auth: state
    });

    Matrix.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
          start();
        }
      } else if (connection === "open") {
        if (initialConnection) {
          console.log(chalk.green("DARK-RIO-MD CONNECTED 🌠"));
          Matrix.sendMessage(Matrix.user.id, {
            text: `> 🦜 ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ ɪꜱ ᴡᴏʀᴋɪɴɢ ɴᴏᴡ`
          });
          initialConnection = false;
        } else {
          console.log(chalk.blue("DARK-RIO-MD RESTART SESSION 🌠."));
        }
      }
    });

    Matrix.ev.on("creds.update", saveCreds);

    Matrix.ev.on("messages.upsert", async (chatUpdate) => await Handler(chatUpdate, Matrix, logger));
    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
    Matrix.ev.on("group-participants.update", async (message) => await GroupUpdate(Matrix, message));

  } catch (error) {
    console.error("Critical Error:", error);
    process.exit(1);
  }
}

start();

app.get("/", (req, res) => {
  res.send("> 🦜 ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ ɪꜱ ᴡᴏʀᴋɪɴɢ ɴᴏᴡ");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
