import React from 'react';
import { Button, List, Typography, Space } from 'antd';
import { PlusOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { SessionSidebarProps } from '../types';

const { Text, Title } = Typography;

const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSessionTitle = (session: any) => {
    return session.title || `Chat ${session.id.slice(-8)}`;
  };

  return (
    <div style={{
      width: '280px',
      height: '100%',
      background: '#fafafa',
      borderRight: '1px solid #e8e8e8',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e8e8e8',
        background: '#fff'
      }}>
        <Title level={5} style={{ margin: '0 0 8px 0', color: '#2b2d38' }}>
          Chat Sessions
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onNewSession}
          block
          style={{
            backgroundColor: '#c81f58',
            borderColor: '#c81f58',
            height: '36px'
          }}
          loading={isLoading}
        >
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <List
          dataSource={sessions}
          renderItem={(session) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: currentSessionId === session.id ? '#e6f7ff' : 'transparent',
                borderLeft: currentSessionId === session.id ? '3px solid #c81f58' : '3px solid transparent',
                margin: 0,
                border: 'none',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => onSessionSelect(session.id)}
            >
              <div style={{ width: '100%' }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageOutlined style={{ color: '#c81f58', fontSize: '14px' }} />
                    <Text 
                      strong 
                      style={{ 
                        fontSize: '14px',
                        color: currentSessionId === session.id ? '#c81f58' : '#2b2d38',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px'
                      }}
                    >
                      {getSessionTitle(session)}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {formatDate(session.lastMessageAt || session.created_at)}
                    </Text>
                  </div>
                </Space>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No chat sessions yet' }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #e8e8e8',
        background: '#fff'
      }}>
        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
          Sessions are saved automatically
        </Text>
      </div>
    </div>
  );
};

export default SessionSidebar;