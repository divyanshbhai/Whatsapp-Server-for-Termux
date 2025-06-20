# 📲 WhatsApp API Server on Android using Termux

*A complete guide from setup to sending messages via API*

---

## 📁 Table of Contents

1. [📦 Requirements](#requirements)
2. [📥 Step 1: Install Termux](#step-1-install-termux)
3. [⚙️ Step 2: Initial Termux Setup](#step-2-initial-termux-setup)
4. [🌐 Step 3: Give Storage Access](#step-3-give-storage-access)
5. [📂 Step 4: Create Project Directory](#step-4-create-project-directory)
6. [📚 Step 5: Install Required Packages](#step-5-install-required-packages)
7. [🧠 Step 6: Create index.js File](#step-6-create-indexjs-file)
8. [🚀 Step 7: Run the Script](#step-7-run-the-script)
9. [🔗 Step 8: Scan QR to Connect WhatsApp](#step-8-scan-qr-to-connect-whatsapp)
10. [📡 Step 9: Find Your IP Address](#step-9-find-your-ip-address)
11. [🧪 Step 10: Test APIs via Postman](#step-10-test-apis-via-postman)
12. [📌 API Endpoints Summary](#api-endpoints-summary)
13. [📁 Accessing Termux Files](#accessing-termux-files)
14. [📤 Exporting Project to Storage](#exporting-project-to-storage)
15. [🔒 Notes & Troubleshooting](#notes--troubleshooting)

---

## 📦 Requirements

* Android phone
* Internet connection (Wi-Fi preferred)
* Termux app (download from F-Droid or GitHub)
* WhatsApp account (must not be active on other devices)

---

## 📥 Step 1: Install Termux

Download the latest **Termux APK** from:

👉 [https://f-droid.org/packages/com.termux/](https://f-droid.org/packages/com.termux/)

Do **not** use the Play Store version (it's outdated).

---

## ⚙️ Step 2: Initial Termux Setup

Open Termux and run:

```bash
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg -y
```

Check versions:

```bash
node -v
npm -v
```

---

## 🌐 Step 3: Give Storage Access

To allow access to shared folders:

```bash
termux-setup-storage
```

Tap **Allow** when prompted.

---

## 📂 Step 4: Create Project Directory

```bash
mkdir whatsapp-server
cd whatsapp-server
```

---

## 📚 Step 5: Install Required Packages

```bash
npm init -y
npm install express @whiskeysockets/baileys qrcode-terminal node-fetch mime-types
```

Note: `node-fetch` is ESM-only now, so we will dynamically import it later.

---

## 🧠 Step 6: Create `index.js` File

Inside `whatsapp-server` folder, create the main server file:

```bash
nano index.js
```

Paste the **full working script** I gave you \[or ask again for it].

Save and exit with:
**CTRL + X → Y → Enter**

---

## 🚀 Step 7: Run the Script

```bash
node index.js
```

You'll see:

```
🚀 WhatsApp API server running at http://localhost:3000
📱 Scan this QR Code in WhatsApp:
```

---

## 🔗 Step 8: Scan QR to Connect WhatsApp

1. Open WhatsApp → Menu → Linked Devices → Link New Device
2. Scan the QR shown in Termux
3. Your session is now active!

---

## 📡 Step 9: Find Your IP Address (for API calls)

In Termux, run:

```bash
ip a
```

Find the `inet` address under `wlan0` (e.g., `192.168.0.178`)

---

## 🛠️ If `ip a` also fails

Install or use one of these alternatives:

### Option 1: `ifconfig` (Net-tools)

```bash
pkg install net-tools
```

Then run:

```bash
ifconfig
```

Look for `wlan0` and under it:

```
inet addr:192.168.1.103  Bcast:192.168.1.255  Mask:255.255.255.0
```

### Option 2: Use Android system settings (no command)

1. Go to **Settings** → **Wi-Fi**
2. Tap on the **connected Wi-Fi network**
3. Scroll to see the **IP address** (might be under "Advanced")



---

## 🧪 Step 10: Test APIs via Postman

Use the IP address + port:

```
http://192.168.0.178:3000/send-message
```

### Sample Body:

```json
{
  "number": "919999999999",
  "message": "Hello from Termux!"
}
```

Set header:

```
Content-Type: application/json
```

---

## 📌 API Endpoints Summary

| Endpoint               | Method | Description                    | Example Body JSON                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/send-message`        | POST   | Send a text message to a user  | `json { "number": "919999999999", "message": "Hello from Termux!" } `                                                                                                                                                                                                                                                                            |
| `/send-image`          | POST   | Send an image by URL           | `json { "number": "919999999999", "imageUrl": "https://example.com/image.jpg", "caption": "Here is your image" } `                                                                                                                                                                                                                               |
| `/send-pdf`            | POST   | Send a PDF file                | `json { "number": "919999999999", "pdfUrl": "https://example.com/sample.pdf", "filename": "Document.pdf" } `                                                                                                                                                                                                                                     |
| `/send-to-group`       | POST   | Send text to a WhatsApp group  | `json { "groupId": "1234567890-1234567890@g.us", "message": "Hello group!" } `                                                                                                                                                                                                                                                                   |
| `/send-button-message` | POST   | Send interactive buttons       | `json { "number": "919999999999", "text": "Choose an option:", "buttons": [ { "index": 1, "quickReplyButton": { "displayText": "Option A", "id": "opt_a" } }, { "index": 2, "quickReplyButton": { "displayText": "Option B", "id": "opt_b" } }, { "index": 3, "urlButton": { "displayText": "Visit Site", "url": "https://example.com" } } ] } ` |
| `/status`              | GET    | Check if WhatsApp is connected | *No body required*                                                                                                                                                                                                                                                                                                                               |

---

## 📁 Accessing Termux Files

To access your Termux project on Android:

```bash
cp -r ~/whatsapp-server ~/storage/downloads/
```

Now go to **Internal Storage > Downloads** via file manager.

---

## 📤 Exporting Project to PC

Connect your phone via USB, or use an app like:

* **ZArchiver** to zip the folder
* **Solid Explorer** to move files easily

---

## 🔒 Notes & Troubleshooting

* QR will expire if not scanned quickly.
* Baileys stores session in `auth` folder — do not delete it.
* WhatsApp Web may log out if used on another device.
* You must always run `node index.js` manually (or automate with Termux boot if needed).
* If `fetch` is not working, use:

```js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
```

---

## 🎁 Bonus: Automate on Reboot?

Install:

```bash
pkg install termux-api
```

Then add your `node index.js` to `.bashrc` or use `Termux:Boot` app.

---

## ✨ Done!

You've built a **full WhatsApp API Server on your phone** using Termux!

Let me know if you'd like this as:

* 📄 PDF
* 📝 Notion page
* 💻 GitHub README

Or if you'd like to add:

* File uploads
* Auto responder
* Web dashboard

Just say the word.
