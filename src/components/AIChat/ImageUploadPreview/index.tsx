import React from 'react';
import { Button, Space, Typography, Card, Spin } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { ImageUploadPreviewProps } from '../types';

const { Text } = Typography;

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ images, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div style={{ 
      marginBottom: '16px',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '12px',
      border: '2px dashed #c81f58'
    }}>
      <Text strong style={{ 
        color: '#c81f58', 
        fontSize: '14px',
        marginBottom: '12px',
        display: 'block'
      }}>
        Uploaded Images ({images.length})
      </Text>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {images.map((image) => (
          <Card
            key={image.id}
            size="small"
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e8e8e8'
            }}
            bodyStyle={{ padding: '8px' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              {/* Image thumbnail */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #d9d9d9',
                flexShrink: 0
              }}>
                <img 
                  src={image.url} 
                  alt="Uploaded" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <Space size={4}>
                        {image.isAnalyzing ? (
                          <>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: '12px' }} />} />
                            <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                              Analyzing...
                            </Text>
                          </>
                        ) : (
                          <>
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                            <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                              Uploaded
                            </Text>
                          </>
                        )}
                      </Space>
                      
                      <Text 
                        style={{ 
                          fontSize: '11px', 
                          color: '#666',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                        title={image.name}
                      >
                        {image.name}
                      </Text>
                      
                      {image.analysisResult && (
                        <Text 
                          style={{ 
                            fontSize: '11px', 
                            color: '#c81f58',
                            fontWeight: 500,
                            display: 'block'
                          }}
                        >
                          {image.analysisResult}
                        </Text>
                      )}
                    </Space>
                  </div>
                  
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<CloseOutlined />}
                    onClick={() => onRemove(image.id)}
                    style={{ 
                      color: '#999',
                      fontSize: '12px',
                      padding: '2px',
                      minWidth: '20px',
                      height: '20px'
                    }}
                    title="Remove image"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadPreview;