import React, { useState } from 'react';
import { Button as AntButton } from 'antd';
import { useStyleToken } from 'themeStyles'

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
  const styleToken = useStyleToken();
  const [bgColor, setBgColor] = useState(styleToken.button.colorBgButton);
  return (
  <AntButton
    size="large"
    style={{
      backgroundColor: bgColor,
      color: styleToken.button.textColor,
    }}
    onMouseEnter={() => setBgColor(styleToken.button.colorBgButtonHover)} // Change color on hover
    onMouseLeave={() => setBgColor(styleToken.button.colorBgButton)} // Revert to original color
    type={type} // eslint-disable-line react/button-has-type
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </AntButton>
)
}

export default Button;
