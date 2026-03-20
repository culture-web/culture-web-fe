import React from 'react';
import { Button, Typography, Flex, Space } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { ChatHeaderProps } from '../types';

const { Text, Title } = Typography;

interface ChatHeaderPropsWithMode extends ChatHeaderProps {
  mudrasMode?: boolean;
  isGuest?: boolean;
}

const ChatHeader: React.FC<ChatHeaderPropsWithMode> = ({ onClose, mudrasMode = false, isGuest = false }) => {
  const chatHeaderStyle = {
    background: 'linear-gradient(135deg, #2b2d38 0%, #c81f58 100%)',
    color: '#fff',
    borderRadius: '12px 12px 0 0',
    padding: '16px 20px',
  };

  return (
    <div style={chatHeaderStyle}>
      <Flex justify="space-between" align="center">
        <Space>
          <RobotOutlined style={{ fontSize: '24px' }} />
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Kathakali AI Assistant
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              {mudrasMode ? '🙏 Cultural Knowledge Guide' : '💃 Kathakali Expert'}
            </Text>
          </div>
        </Space>
        {onClose && (
          <Button 
            type="text" 
            onClick={onClose}
            style={{ color: '#fff' }}
          >
            ✕
          </Button>
        )}
      </Flex>
      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginTop: '8px' }}>
        {mudrasMode 
          ? 'Ask me about mudras, traditions, and cultural knowledge'
          : 'Ask me about Kathakali characters, expressions, stories, and traditions'
        }
      </Text>
      {isGuest && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Text style={{ 
            color: '#fff', 
            fontSize: '12px', 
            display: 'block',
            fontWeight: 500
          }}>
            ⚠️ <strong>Temporary Chat Session</strong>
          </Text>
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '11px', 
            display: 'block',
            marginTop: '4px'
          }}>
            This chat will reset when closed. Create an account or sign in for persistent chat history.
          </Text>
        </div>
      )}
    </div>
  );
};

ChatHeader.defaultProps = {
  mudrasMode: false,
  isGuest: false,
};

export default ChatHeader;
