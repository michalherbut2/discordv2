import React, { useRef, useState } from 'react';
import { Upload, X, Image, File } from 'lucide-react';
import Button from '@/components/ui/Button';

interface FileUploadProps {
  onUpload: (file: File, type: 'image' | 'file') => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onClose }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const type = isImage ? 'image' : 'file';
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    onUpload(file, type);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload File
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop your file here, or click to select
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Maximum file size: 10MB
          </p>
          
          <Button onClick={openFileDialog} variant="outline">
            Select File
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          accept="image/*,*"
        />

        <div className="mt-4 flex justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Image size={16} />
              <span>Images</span>
            </div>
            <div className="flex items-center space-x-1">
              <File size={16} />
              <span>Files</span>
            </div>
          </div>
          
          <Button onClick={onClose} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;