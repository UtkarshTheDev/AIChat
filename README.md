# AI Chat with Gemini

Experience seamless conversations with AI through a sleek, dark-themed interface powered by Google's Gemini API. Upload images for instant analysis or PDFs for insightful discussions—all wrapped in a responsive, user-friendly design.

> **Note:** This app began as docs and demo for another project that didn't work out. Now, it's a simple AI chat app with Gemini and a great UI.

## Key Features

- Intelligent AI conversations with Google Gemini
- Visual content analysis via image uploads
- PDF text extraction and interactive querying
- Elegant dark theme for a modern aesthetic
- Persistent chat history for continuity
- Instant, real-time AI responses
- Fully responsive across devices

## Quick Start

### Requirements

- [Bun](https://bun.sh/) for efficient package management
- [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/filterx.git
   cd filterx
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up your API key by creating `.env.local` in the root directory:

   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Launch the development server:

   ```bash
   bun run dev
   ```

5. Visit [http://localhost:3000](http://localhost:3000) to start chatting.

## How to Use

- Enter your message and hit Enter or the send button to engage with the AI.
- Use the attachment icon to upload images or PDFs.
- For images, the AI provides detailed analysis and responses.
- For PDFs, extract text and pose questions about the content.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **AI Integration**: Google Gemini API
- **PDF Processing**: PDF.js
- **File Handling**: React Dropzone

## License

This project is licensed under the MIT License. Refer to the LICENSE file for more details.

## Acknowledgments

- [Google Gemini](https://blog.google/technology/ai/google-gemini-ai/) for advanced AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for stunning UI components
- [Next.js](https://nextjs.org/) for the robust React framework
