import React from 'react';
import { Avatar } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import ChatbotResponseDisplay from 'components/AIChat/ChatbotResponseDisplay';
import { MessageBubbleProps } from '../types';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';

  const messageStyle = {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems: 'flex-start',
    gap: '8px',
  };

  const messageBubbleStyle = {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px',
    backgroundColor: isUser ? '#c81f58' : '#f5f5f5',
    color: isUser ? '#fff' : '#2b2d38',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
  };

  return (
    <div style={messageStyle}>
      {!isUser && (
        <Avatar 
          icon={<RobotOutlined />} 
          style={{ backgroundColor: '#c81f58', flexShrink: 0 }}
        />
      )}
      <div style={messageBubbleStyle}>
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              borderRadius: '8px',
              marginBottom: '8px',
              display: 'block'
            }} 
          />
        )}
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {!isUser && message.response ? (
            <ChatbotResponseDisplay response={message.response} />
          ) : (
            message.content
          )}
        </div>
        <div style={{ 
          fontSize: '11px', 
          opacity: 0.7, 
          marginTop: '4px' 
        }}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      {isUser && (
        <Avatar 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#2b2d38', flexShrink: 0 }}
        />
      )}
    </div>
  );
};

export default MessageBubble;