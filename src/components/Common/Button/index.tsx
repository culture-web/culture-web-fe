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
  height?: string;
  fontSize?: string;
}
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  className,
  type = 'primary',
  htmlType = 'button',
  loading = false,
  width = '100%',
  height = '2.5rem',
  fontSize = '1rem',
}) => {
  const colourToken = useColourToken();
  const [bgColor, setBgColor] = useState(colourToken.pink);
  return (
    <AntButton
      size="large"
      style={{
        backgroundColor: disabled ? colourToken.gray : bgColor,
        color: disabled ? colourToken.black : colourToken.white,
        width,
        height,
        fontSize,
      }}
      onMouseEnter={() => setBgColor(colourToken.pinkLight)} // Change color on hover
      onMouseLeave={() => setBgColor(colourToken.pink)} // Revert to original color
      type={type} // eslint-disable-line react/button-has-type
      onClick={onClick}
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
      className={className}
    >
      {children}
    </AntButton>
  );
};

Button.defaultProps = {
  children: null,
  onClick: undefined,
  disabled: false,
  className: undefined,
  type: 'primary',
  htmlType: 'button',
  loading: false,
  width: '100%',
  height: '2.5rem',
  fontSize: '1rem',
};

export default Button;
