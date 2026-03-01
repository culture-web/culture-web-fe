
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

export interface Citation {
  id: number;
  source: string;
  page?: number | null;
  similarity?: number | null;
  rerankerScore?: number | null;
  combinedScore?: number | null;
  keywordBoost?: number;
  questionBoost?: number;
  totalScore?: number | null;
  originalSimilarity?: number | null;
}

export interface ChatbotResponse {
  shortAnswer: string;
  reasoning?: string | null;
  sections: ChatbotResponseSection[];
  tables: ChatbotResponseTable[];
  metadata: ChatbotResponseMetadata;
  citations?: Citation[];
  retrieval?: Record<string, unknown>;
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

export interface ChatSession {
  id: string;
  created_at: string;
  title?: string;
  lastMessageAt?: string;
}

export interface AIChatProps {
  onClose?: () => void;
  currentSessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  isGuest?: boolean;
}

export interface SessionSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading?: boolean;
}

export interface ChatHeaderProps {
  onClose?: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  onDeleteMessage?: (messageId: string) => void;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onDeleteMessage?: (messageId: string) => void;
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

