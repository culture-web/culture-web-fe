import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

interface FormInputProps {
  name: string;
  placeholder: string;
  message: string;
  label?: React.ReactNode; // Optional label
  children?: React.ReactNode; // Allows custom inputs if needed
  required?: boolean; // Optional required flag
  type?: string; // Input type
  rows?: number;
}
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderBottom: '2px solid #333',
  background: 'transparent',
  color: 'white',
  fontSize: '1.5rem',
  outline: 'none',
  transition: 'border-color 0.3s',
  backgroundColor: '#2b2d38',
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  placeholder,
  message,
  label,
  children,
  required = true,
  type = 'text',
  rows,
}) => (
  <Form.Item label={label} name={name} rules={[{ required, message }]}>
    {children ||
      (rows ? (
        <TextArea placeholder={placeholder} rows={rows} style={inputStyle} />
      ) : (
        <Input type={type} placeholder={placeholder} style={inputStyle} />
      ))}
  </Form.Item>
);

FormInput.defaultProps = {
  label: undefined,
  children: undefined,
  required: true,
  type: 'text',
  rows: undefined,
};

export default FormInput;
