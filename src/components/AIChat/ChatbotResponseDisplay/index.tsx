import React from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Typography,
  Card,
  Divider,
  Button,
  message
} from 'antd';
import { 
  InfoCircleOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileOutlined
} from '@ant-design/icons';
import FormattedText from 'components/Common/FormattedText';
import BACKEND_URI from 'configs/env.config';
import { ChatbotResponse } from '../types';

const { Text, Title } = Typography;

interface ChatbotResponseDisplayProps {
  response: ChatbotResponse;
  style?: React.CSSProperties;
}

const getSectionIcon = (type?: string) => {
  switch (type) {
    case 'info':
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    case 'warning':
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'error':
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    default:
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
  }
};

const getSectionColor = (type?: string) => {
  switch (type) {
    case 'info':
      return '#e6f7ff';
    case 'warning':
      return '#fffbe6';
    case 'success':
      return '#f6ffed';
    case 'error':
      return '#fff2f0';
    default:
      return '#f5f5f5';
  }
};

const getTagColor = (type?: string) => {
  if (type === 'error') return 'red';
  if (type === 'warning') return 'orange';
  if (type === 'success') return 'green';
  return 'blue';
};

const TableCellRenderer: React.FC<{ text: string }> = ({ text }) => (
  <FormattedText content={text || ''} />
);

const getReferenceName = (index: number): string => `Reference_${index}`;

const extractFilename = (source: string): string => {
  if (!source) return 'Unknown';
  // Remove .pdf or other extensions
  const basename = source.split('/').pop() || source;
  return basename.replace(/\.[a-z]+$/i, '');
};

const handleDownloadSource = async (source: string) => {
  try {
    const token = localStorage.getItem('adminToken');

    // Encode filename for URL
    const encodedFilename = encodeURIComponent(source);
    const downloadUrl = token
      ? `${BACKEND_URI}/k-manage/knowledge-base/${encodedFilename}/download`
      : `${BACKEND_URI}/kathakali/source-download/${encodedFilename}`;
    
    // Fetch the file with authorization
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: token
        ? {
          Authorization: `Bearer ${token}`,
        }
        : undefined,
    });

    if (!response.ok) {
      if (response.status === 404) {
        message.error('File not found in storage. It may have been deleted.');
      } else if (response.status === 401 || response.status === 403) {
        message.error('You do not have permission to download this file');
      } else {
        message.error('Failed to download file. Please try again.');
      }
      return;
    }

    // Get the filename from Content-Disposition header or use source name
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = source.split('/').pop() || 'download.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/i);
      if (filenameMatch) {
        const [, matchedFilename] = filenameMatch;
        filename = matchedFilename;
      }
    }

    // Download the file
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    message.error('Failed to download file. Please try again.');
  }
};

