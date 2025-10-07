import { useState, useEffect } from 'react';
import { message } from 'antd';
import { sendChatQuery } from 'utils/invokeBackend';
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

const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { processImageWithAI } = useImageAnalysis();

  // Cleanup effect to revoke object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [uploadedImages]);

  const handleImageUpload = async (file: File) => {
    console.log('handleImageUpload called with file:', file); // Debug log
    const imageId = Date.now().toString();
    const imageUrl = URL.createObjectURL(file);
    
    const newImage: UploadedImage = {
      id: imageId,
      file,
      url: imageUrl,
      name: file.name,
      isAnalyzing: true
    };
    
    console.log('Adding new image to state:', newImage); // Debug log
    setUploadedImages(prev => {
      const updated = [...prev, newImage];
      console.log('Updated uploadedImages:', updated); // Debug log
      return updated;
    });
    
    // Analyze the image in the background
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
    
    // Create message with images if any
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: inputValue.trim() || 'Analyze these images',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    const currentInput = inputValue;
    const currentImages = [...uploadedImages];
    setInputValue('');
    setIsLoading(true);

    try {
      let combinedAnalysis = '';
      
      // If we have uploaded images, use their analysis results
      if (currentImages.length > 0) {
        combinedAnalysis = currentImages
          .filter(img => img.analysisResult && img.analysisResult !== 'Analysis failed')
          .map((img, index) => `Image ${index + 1}: ${img.analysisResult}`)
          .join('\\n\\n');
      }

      // Send to chat API with context - use the first image file for compatibility
      const firstImageFile = currentImages.length > 0 ? currentImages[0].file : undefined;
      const chatResponse = await sendChatQuery(currentInput, firstImageFile, combinedAnalysis);

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
    uploadedImages,
    isLoading,
    handleImageUpload,
    removeImage,
    handleSendMessage,
    handleImageUploadError,
  };
};

export default useChatMessages;