import React from 'react';
import { Button, Upload, Flex, Input } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import { ChatInputProps } from '../types';
import ImageUploadPreview from '../ImageUploadPreview';

const { TextArea } = Input;

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onImageUpload,
  onRemoveImage,
  isLoading,
  uploadedImages
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ padding: '16px 20px', background: '#fff' }}>
      {uploadedImages.length > 0 && (
        <ImageUploadPreview 
          images={uploadedImages}
          onRemove={onRemoveImage}
        />
      )}
      
      <Flex gap="middle">
        <Upload
          beforeUpload={(file) => {
            console.log('Before upload file:', file); // Debug log
            // Validate file type
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              console.error('File is not an image:', file.type);
              return false;
            }
            console.log('File type accepted:', file.type);
            // Trigger the image upload handler
            onImageUpload(file);
            return false; // Prevent actual upload
          }}
          accept="image/*"
          showUploadList={false}
          multiple={false}
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
          disabled={!value.trim() && uploadedImages.length === 0 || isLoading}
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