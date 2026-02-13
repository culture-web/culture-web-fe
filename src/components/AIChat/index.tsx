import React, { useState, useEffect, useCallback } from 'react';
import { Card, Divider, message } from 'antd';
import useIsMobile from 'utils/isMobile';
import { createNewSession, getUserSessions, deleteSession, deleteMessage } from 'utils/invokeBackend';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [mudrasMode, setMudrasMode] = useState(false);
  
  // Auto-detect mode based on current page
  useEffect(() => {
    const isMudrasPage = location.pathname === '/learn';
    setMudrasMode(isMudrasPage);
  }, [location.pathname]);

  const loadSessions = useCallback(async () => {
    try {
      console.log('Loading sessions...');
      const userSessions = await getUserSessions();
      console.log('Sessions loaded:', userSessions);
      // Sort sessions in descending order by creation time (latest first)
      const sortedSessions = userSessions.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, []);

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
    refreshMessages,
  } = useChatMessages(activeSessionId, loadSessions, mudrasMode);
  
  const isMobile = useIsMobile();

  // Load user sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

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

  // Handle session deletion
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If we deleted the active session, switch to first available session or create new one
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter(session => session.id !== sessionId);
        if (remainingSessions.length > 0) {
          const newActiveSession = remainingSessions[0];
          setActiveSessionId(newActiveSession.id);
          onSessionChange?.(newActiveSession.id);
        } else {
          setActiveSessionId(undefined);
          onSessionChange?.('');
        }
      }
      
      message.success('Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      message.error('Failed to delete session');
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      message.success('Message deleted successfully');
      // Refresh messages to ensure deleted message is gone
      await refreshMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
      message.error('Failed to delete message');
    }
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
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
      >
        <ChatHeader onClose={onClose} />
        
        <MessageList 
          messages={messages} 
          isLoading={isLoading || isLoadingSession}
          onDeleteMessage={handleDeleteMessage}
        />

        <Divider style={{ margin: 0, flexShrink: 0 }} />

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
      bodyStyle={{ padding: 0, display: 'flex', height: '100%', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {/* Left Sidebar - Sessions */}
        <SessionSidebar 
          sessions={sessions}
          currentSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          isLoading={isCreatingSession}
        />

        {/* Right Panel - Chat */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0,
          height: '100%',
          overflow: 'hidden'
        }}>
          <ChatHeader onClose={onClose} mudrasMode={mudrasMode}/>
          
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
            onDeleteMessage={handleDeleteMessage}
          />

          <Divider style={{ margin: 0, flexShrink: 0 }} />

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
