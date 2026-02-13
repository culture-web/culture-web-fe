import React from 'react';
import { Button, Typography, Flex, Space } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { ChatHeaderProps } from '../types';

const { Text, Title } = Typography;

interface ChatHeaderPropsWithMode extends ChatHeaderProps {
  mudrasMode?: boolean;
}

const ChatHeader: React.FC<ChatHeaderPropsWithMode> = ({ onClose, mudrasMode = false }) => {
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
    </div>
  );
};

export default ChatHeader;
