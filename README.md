# AI Chat Application with Gemini

A modern dark-themed AI chat application powered by Google's Gemini API. Chat with AI, upload images for visual understanding, and analyze PDF documents.

## Features

- 🤖 AI chat with Google Gemini
- 🖼️ Image upload and analysis
- 📄 PDF text extraction and chat
- 🌙 Modern dark theme with beautiful UI
- 💬 Chat history persistence
- 🔄 Real-time responses
- 📱 Mobile responsive design

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for package management)
- [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/filterx.git
cd filterx
```

2. Install dependencies:

```bash
bun install
```

3. Create an `.env.local` file in the project root and add your Gemini API key:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Type your message in the input field and press Enter or click the send button to chat with the AI.
- Click the paper clip icon to upload an image or PDF file.
- For image uploads, the AI will analyze the image and respond based on the content.
- For PDF uploads, the AI will extract the text and allow you to ask questions about the content.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **AI Integration**: Google Gemini API
- **PDF Processing**: PDF.js
- **File Handling**: React Dropzone

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Google Gemini](https://blog.google/technology/ai/google-gemini-ai/) for the powerful AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
