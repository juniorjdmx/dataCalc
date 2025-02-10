
import { useState, useCallback } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileContent: (content: string) => void;
}

const FileUploader = ({ onFileContent }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileContent(content);
      }
    };
    reader.readAsText(file);
  }, [onFileContent]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
        isDragging
          ? 'border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50'
          : 'border-gray-300 dark:border-gray-700'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xml,.json,.pjc"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
            <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arraste e solte seu arquivo aqui ou
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
              clique para selecionar
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            XML, JSON, ou PJC
          </p>
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
