export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content?: string;
  response?: ChatbotResponse;
  image?: string;
  timestamp: Date;
  isLoading?: boolean;
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
  fileName: string;
  onRemove: () => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onImageUpload: (file: File) => void;
  uploadedFileName?: string;
  onRemoveImage: () => void;
  isLoading: boolean;
  hasUploadedFile: boolean;
}

export interface CharacterData {
  [key: string]: string;
}

export interface ExpressionData {
  [key: string]: string;
}

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
