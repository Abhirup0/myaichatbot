<div align="center">

# 🤖✨ AI Chatbot

### *Your Intelligent Conversation Companion*

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

*A sophisticated, modern AI chatbot powered by Google Gemini 2.0 Flash, featuring a stunning dark/light theme interface, intelligent file processing, and seamless conversation management.*

</div>

---

## 🌟 **Key Features**

<table>
<tr>
<td width="50%">

### 🎯 **Core Functionality**
- 🧠 **AI-Powered Conversations** - Google Gemini 2.0 Flash
- 📁 **Smart File Upload** - PDF, text, and document parsing
- 💬 **Real-time Chat** - Instant responses with typing indicators
- 🔄 **Session Management** - Save and resume conversations
- 📋 **Message Actions** - Copy, delete, and manage messages

</td>
<td width="50%">

### 🎨 **User Experience**
- 🌙 **Dark/Light Mode** - Beautiful adaptive themes
- 📱 **Responsive Design** - Perfect on all devices
- ⚡ **Lightning Fast** - Optimized performance
- 🎭 **Modern UI** - Sleek animations and transitions
- ⚙️ **Customizable** - Personalize your experience

</td>
</tr>
</table>

---

## �️ **Tech Stack**

<div align="center">

| Frontend | Backend | Styling | AI |
|----------|---------|---------|-----|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js) | ![Node.js](https://img.shields.io/badge/Node.js-green?style=flat&logo=node.js) | ![Tailwind](https://img.shields.io/badge/Tailwind-blue?style=flat&logo=tailwindcss) | ![Gemini](https://img.shields.io/badge/Gemini-orange?style=flat&logo=google) |
| ![React](https://img.shields.io/badge/React-blue?style=flat&logo=react) | ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript) | ![Radix UI](https://img.shields.io/badge/Radix_UI-purple?style=flat&logo=radixui) | ![PDF.js](https://img.shields.io/badge/PDF.js-red?style=flat&logo=mozilla) |

</div>

---

## � **Quick Start**

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

```bash
# 📥 Clone the repository
git clone https://github.com/Abhirup0/myaichatbot.git
cd myaichatbot

# 📦 Install dependencies
npm install

# 🔑 Set up environment variables (optional)
# Add your Google Gemini API key to .env.local

# 🚀 Start development server
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** to see the magic!

---

## 📁 **Project Structure**

```
myaichatbot/
├── 📂 public/                 # Static assets & icons
├── 📂 src/
│   ├── 📂 app/               # Next.js App Router
│   │   ├── 📄 globals.css    # Global styles
│   │   ├── 📄 layout.tsx     # Root layout
│   │   └── 📄 page.tsx       # Main chatbot page
│   ├── 📂 components/ui/     # Reusable UI components
│   │   ├── 📄 avatar.tsx     # Avatar component
│   │   ├── 📄 button.tsx     # Button component
│   │   ├── 📄 card.tsx       # Card component
│   │   └── 📄 ...           # More components
│   └── 📂 lib/
│       └── 📄 utils.ts       # Utility functions
├── 📄 package.json           # Dependencies & scripts
├── 📄 tailwind.config.js     # Tailwind configuration
└── 📄 tsconfig.json          # TypeScript configuration
```

---

## ⚙️ **Configuration & Customization**

<details>
<summary><b>🎨 Theme Customization</b></summary>

```typescript
// Modify theme colors in globals.css
:root {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 210 40% 96%;
  // ... more custom colors
}
```

</details>

<details>
<summary><b>🤖 AI Model Settings</b></summary>

```typescript
// Update API configuration in page.tsx
const GEMINI_API_KEY = 'your-api-key-here';
const GEMINI_MODEL = 'gemini-2.0-flash';
```

</details>

<details>
<summary><b>💬 Welcome Message</b></summary>

```typescript
// Customize the initial message in page.tsx
const welcomeMessage = "Hello! I'm your AI assistant...";
```

</details>


## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔄 **Open** a Pull Request

---

## � **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- 🚀 [Next.js](https://nextjs.org/) - The React Framework for Production
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- 🔧 [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- 🤖 [Google Gemini](https://ai.google.dev/) - Advanced AI capabilities
- 🎯 [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

---

<div align="center">

### 💝 **Made with Love & Code**

*If you found this project helpful, please consider giving it a ⭐!*

[![GitHub stars](https://img.shields.io/github/stars/Abhirup0/myaichatbot?style=social)](https://github.com/Abhirup0/myaichatbot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Abhirup0/myaichatbot?style=social)](https://github.com/Abhirup0/myaichatbot/network/members)

**[📧 Contact](mailto:your-email@example.com) • [🌐 Portfolio](https://your-portfolio.com) • [🐦 Twitter](https://twitter.com/yourusername)**

</div>
