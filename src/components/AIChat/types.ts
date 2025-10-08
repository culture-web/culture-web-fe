
export interface ChatbotResponseSection {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export interface ChatbotResponseTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ChatbotResponseMetadata {
  hasStructuredContent: boolean;
  responseLength: number;
  processingTimestamp: string;
}

export interface ChatbotResponse {
  shortAnswer: string;
  reasoning?: string | null;
  sections: ChatbotResponseSection[];
  tables: ChatbotResponseTable[];
  metadata: ChatbotResponseMetadata;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content?: string;
  response?: ChatbotResponse;
  image?: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  analysisResult?: string;
  isAnalyzing?: boolean;
}

export interface AIChatProps {
  onClose?: () => void;
}

export interface ChatHeaderProps {
  onClose?: () => void;
}

export interface MessageBubbleProps {
  message: Message;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface ImageUploadPreviewProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: (id: string) => void;
  isLoading: boolean;
  uploadedImages: UploadedImage[];
}

export interface CharacterData {
  [key: string]: string;
}

export interface ExpressionData {
  [key: string]: string;
}

