import React from 'react';
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './styles.css';

interface FloatingChatButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isMobile = false }) => {
  const buttonStyle = {
    position: 'fixed' as const,
    bottom: isMobile ? '20px' : '30px',
    right: isMobile ? '20px' : '30px',
    width: isMobile ? '56px' : '64px',
    height: isMobile ? '56px' : '64px',
    borderRadius: '50%',
    backgroundColor: '#c81f58',
    borderColor: '#c81f58',
    boxShadow: '0 4px 16px rgba(200, 31, 88, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '24px' : '28px',
    padding: '0',
    border: 'none',
  };

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<MessageOutlined style={{ fontSize: 'inherit', lineHeight: 1 }} />}
      onClick={onClick}
      style={buttonStyle}
      className="floating-chat-button"
      title="Chat with AI Assistant"
    />
  );
};

FloatingChatButton.defaultProps = {
  isMobile: false,
};

export default FloatingChatButton;
