import React, { useState } from 'react';
import { Button as AntButton } from 'antd';
import { useColourToken } from 'themeStyles';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  htmlType?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  width?: string;
}
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  type = 'primary',
  htmlType = 'button',
  loading = false,
  width = '100%',
}) => {
  const colourToken = useColourToken();
  const [bgColor, setBgColor] = useState(colourToken.pink);
  return (
    <AntButton
      size="large"
      style={{
        backgroundColor: disabled ? colourToken.gray : bgColor,
        color: disabled ? colourToken.black : colourToken.white,
        width: width,
      }}
      onMouseEnter={() => setBgColor(colourToken.pinkLight)} // Change color on hover
      onMouseLeave={() => setBgColor(colourToken.pink)} // Revert to original color
      type={type} // eslint-disable-line react/button-has-type
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
    >
      {children}
    </AntButton>
  );
};

export default Button;
