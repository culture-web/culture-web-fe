import React from 'react';
import './index.css';
import { Button as AntButton, theme } from 'antd';
const { useToken } = theme;
interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
}
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  type = 'primary',
}) => {
  const { token } = useToken();

  return (
  <AntButton
    size="large"
    style={{
      backgroundColor: token.colorPrimary,
      color: 'white',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#db2a6b')} // Hover background color
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c81f58')} // Revert to original
    type={type} // eslint-disable-line react/button-has-type
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </AntButton>
)
}

export default Button;
