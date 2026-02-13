import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, message, Typography, Flex } from 'antd';
import { useAuth } from 'contexts/AuthContext';
import { SignUpCredentials } from 'types/interface';
import Button from 'components/Common/Button';
import { useStyleToken } from 'themeStyles';

const { Title, Text } = Typography;

const SignUpPage: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const styleToken = useStyleToken();

  const handleSubmit = async (values: SignUpCredentials) => {
    try {
      await signUp(values);
      message.success('Account created successfully! You are now signed in.');
      navigate('/');
    } catch (error) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Show warning for fallback mode, error for real failures
      if (errorMessage.includes('locally') || errorMessage.includes('limited')) {
        message.warning(errorMessage);
      } else {
        message.error(errorMessage);
      }
    }
  };

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

  return (
    <Flex vertical align="center" style={{ minHeight: '70vh', padding: '2rem 0' }}>
      <Title style={styleToken.pageHeadingTextStyle}>Sign Up</Title>
      <Text style={styleToken.subtitleTextStyle}>
        Create your account to unlock personalized features and save your progress.
      </Text>

      <Form
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: '400px', width: '100%', marginTop: '2rem' }}
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, message: 'Please enter your name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <input
            type="text"
            placeholder="Full Name"
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
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
          <input
            type="password"
            placeholder="Confirm Password"
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} width="100%">
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <Text style={{ ...styleToken.subtitleTextStyle, marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link to="/sign-in" style={{ color: styleToken.colorPrimary }}>
          Sign in here
        </Link>
      </Text>
    </Flex>
  );
};

export default SignUpPage;