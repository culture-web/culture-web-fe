import React, { useRef, useEffect } from 'react';
import { Avatar, Spin, Space, Typography } from 'antd';
import { RobotOutlined, LoadingOutlined } from '@ant-design/icons';
import { MessageListProps } from '../types';
import MessageBubble from '../MessageBubble';

const { Text } = Typography;

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageStyle = {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '8px',
  };

  const messageBubbleStyle = {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px',
    backgroundColor: '#f5f5f5',
    color: '#2b2d38',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
  };

  return (
    <div style={{ 
      flex: 1, 
      padding: '20px', 
      overflowY: 'auto',
      background: '#fafafa',
    }}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div style={messageStyle}>
          <Avatar 
            icon={<RobotOutlined />} 
            style={{ backgroundColor: '#c81f58', flexShrink: 0 }}
          />
          <div style={messageBubbleStyle}>
            <Space>
              <Spin indicator={<LoadingOutlined spin />} size="small" />
              <Text>Analyzing and thinking...</Text>
            </Space>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;