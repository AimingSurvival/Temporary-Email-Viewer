# 📧 Custom Temporary Email Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

A sleek, open-source temporary email client that lets you **monitor pre-existing disposable inboxes** using the free, keyless [1secmail](https://www.1secmail.com/) API. Unlike generators that create random addresses for you, this tool allows you to input *any* username and domain combination—perfect for checking emails sent to addresses you've already used elsewhere.

![App Screenshot](https://via.placeholder.com/800x450/1e293b/ffffff?text=Custom+Temp+Email+Viewer)

---

## ✨ Why This Project?

Most temporary email tools **generate** a random address for you. This project is different:

- 🔍 **Input Existing Addresses** – Check emails sent to *any* 1secmail address you (or someone else) already used.
- 🔄 **Live Auto-Polling** – Inbox refreshes every 6 seconds without UI flicker or scroll jumps.
- 🛡️ **Secure HTML Rendering** – Sanitizes email bodies via DOMPurify to prevent XSS attacks.
- 📱 **Responsive Split-Pane Layout** – Desktop side-by-side view; mobile-friendly stacked layout.
- ⚡ **Zero API Keys** – 1secmail requires no authentication, no rate-limit anxiety, no signup.

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | React 18 (Vite)                   |
| Styling      | Tailwind CSS 3                    |
| Icons        | Lucide React                      |
| HTTP Client  | Native Fetch API                  |
| Sanitization | DOMPurify                         |
| API          | [1secmail](https://www.1secmail.com/api/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/custom-temp-email-viewer.git
cd custom-temp-email-viewer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Static files are emitted to the `dist/` directory, ready for deployment on Vercel, Netlify, or GitHub Pages.

---

## 🔌 API Reference

This project consumes the **1secmail REST API** (`https://www.1secmail.com/api/v1/`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `?action=getDomainList` | `GET` | Returns an array of supported domains. |
| `?action=getMessages&login={user}&domain={domain}` | `GET` | Fetches the inbox message list. |
| `?action=readMessage&login={user}&domain={domain}&id={msgId}` | `GET` | Retrieves full message body, attachments, and metadata. |
| `?action=downloadAttachment&login={user}&domain={domain}&id={msgId}&file={filename}` | `GET` | Downloads an attached file. |

> **Note:** 1secmail is a public, keyless API. Be mindful of fair-use policies and avoid aggressive polling intervals below 5 seconds.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

Please ensure your code follows the existing style, includes meaningful comments, and passes a quick smoke test in the dev server.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Built with ☕ by <a href="https://github.com/yourusername">Your Name</a></p>
