import React, { useState } from 'react';
import './index.css';
import { EMAIL_API_KEY } from 'configs/env.config';
import { Form, message } from 'antd';
import Button from 'components/Common/Button';
import FormInput from './FormItem';

const ContactUsPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="contactUsPage">
      <h1>Contact Us</h1>
      <p>Any questions? Drop us a message!</p>
      <Form onFinish={handleSubmit} layout="vertical" className="contactForm">
        <FormInput name="name" placeholder="Name" message="Please enter your name" />
        <FormInput name="number" required={false} type="tel" placeholder="Phone Number" message="Please enter your phone number" />
        <FormInput name="email" type="email" placeholder="Email" message="Please enter a valid email" />
        <FormInput rows={4} name="message" placeholder="Write your inquiry..." message="Please enter your message" />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="custom-button"
          >
            Send Message
          </Button>
        </Form.Item>

        {submitted && <p>Thank you! Your message has been sent.</p>}
      </Form>
    </div>
  );
};

export default ContactUsPage;
