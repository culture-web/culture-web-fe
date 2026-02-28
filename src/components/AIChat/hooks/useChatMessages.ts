import { useState, useEffect } from 'react';
import { message } from 'antd';
import { sendChatQuery, getSessionMessages, BackendMessage } from 'utils/invokeBackend';
import { Message, UploadedImage } from '../types';
import useImageAnalysis from './useImageAnalysis';

const getKathakaliMessage = (): Message => ({
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

const getGuestKathakaliMessage = (): Message => ({
  id: '1',
  type: 'assistant',
  response: {
    shortAnswer: `Welcome! I'm your Kathakali AI assistant. This is a **temporary chat session** that will reset when you close the chat.

🎭 **I can help you with:**
• **Character Recognition** - Upload images and I'll identify Kathakali characters
• **Expression Analysis** - I'll recognize the nine emotions (Navarasas)
• **Cultural Knowledge** - Ask about stories, traditions, and meanings
• **Performance Context** - Learn about specific scenes and narratives

**Try asking:**
• "What character is this and what story are they from?"
• "Explain the significance of this makeup style"
• "What does this expression represent?"
• "Tell me about Kathakali music and instruments"

⚠️ **Note:** Your chat history won't be saved. Create an account or sign in to keep your conversations!

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

const getMudrasMessage = (): Message => ({
  id: '1',
  type: 'assistant',
  response: {
    shortAnswer: `Welcome to the Mudras & Cultural Knowledge Guide! I'm here to help you learn about:

🙏 **Mudra Types & Meanings** - Single-hand (Asamyuta) and two-hand (Samyuta) mudras
🎭 **Dance Forms** - Mudras in Kathakali, Bharatanatyam, Kootiyattam, and other classical arts
📖 **Cultural Significance** - History, traditions, and storytelling through hand gestures
🎪 **Expression & Emotion** - How mudras convey meanings, narratives, and sentiments
🌿 **Traditions & Rituals** - Ancient origins and modern practice of mudras

**Try asking:**
• "What is the significance of the Pataka mudra?"
• "How are mudras used differently in Kathakali versus Bharatanatyam?"
• "Explain the story-telling through mudras"
• "What are the different types of mudras and their meanings?"
• "Tell me about mudras in classical Indian dance"

Feel free to ask anything about mudras, traditions, and Indian classical arts!`,
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

const getGuestMudrasMessage = (): Message => ({
  id: '1',
  type: 'assistant',
  response: {
    shortAnswer: `Welcome to the Mudras & Cultural Knowledge Guide! This is a **temporary chat session** that will reset when you close the chat.

🙏 **I can help you learn about:**
• **Mudra Types & Meanings** - Single-hand (Asamyuta) and two-hand (Samyuta) mudras
• **Dance Forms** - Mudras in Kathakali, Bharatanatyam, Kootiyattam, and other classical arts
• **Cultural Significance** - History, traditions, and storytelling through hand gestures
• **Expression & Emotion** - How mudras convey meanings, narratives, and sentiments
• **Traditions & Rituals** - Ancient origins and modern practice of mudras

**Try asking:**
• "What is the significance of the Pataka mudra?"
• "How are mudras used differently in Kathakali versus Bharatanatyam?"
• "Explain the story-telling through mudras"
• "What are the different types of mudras and their meanings?"
• "Tell me about mudras in classical Indian dance"

⚠️ **Note:** Your chat history won't be saved. Create an account or sign in to keep your conversations!

Feel free to ask anything about mudras, traditions, and Indian classical arts!`,
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

const getInitialMessage = (mudrasMode: boolean = false, isGuest: boolean = false): Message => {
  if (isGuest) {
    return mudrasMode ? getGuestMudrasMessage() : getGuestKathakaliMessage();
  }
  return mudrasMode ? getMudrasMessage() : getKathakaliMessage();
};

const convertBackendMessageToFrontend = (backendMessage: BackendMessage): Message => {
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
    
    if (parsedContent !== undefined) {
      response = {
        shortAnswer: parsedContent.shortAnswer || 'No response available',
        reasoning: parsedContent.reasoning || null,
        sections: parsedContent.sections || [],
        tables: parsedContent.tables || [],
        metadata: parsedContent.metadata || {
          hasStructuredContent: Boolean(parsedContent.reasoning || parsedContent.sections?.length || parsedContent.tables?.length),
          responseLength: (parsedContent.shortAnswer || '').length,
          processingTimestamp: backendMessage.created_at,
        }
      };
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

const useChatMessages = (sessionId?: string, onSessionUpdate?: () => void, mudrasMode: boolean = false, isGuest: boolean = false) => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage(mudrasMode, isGuest)]);
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
        setMessages([getInitialMessage(mudrasMode, isGuest)]);
        return;
      }

      setIsLoadingSession(true);
      try {
        console.log('Loading messages for session:', sessionId);
        const backendMessages = await getSessionMessages(sessionId);
        console.log('Backend messages received:', backendMessages);
        
        if (backendMessages.length === 0) {
          // Empty session, show initial message
          setMessages([getInitialMessage(mudrasMode, isGuest)]);
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
        setMessages([getInitialMessage(mudrasMode, isGuest)]);
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSessionMessages();
  }, [sessionId, mudrasMode, isGuest]);

  useEffect(() => () => {
      uploadedImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    }, [uploadedImages]);

  // Save chat messages to sessionStorage whenever they change (for quiz generation)
  useEffect(() => {
    // Filter out the initial greeting message and convert to {role, content} format
    const chatMessages = messages
      .filter(msg => msg.id !== '1') // Skip initial AI greeting
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.type === 'user' ? msg.content : msg.response?.shortAnswer || '',
      }))
      .filter(msg => msg.content); // Remove empty messages

    if (chatMessages.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(chatMessages));
    }
  }, [messages]);

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
    
    // Check if this is the first user message (excluding initial AI greeting)
    const userMessages = messages.filter(msg => msg.type === 'user');
    const isFirstMessage = userMessages.length === 0;
    
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
      const chatResponse = await sendChatQuery(currentInput, firstImageFile, combinedAnalysis, sessionId, mudrasMode);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        response: chatResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If this was the first message, trigger session update to refresh session list
      if (isFirstMessage && onSessionUpdate) {
        onSessionUpdate();
      }
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

  // Function to refresh messages for the current session on MESSAGE DELETE
  const refreshMessages = async () => {
    if (!sessionId) return;
    
    try {
      console.log('Refreshing messages for session:', sessionId);
      const backendMessages = await getSessionMessages(sessionId);
      
      if (backendMessages.length === 0) {
        // Empty session, show initial message
        setMessages([getInitialMessage()]);
      } else {
        // Convert backend messages to frontend format
        const frontendMessages = backendMessages.map(convertBackendMessageToFrontend);
        setMessages(frontendMessages);
      }
    } catch (error) {
      console.error('Failed to refresh session messages:', error);
      message.error('Failed to refresh messages');
    }
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
    refreshMessages,
  };
};

export default useChatMessages;