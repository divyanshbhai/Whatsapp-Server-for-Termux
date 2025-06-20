const express = require("express");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode-terminal");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mime = require("mime-types");

const app = express();
const port = 3000;

app.use(express.json());

let sock;

// Start WhatsApp connection
const startSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("📱 Scan this QR Code in WhatsApp:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("❌ Connection closed. Reconnecting:", shouldReconnect);
            if (shouldReconnect) {
                startSock();
            }
        } else if (connection === "open") {
            console.log("✅ WhatsApp connection is ready!");
        }
    });
};

startSock();

// ✅ /status
app.get("/status", (req, res) => {
    if (sock?.user) {
        res.send({ success: true, connected: true, user: sock.user });
    } else {
        res.send({ success: false, connected: false });
    }
});

// ✅ /send-message
app.post("/send-message", async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).send({ success: false, error: "Missing number or message" });
    }

    const jid = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;

    try {
        await sock.sendMessage(jid, { text: message });
        res.send({ success: true, message: "Message sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// ✅ /send-image
app.post("/send-image", async (req, res) => {
    const { number, imageUrl, caption } = req.body;

    if (!number || !imageUrl) {
        return res.status(400).send({ success: false, error: "Missing number or imageUrl" });
    }

    const jid = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;

    try {
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        const mimeType = response.headers.get("content-type") || mime.lookup(imageUrl);

        await sock.sendMessage(jid, {
            image: buffer,
            caption: caption || "",
            mimetype: mimeType
        });

        res.send({ success: true, message: "Image sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// ✅ /send-pdf
app.post("/send-pdf", async (req, res) => {
    const { number, pdfUrl, filename } = req.body;

    if (!number || !pdfUrl) {
        return res.status(400).send({ success: false, error: "Missing number or pdfUrl" });
    }

    const jid = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;

    try {
        const response = await fetch(pdfUrl);
        const buffer = await response.buffer();

        await sock.sendMessage(jid, {
            document: buffer,
            mimetype: "application/pdf",
            fileName: filename || "file.pdf"
        });

        res.send({ success: true, message: "PDF sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// ✅ /send-to-group
app.post("/send-to-group", async (req, res) => {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
        return res.status(400).send({ success: false, error: "Missing groupId or message" });
    }

    const jid = groupId.includes("@g.us") ? groupId : `${groupId}@g.us`;

    try {
        await sock.sendMessage(jid, { text: message });
        res.send({ success: true, message: "Message sent to group!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

 // ✅ /send-button-message (updated to use templateButtons)

app.post("/send-button-message", async (req, res) => {

    const { number, text, buttons } = req.body;

    console.log('updated working');

    if (!number || !text || !buttons || !Array.isArray(buttons)) {

        return res.status(400).send({ success: false, error: "Missing or invalid data" });

    }



    const jid = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;



    try {

        await sock.sendMessage(jid, {

            text,

            templateButtons: buttons

        });



        res.send({ success: true, message: "Button message sent!" });

    } catch (err) {

        console.error("❌ Error sending button message:", err);

        res.status(500).send({ success: false, error: err.message });

    }

});

// ✅ /send-button-message
app.post("/send-button-message", async (req, res) => {
    const { number, text, buttons } = req.body;

    if (!number || !text || !buttons || !Array.isArray(buttons)) {
        return res.status(400).send({ success: false, error: "Missing or invalid data" });
    }

    const jid = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;

    try {
        await sock.sendMessage(jid, {
            text,
            buttons,
            headerType: 1
        });

        res.send({ success: true, message: "Button message sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// 🌐 Start the server
app.listen(port, () => {
    console.log(`🚀 WhatsApp API server running at http://localhost:${port}`);
});
