"use client";

import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker
// Use a workaround for the worker module
const initPdfWorker = async () => {
  // Set the worker path directly to a CDN version
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
};

/**
 * Extracts text from a PDF file
 * @param file The PDF file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Ensure worker is initialized
    await initPdfWorker();

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Iterate through each page to extract text
for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  const textContent = await page.getTextContent();
  const textItems = textContent.items as { str: string }[];

  const pageText = textItems.map((item) => item.str).join(" ");
  fullText += pageText + "\n\n";
}
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Splits the text into chunks of manageable size
 * @param text The text to split
 * @param chunkSize The maximum size of each chunk
 * @returns An array of text chunks
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1500
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
