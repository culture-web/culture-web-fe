import React from 'react';
import { Button, Upload, Flex, Input } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { ChatInputProps } from '../types';
import ImageUploadPreview from '../ImageUploadPreview';

const { TextArea } = Input;

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onImageUpload,
  uploadedFileName,
  onRemoveImage,
  isLoading,
  hasUploadedFile
}) => {
  const handleImageUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      onImageUpload(info.file.originFileObj!);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ padding: '16px 20px', background: '#fff' }}>
      {hasUploadedFile && uploadedFileName && (
        <ImageUploadPreview 
          fileName={uploadedFileName}
          onRemove={onRemoveImage}
        />
      )}
      
      <Flex gap="middle">
        <Upload
          beforeUpload={() => false}
          onChange={handleImageUpload}
          accept="image/*"
          showUploadList={false}
          maxCount={1}
        >
          <Button 
            icon={<PictureOutlined />}
            style={{ 
              color: '#c81f58',
              borderColor: '#c81f58',
              height: '40px'
            }}
          />
        </Upload>
        
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about Kathakali... (Press Enter to send, Shift+Enter for new line)"
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ flex: 1 }}
        />
        
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSend}
          disabled={!value.trim() && !hasUploadedFile || isLoading}
          style={{ 
            backgroundColor: '#c81f58',
            borderColor: '#c81f58',
            height: '40px'
          }}
        >
          Send
        </Button>
      </Flex>
    </div>
  );
};

export default ChatInput;