import React, { useState } from 'react';
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
  const [bgColor, setBgColor] = useState(token.colorPrimary); // Initial background color

  return (
  <AntButton
    size="large"
    style={{
      backgroundColor: bgColor,
      color: 'white',
    }}
    onMouseEnter={() => setBgColor('#db2a6b')} // Change color on hover
    onMouseLeave={() => setBgColor(token.colorPrimary)} // Revert to original color
    type={type} // eslint-disable-line react/button-has-type
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </AntButton>
)
}

export default Button;
