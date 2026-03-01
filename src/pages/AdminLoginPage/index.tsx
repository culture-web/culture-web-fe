import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Image, Space, Tag } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import BACKEND_URI from 'configs/env.config';
// Logo will be loaded from public directory

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store JWT token in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      message.success('Login successful! Redirecting...');
      
      // Redirect to admin page
      setTimeout(() => {
        navigate('/k-manage-portal');
      }, 500);
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 24px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at top left, #7185f3 0%, #5f73dc 35%, #5a5cbc 70%, #6d44a9 100%)',
      padding: '24px',
      margin: '12px',
      borderRadius: '22px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-140px',
          left: '-120px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
        }}
      />
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 430,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.38)',
          boxShadow: '0 24px 50px rgba(20, 20, 40, 0.30)',
          backdropFilter: 'blur(2px)',
        }}
        bodyStyle={{ padding: '28px 28px 22px' }}
      >
        <Space direction="vertical" size={6} style={{ width: '100%', textAlign: 'center', marginBottom: 18 }}>
          <Image
            src="/kathakalai-pink-words.png"
            alt="KathakalAI Logo"
            preview={false}
            style={{ height: '52px' }}
          />
          <Tag color="magenta" style={{ margin: '0 auto', fontWeight: 600, borderRadius: 999, padding: '1px 10px' }}>
            Knowledge Base Access
          </Tag>
          <Title level={2} style={{ margin: '6px 0 0', fontSize: 36, lineHeight: 1.15 }}>
            Sign In
          </Title>
          <Paragraph style={{ margin: 0, color: '#8a8f99', fontSize: 14 }}>
            Secure Knowledge Base portal for admin, editor, and viewer users.
          </Paragraph>
        </Space>

        <Form
          name="admin_login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Username</Text>}
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
            style={{ marginBottom: 14 }}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username or Email" 
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: 18 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
              style={{
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                boxShadow: '0 8px 20px rgba(200,31,88,0.30)',
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            🔒 Secure access for authorized personnel only
          </Text>
        </div>
      </Card>
    </div>
  );
}
