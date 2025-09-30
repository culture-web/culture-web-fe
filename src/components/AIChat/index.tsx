import React from 'react';
import { Card, Divider } from 'antd';
import useIsMobile from 'utils/isMobile';
import { AIChatProps } from './types';
import { useChatMessages } from './hooks/useChatMessages';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const {
    messages,
    inputValue,
    setInputValue,
    uploadedFile,
    isLoading,
    handleImageUpload,
    removeImage,
    handleSendMessage,
  } = useChatMessages();
  
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
      <ChatHeader onClose={onClose} />
      
      <MessageList messages={messages} isLoading={isLoading} />

      <Divider style={{ margin: 0 }} />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onImageUpload={handleImageUpload}
        uploadedFileName={uploadedFile?.name}
        onRemoveImage={removeImage}
        isLoading={isLoading}
        hasUploadedFile={!!uploadedFile}
      />
    </Card>
  );
};

export default AIChat;
