import { useState, useEffect } from 'react';
import { message } from 'antd';
import { sendChatQuery, getSessionMessages } from 'utils/invokeBackend';
import { Message, UploadedImage } from '../types';
import useImageAnalysis from './useImageAnalysis';

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

const convertBackendMessageToFrontend = (backendMessage: any): Message => {
  const isUser = backendMessage.role === 'user';
  
  if (isUser) {
    return {
      id: backendMessage.id,
      type: 'user',
      content: backendMessage.content,
      timestamp: new Date(backendMessage.created_at),
    };
  }

  // Assistant message - try to parse as JSON first, otherwise treat as plain text
  let response;
  
  try {
    // Try to parse as JSON (for structured responses)
    const parsedContent = JSON.parse(backendMessage.content);
    if (parsedContent.shortAnswer !== undefined) {
      response = parsedContent;
    } else {
      throw new Error('Not a structured response');
    }
  } catch {
    // If parsing fails or it's not structured, treat as plain text response
    response = {
      shortAnswer: backendMessage.content || 'No response available',
      reasoning: null,
      sections: [],
      tables: [],
      metadata: {
        hasStructuredContent: false,
        responseLength: (backendMessage.content || '').length,
        processingTimestamp: backendMessage.created_at,
      }
    };
  }

  return {
    id: backendMessage.id,
    type: 'assistant',
    response,
    timestamp: new Date(backendMessage.created_at),
  };
};

const useChatMessages = (sessionId?: string) => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  
  const { processImageWithAI } = useImageAnalysis();

  // Load session messages when session changes
  useEffect(() => {
    const loadSessionMessages = async () => {
      if (!sessionId) {
        // No session, show initial message
        setMessages([getInitialMessage()]);
        return;
      }

      setIsLoadingSession(true);
      try {
        console.log('Loading messages for session:', sessionId);
        const backendMessages = await getSessionMessages(sessionId);
        console.log('Backend messages received:', backendMessages);
        
        if (backendMessages.length === 0) {
          // Empty session, show initial message
          setMessages([getInitialMessage()]);
        } else {
          // Convert backend messages to frontend format
          const frontendMessages = backendMessages.map(convertBackendMessageToFrontend);
          console.log('Converted frontend messages:', frontendMessages);
          setMessages(frontendMessages);
        }
        
        // Clear input and images when switching sessions
        setInputValue('');
        setUploadedImages([]);
      } catch (error) {
        console.error('Failed to load session messages:', error);
        message.error('Failed to load session messages');
        // Fall back to initial message on error
        setMessages([getInitialMessage()]);
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSessionMessages();
  }, [sessionId]);

  useEffect(() => () => {
      uploadedImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    }, [uploadedImages]);

  const handleImageUpload = async (file: File) => {
    const imageId = Date.now().toString();
    const imageUrl = URL.createObjectURL(file);
    
    const newImage: UploadedImage = {
      id: imageId,
      file,
      url: imageUrl,
      name: file.name,
      isAnalyzing: true
    };
    
    setUploadedImages(prev => {
      const updated = [...prev, newImage];
      return updated;
    });
    
    try {
      const analysisResult = await processImageWithAI(file);
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { ...img, analysisResult, isAnalyzing: false }
            : img
        )
      );
    } catch (error) {
      console.error('Error analyzing image:', error);
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { ...img, analysisResult: 'Analysis failed', isAnalyzing: false }
            : img
        )
      );
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedImages.length === 0) return;

    const userMessageId = Date.now().toString();
    
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: inputValue.trim() || 'Analyze these images',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputValue;
    const currentImages = [...uploadedImages];
    setInputValue('');

    currentImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    setUploadedImages([]);
    
    setIsLoading(true);

    try {
      let combinedAnalysis = '';
      
      if (currentImages.length > 0) {
        combinedAnalysis = currentImages
          .filter(img => img.analysisResult && img.analysisResult !== 'Analysis failed')
          .map((img, index) => `Image ${index + 1}: ${img.analysisResult}`)
          .join('\n\n');
      }

      const firstImageFile = currentImages.length > 0 ? currentImages[0].file : undefined;
      const chatResponse = await sendChatQuery(currentInput, firstImageFile, combinedAnalysis, sessionId);

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
    uploadedImages,
    isLoading,
    isLoadingSession,
    handleImageUpload,
    removeImage,
    handleSendMessage,
    handleImageUploadError,
  };
};

export default useChatMessages;