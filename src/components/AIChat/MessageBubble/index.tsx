import React, { useState } from 'react';
import { Avatar, Button, Popconfirm } from 'antd';
import { RobotOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import ChatbotResponseDisplay from 'components/AIChat/ChatbotResponseDisplay';
import { MessageBubbleProps } from '../types';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onDeleteMessage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.type === 'user';

  const messageStyle = {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems: 'flex-start',
    gap: '8px',
    position: 'relative' as const,
  };

  const messageBubbleStyle = {
    maxWidth: isUser ? '50%' : 'calc(100% - 60px)', // User bubble max half window, assistant remains wider
    width: isUser ? '50%' : 'auto',
    minWidth: isUser ? '220px' : '100px',
    padding: '12px 16px',
    borderRadius: '18px',
    backgroundColor: isUser ? '#c81f58' : '#f5f5f5',
    color: isUser ? '#fff' : '#2b2d38',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  };

  return (
    <div 
      style={messageStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        <div style={{ 
          whiteSpace: 'pre-wrap',
          minHeight: '20px',
          lineHeight: '1.5'
        }}>
          {!isUser && message.response ? (
            <ChatbotResponseDisplay response={message.response} />
          ) : (
            message.content || ''
          )}
        </div>
        <div style={{ 
          fontSize: '11px', 
          opacity: 0.7, 
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {isUser && onDeleteMessage && isHovered && (
            <Popconfirm
              title="Delete message?"
              description="This will delete your message and the AI's response."
              onConfirm={() => onDeleteMessage(message.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                style={{ 
                  color: '#fff',
                  opacity: 0.8,
                  minWidth: '20px',
                  height: '20px',
                  padding: '0',
                  marginLeft: '8px'
                }}
              />
            </Popconfirm>
          )}
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