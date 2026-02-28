import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, message, Typography, Flex } from 'antd';
import { useAuth } from 'contexts/AuthContext';
import Button from 'components/Common/Button';
import { useStyleToken } from 'themeStyles';

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const { updateOwnPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const styleToken = useStyleToken();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      await updateOwnPassword(values.password);
      message.success('Password updated successfully. Please sign in again.');
      navigate('/sign-in');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to reset password');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderBottom: '2px solid #333',
    background: 'transparent',
    color: 'white',
    fontSize: '1.2rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    backgroundColor: '#2b2d38',
  };

  return (
    <Flex vertical align="center" style={{ minHeight: '70vh', padding: '2rem 0' }}>
      <Title style={styleToken.pageHeadingTextStyle}>Reset Password</Title>
      <Text style={styleToken.subtitleTextStyle}>
        Enter your new password for this account.
      </Text>

      <Form
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: '420px', width: '100%', marginTop: '2rem' }}
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <input type="password" placeholder="New Password" style={inputStyle} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <input type="password" placeholder="Confirm New Password" style={inputStyle} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} width="100%">
            Update Password
          </Button>
        </Form.Item>
      </Form>

      <Text style={{ ...styleToken.subtitleTextStyle, marginTop: '1rem' }}>
        Back to{' '}
        <Link to="/sign-in" style={{ color: styleToken.colorPrimary }}>
          Sign In
        </Link>
      </Text>
    </Flex>
  );
};

export default ResetPasswordPage;
