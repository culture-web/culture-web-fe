import React from 'react';
import { Button, Space, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { ImageUploadPreviewProps } from '../types';

const { Text } = Typography;

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ fileName, onRemove }) => {
  return (
    <div style={{ 
      marginBottom: '12px', 
      padding: '8px', 
      background: '#f0f0f0', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Space>
        <PictureOutlined style={{ color: '#c81f58' }} />
        <Text style={{ fontSize: '14px' }}>{fileName}</Text>
      </Space>
      <Button 
        type="text" 
        size="small" 
        onClick={onRemove}
        style={{ color: '#999' }}
      >
        ✕
      </Button>
    </div>
  );
};

export default ImageUploadPreview;