import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'antd';
import { useLocation } from 'react-router-dom';
import useIsMobile from 'utils/isMobile';
import { AIChatProps } from './types';
import useChatMessages from './hooks/useChatMessages';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const location = useLocation();
  const [mudrasMode, setMudrasMode] = useState(false);
  
  // Auto-detect mode based on current page
  useEffect(() => {
    const isMudrasPage = location.pathname === '/learn';
    setMudrasMode(isMudrasPage);
  }, [location.pathname]);

  const {
    messages,
    inputValue,
    setInputValue,
    uploadedImages,
    isLoading,
    handleImageUpload,
    removeImage,
    handleSendMessage,
  } = useChatMessages(mudrasMode);
  
  const isMobile = useIsMobile();

  return (
    <Card 
      style={{ 
        width: '100%',
        maxWidth: isMobile ? '100%' : '800px',
        height: isMobile ? '70vh' : '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(43, 45, 56, 0.1)',
      }}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <ChatHeader 
        onClose={onClose}
        mudrasMode={mudrasMode}
      />
      
      <MessageList messages={messages} isLoading={isLoading} />

      <Divider style={{ margin: 0 }} />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        isLoading={isLoading}
        uploadedImages={uploadedImages}
      />
    </Card>
  );
};

export default AIChat;
