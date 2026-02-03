import React, { useState, useEffect } from 'react';
import { Card, Divider, message } from 'antd';
import useIsMobile from 'utils/isMobile';
import { createNewSession, getUserSessions } from 'utils/invokeBackend';
import { AIChatProps, ChatSession } from './types';
import useChatMessages from './hooks/useChatMessages';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import SessionSidebar from './SessionSidebar';

const AIChat: React.FC<AIChatProps> = ({ onClose, currentSessionId, onSessionChange }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(currentSessionId);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const {
    messages,
    inputValue,
    setInputValue,
    uploadedImages,
    isLoading,
    isLoadingSession,
    handleImageUpload,
    removeImage,
    handleSendMessage,
  } = useChatMessages(activeSessionId);
  
  const isMobile = useIsMobile();

  // Load user sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userSessions = await getUserSessions();
        setSessions(userSessions);
      } catch (error) {
        console.warn('Failed to load sessions:', error);
      }
    };

    loadSessions();
  }, []);

  // Handle new session creation
  const handleNewSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSession = await createNewSession();
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      onSessionChange?.(newSession.id);
      message.success('New chat session created');
    } catch (error) {
      console.error('Failed to create session:', error);
      message.error('Failed to create new session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Handle session selection
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    onSessionChange?.(sessionId);
  };

  if (isMobile) {
    // Mobile layout - no sidebar
    return (
      <Card 
        style={{ 
          width: '100%',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(43, 45, 56, 0.1)',
        }}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <ChatHeader onClose={onClose} />
        
        <MessageList messages={messages} isLoading={isLoading || isLoadingSession} />

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
  }

  // Desktop layout - with sidebar
  return (
    <Card 
      style={{ 
        width: '100%',
        maxWidth: '1200px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(43, 45, 56, 0.1)',
      }}
      bodyStyle={{ padding: 0, display: 'flex', height: '100%' }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Left Sidebar - Sessions */}
        <SessionSidebar 
          sessions={sessions}
          currentSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          isLoading={isCreatingSession}
        />

        {/* Right Panel - Chat */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0 
        }}>
          <ChatHeader onClose={onClose} />
          
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
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