const ChatbotResponseDisplay: React.FC<ChatbotResponseDisplayProps> = ({ 
  response, 
  style 
}) => {
  const hasAdditionalContent = response.reasoning || 
    response.sections.length > 0 || 
    response.tables.length > 0;
  
  const hasCitations = response.citations && response.citations.length > 0;

  return (
    <div style={style}>
      {/* Main Short Answer */}
      <FormattedText 
        content={response.shortAnswer} 
        style={{ marginBottom: (hasAdditionalContent || hasCitations) ? '16px' : '0' }}
      />

      {/* Additional Content */}
      {(hasAdditionalContent || hasCitations) && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          <div
            style={{ 
              border: '1px solid #c81f58',
              borderRadius: '8px',
              marginBottom: '8px',
              padding: '12px'
            }}
          >
            {hasAdditionalContent && (
              <Space style={{ marginBottom: '8px' }}>
                <Text strong style={{ color: '#c81f58', fontSize: '14px' }}>
                  Detailed explanation
                </Text>
              </Space>
            )}
            <div style={{ padding: '8px 0' }}>
                {hasAdditionalContent && (
                  <>
                    {/* Reasoning Section */}
                    {response.reasoning && (
                      <Card 
                        size="small" 
                        style={{ 
                          marginBottom: '12px',
                          background: '#fafafa',
                          border: '1px solid #e8e8e8'
                        }}
                      >
                        <Title level={5} style={{ margin: '0 0 8px 0', color: '#c81f58' }}>
                          Reasoning
                        </Title>
                        <FormattedText content={response.reasoning} />
                      </Card>
                    )}

                    {/* Sections */}
                    {response.sections.map((section) => (
                      <Card
                        key={`section-${section.title}-${section.type || 'default'}`}
                        size="small"
                        style={{ 
                          marginBottom: '12px',
                          background: getSectionColor(section.type),
                          border: `1px solid ${getSectionColor(section.type)}`
                        }}
                      >
                        <Space style={{ marginBottom: '8px' }}>
                          {getSectionIcon(section.type)}
                          <Title level={5} style={{ margin: 0, color: '#2b2d38' }}>
                            {section.title}
                          </Title>
                          {section.type && (
                            <Tag color={getTagColor(section.type)}>
                              {section.type.toUpperCase()}
                            </Tag>
                          )}
                        </Space>
                        <FormattedText content={section.content} />
                      </Card>
                    ))}

                    {/* Tables */}
                    {response.tables.map((table) => (
                      <Card 
                        key={`table-${table.caption || 'untitled'}-${table.headers.join('-')}`}
                        size="small" 
                        style={{ marginBottom: '12px' }}
                      >
                        {table.caption && (
                          <Title level={5} style={{ marginBottom: '12px', color: '#c81f58' }}>
                            {table.caption}
                          </Title>
                        )}
                        <Table
                          size="small"
                          scroll={{ x: 'max-content' }}
                          dataSource={table.rows.map((row) => ({
                            key: `row-${row.join('-')}`,
                            ...row.reduce((acc, cell, cellIndex) => ({
                              ...acc,
                              [table.headers[cellIndex] || `col-${cellIndex}`]: cell
                            }), {})
                          }))}
                          columns={table.headers.map((header) => ({
                            title: header,
                            dataIndex: header,
                            key: `col-${header}-${table.caption || 'table'}`,
                            render: (text: string) => <TableCellRenderer text={text} />
                          }))}
                          pagination={false}
                          style={{ 
                            background: '#fff',
                            borderRadius: '6px'
                          }}
                        />
                      </Card>
                    ))}
                  </>
                )}

                {/* Citations/References Section */}
                {response.citations && response.citations.length > 0 && (
                  <Card
                    size="small"
                    style={{ 
                      marginTop: '16px',
                      marginBottom: '12px',
                      background: '#f0f5ff',
                      border: '1px solid #b3d9ff'
                    }}
                  >
                    <Space style={{ marginBottom: '12px' }}>
                      <FileOutlined style={{ color: '#1677ff' }} />
                      <Text strong style={{ color: '#1677ff', fontSize: '14px' }}>
                        Sources & References
                      </Text>
                      <Tag color="blue">{response.citations.length}</Tag>
                    </Space>
                    <div style={{ marginTop: '12px' }}>
                      {response.citations.map((citation, idx) => (
                        <div
                          key={`citation-${citation.id}-${citation.source}-${citation.page || 'na'}`}
                          style={{
                            padding: '10px',
                            marginBottom: idx < response.citations!.length - 1 ? '10px' : '0',
                            background: '#fff',
                            border: '1px solid #d9e8ff',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1677ff' }}>
                              {getReferenceName(citation.id)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              {extractFilename(citation.source)}
                              {citation.page && (
                                <span style={{ marginLeft: '8px', color: '#999' }}>
                                  (Page {citation.page})
                                </span>
                              )}
                            </div>
                            {citation.similarity && (
                              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                Relevance: {(citation.similarity * 100).toFixed(1)}%
                              </div>
                            )}
                          </div>
                          <Button
                            type="text"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadSource(citation.source)}
                            style={{ color: '#1677ff' }}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Metadata */}
                {response.metadata.hasStructuredContent && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999', 
                    marginTop: '12px',
                    textAlign: 'right'
                  }}>
                    <Space split={<span>•</span>}>
                      <span>Length: {response.metadata.responseLength} chars</span>
                      <span>
                        Generated: {new Date(response.metadata.processingTimestamp).toLocaleTimeString()}
                      </span>
                    </Space>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotResponseDisplay;
