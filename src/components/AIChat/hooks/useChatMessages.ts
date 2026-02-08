import { useState, useEffect } from 'react';
import { message } from 'antd';
import { sendChatQuery } from 'utils/invokeBackend';
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

const getInitialMessage = (mudrasMode: boolean = false): Message => 
  mudrasMode ? getMudrasMessage() : getKathakaliMessage();

const useChatMessages = (mudrasMode: boolean = false) => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage(mudrasMode)]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { processImageWithAI } = useImageAnalysis();

  // Persist chat messages to sessionStorage when in mudras mode (Learn tab)
  // sessionStorage automatically clears when tab/browser closes
  useEffect(() => {
    if (mudrasMode && messages.length > 1) {
      // Convert messages to Q&A format for quiz generation
      const chatHistory = messages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.type === 'user' ? msg.content : msg.response?.shortAnswer || '',
      }));
      sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [messages, mudrasMode]);

  // Clear chat history when component unmounts (navigation or tab close)
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('chatHistory');
    };
  }, []);

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
      const chatResponse = await sendChatQuery(currentInput, firstImageFile, combinedAnalysis, mudrasMode);

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
    handleImageUpload,
    removeImage,
    handleSendMessage,
    handleImageUploadError,
  };
};

export default useChatMessages;