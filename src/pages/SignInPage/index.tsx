import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, message, Typography, Flex, Modal, Input } from 'antd';
import { useAuth } from 'contexts/AuthContext';
import { SignInCredentials } from 'types/interface';
import Button from 'components/Common/Button';
import { useStyleToken } from 'themeStyles';

const { Title, Text } = Typography;

const SignInPage: React.FC = () => {
  const { signIn, isLoading, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const styleToken = useStyleToken();
  const [forgotModalOpen, setForgotModalOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetSubmitting, setResetSubmitting] = React.useState(false);

  const handleSubmit = async (values: SignInCredentials) => {
    try {
      await signIn(values);
      message.success('Successfully signed in!');
      navigate('/');
    } catch (error) {
      let errorMessage = 'Failed to sign in. Please try again.';
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

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      message.error('Please enter your email');
      return;
    }
    setResetSubmitting(true);
    try {
      await requestPasswordReset(resetEmail.trim());
      message.success('Password reset email sent. Please check your inbox.');
      setForgotModalOpen(false);
      setResetEmail('');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setResetSubmitting(false);
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
      <Title style={styleToken.pageHeadingTextStyle}>Sign In</Title>
      <Text style={styleToken.subtitleTextStyle}>
        Welcome back! Sign in to access your personalized experience.
      </Text>

      <Form
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: '400px', width: '100%', marginTop: '2rem' }}
      >
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} width="100%">
            Sign In
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="default" width="100%" onClick={() => setForgotModalOpen(true)}>
            Forgot Password?
          </Button>
        </Form.Item>
      </Form>

      <Text style={{ ...styleToken.subtitleTextStyle, marginTop: '1rem' }}>
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" style={{ color: styleToken.colorPrimary }}>
          Sign up here
        </Link>
      </Text>

      <Modal
        title="Reset Password"
        open={forgotModalOpen}
        onCancel={() => {
          setForgotModalOpen(false);
          setResetEmail('');
        }}
        onOk={handleForgotPassword}
        okText="Send Email"
        confirmLoading={resetSubmitting}
      >
        <Input
          placeholder="Enter your account email"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
      </Modal>
    </Flex>
  );
};

export default SignInPage;