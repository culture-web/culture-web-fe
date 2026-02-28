import React from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Typography,
  Card,
  Divider 
} from 'antd';
import { 
  InfoCircleOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import FormattedText from 'components/Common/FormattedText';
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

const ChatbotResponseDisplay: React.FC<ChatbotResponseDisplayProps> = ({ 
  response, 
  style 
}) => {
  const hasAdditionalContent = response.reasoning || 
    response.sections.length > 0 || 
    response.tables.length > 0;

  return (
    <div style={style}>
      {/* Main Short Answer */}
      <FormattedText 
        content={response.shortAnswer} 
        style={{ marginBottom: hasAdditionalContent ? '16px' : '0' }}
      />

      {/* Additional Content */}
      {hasAdditionalContent && (
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
            <Space style={{ marginBottom: '8px' }}>
              <Text strong style={{ color: '#c81f58', fontSize: '14px' }}>
                Detailed explanation
              </Text>
            </Space>
            <div style={{ padding: '8px 0' }}>
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
