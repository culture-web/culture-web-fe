import React, { useState } from 'react';
import { EMAIL_API_KEY } from 'configs/env.config';
import { Form, message } from 'antd';
import Button from 'components/Common/Button';
import FormInput from './FormItem';
import { Typography, Flex } from 'antd';
import { useStyleToken } from 'themeStyles';

const { Title, Text } = Typography;

const ContactUsPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const styleToken = useStyleToken();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      // Example POST request to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          access_key: EMAIL_API_KEY, // Your API key here
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
        message.success('Your message has been sent.');
      } else {
        message.error('Something went wrong. Please try again later.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>Contact Us</Title>
      <Text style={styleToken.subtitleTextStyle}>
        Any questions? Feel free to drop us a message below!
      </Text>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <FormInput
          name="name"
          placeholder="Name"
          message="Please enter your name"
        />
        <FormInput
          name="number"
          required={false}
          type="tel"
          placeholder="Phone Number"
          message="Please enter your phone number"
        />
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          message="Please enter a valid email"
        />
        <FormInput
          rows={4}
          name="message"
          placeholder="Write your inquiry..."
          message="Please enter your message"
        />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send Message
          </Button>
        </Form.Item>

        {submitted && (
          <Text style={styleToken.thankyouTextStyle}>
            Thank you! Your message has been sent!
          </Text>
        )}
      </Form>
    </Flex>
  );
};

export default ContactUsPage;
