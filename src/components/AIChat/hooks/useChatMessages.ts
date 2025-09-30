import { useState } from 'react';
import type { UploadFile } from 'antd';
import { message } from 'antd';
import { sendChatQuery } from 'utils/invokeBackend';
import { Message } from '../types';
import { useImageAnalysis } from './useImageAnalysis';

const getInitialMessage = (): Message => ({
  id: '1',
  type: 'assistant',
  response: {
    shortAnswer: `Hello! I'm your Kathakali AI assistant. I can help you with:

🎭 **Character Recognition** - Upload images and I'll identify Kathakali characters
🎨 **Expression Analysis** - I'll recognize the nine emotions (Navarasas)
📚 **Cultural Knowledge** - Ask about stories, traditions, and meanings
🎪 **Performance Context** - Learn about specific scenes and narratives

**Try asking:**
• "What character is this and what story are they from?"
• "Explain the significance of this makeup style"
• "What does this expression represent?"
• "Tell me about Kathakali music and instruments"

Feel free to upload images and ask anything about Kathakali!`,
    reasoning: null,
    sections: [],
    tables: [],
    metadata: {
      hasStructuredContent: false,
      responseLength: 0,
      processingTimestamp: new Date().toISOString(),
    }
  },
  timestamp: new Date(),
});

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { processImageWithAI } = useImageAnalysis();

  const handleImageUpload = (file: File) => {
    const uploadFile: UploadFile = {
      uid: Date.now().toString(),
      name: file.name,
      status: 'done',
      originFileObj: file as any, // Type assertion for file compatibility
    };
    setUploadedFile(uploadFile);
  };

  const removeImage = () => {
    setUploadedFile(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessageId = Date.now().toString();
    const imageUrl = uploadedFile?.originFileObj 
      ? URL.createObjectURL(uploadedFile.originFileObj)
      : undefined;

    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: inputValue.trim() || 'Analyze this image',
      image: imageUrl,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and file
    const currentInput = inputValue;
    const currentFile = uploadedFile?.originFileObj;
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);

    try {
      let imageAnalysis = '';
      
      // Process image if uploaded
      if (currentFile) {
        imageAnalysis = await processImageWithAI(currentFile);
      }

      // Send to chat API with context
      const chatResponse = await sendChatQuery(currentInput, currentFile, imageAnalysis);

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        response: chatResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        response: {
          shortAnswer: 'I apologize, but I encountered an error while processing your request. Please try again later.',
          reasoning: null,
          sections: [],
          tables: [],
          metadata: {
            hasStructuredContent: false,
            responseLength: 0,
            processingTimestamp: new Date().toISOString(),
          }
        },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploadError = () => {
    message.error('Image upload failed');
  };

  return {
    messages,
    inputValue,
    setInputValue,
    uploadedFile,
    isLoading,
    handleImageUpload,
    removeImage,
    handleSendMessage,
    handleImageUploadError,
  };
};