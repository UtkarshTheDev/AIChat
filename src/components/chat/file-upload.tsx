import React, { useCallback, useState, useId, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, FileText, UploadCloud, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, fileToDataURL } from "@/lib/utils";
import { extractTextFromPDF } from "@/lib/utils/pdf";
import { toast } from "sonner";
import { AttachedFile } from "@/lib/store/chat-store";
import { motion } from "motion/react";

interface FileUploadProps {
  onFileUpload: (file: AttachedFile) => void;
  onFileRemove: () => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  currentFile: AttachedFile | null;
}

export default function FileUpload({
  onFileUpload,
  onFileRemove,
  acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ],
  maxSize = 5 * 1024 * 1024, // 5MB
  currentFile,
}: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileIdPrefix = useId();

  // Ensure component is mounted before using client-side APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);

        // Use a stable ID generation approach that works with SSR/CSR
        const id = `${fileIdPrefix}-${Date.now().toString()}`;
        const url = await fileToDataURL(file);

        let content: string | undefined;

        // If it's a PDF, extract text
        if (file.type === "application/pdf") {
          try {
            content = await extractTextFromPDF(file);
          } catch (error) {
            console.error("Error extracting text from PDF:", error);
            toast.error("Failed to extract text from PDF");
            setIsProcessing(false);
            return;
          }
        }

        const fileData: AttachedFile = {
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          content,
        };

        onFileUpload(fileData);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileUpload, fileIdPrefix]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize,
    maxFiles: 1,
    disabled: isProcessing || !!currentFile,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error(
          `File is too large. Max size is ${maxSize / (1024 * 1024)}MB`
        );
      } else if (error?.code === "file-invalid-type") {
        toast.error(
          `Invalid file type. Accepted: ${acceptedFileTypes.join(", ")}`
        );
      } else {
        toast.error("File upload failed");
      }
    },
  });

  if (currentFile) {
    return (
      <motion.div
        className="relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentFile.type.startsWith("image/") ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
            <img
              src={currentFile.url}
              alt={currentFile.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
            <FileText className="w-6 h-6 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentFile.name}
          </p>
          <p className="text-xs text-white/60">
            {currentFile.type === "application/pdf" ? "PDF Document" : "Image"}{" "}
            • {(currentFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 rounded-full hover:bg-white/10 text-white/60 hover:text-white/90"
          onClick={onFileRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-5 transition-all duration-200 cursor-pointer",
        isDragActive
          ? "border-primary/60 bg-primary/10"
          : "border-white/10 hover:border-primary/30 bg-white/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        {isProcessing ? (
          <motion.div
            className="p-3 rounded-full bg-primary/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <UploadCloud className="h-6 w-6 text-primary" />
          </motion.div>
        ) : (
          <div className="p-3 rounded-full bg-white/5">
            {isDragActive ? (
              <UploadCloud className="h-6 w-6 text-primary" />
            ) : (
              <ImageIcon className="h-6 w-6 text-white/60" />
            )}
          </div>
        )}
        <div className="text-sm font-medium text-white/80">
          {isProcessing
            ? "Processing file..."
            : isDragActive
            ? "Drop file to upload"
            : "Upload an image or PDF"}
        </div>
        <p className="text-xs text-white/50">
          Drag & drop or click to upload (max {maxSize / (1024 * 1024)}MB)
        </p>
      </div>
    </div>
  );
}
