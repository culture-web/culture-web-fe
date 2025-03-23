import React, { useState } from 'react';
import { Modal, Select, Typography, message, Flex, Input } from 'antd';
import Button from 'components/Common/Button';
import { useColourToken } from 'themeStyles';

const { Text } = Typography;
const { Option } = Select;

interface FeedbackModalProps {
  visible: boolean;
  modalText: string;
  modalSelections: string[];
  type: string;
  onCancel: () => void;
  onSubmit: (feedbackValue: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  modalText,
  modalSelections,
  type,
  onCancel,
  onSubmit,
}) => {
  const [feedbackValue, setFeedbackValue] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');
  const colourToken = useColourToken();

  const handleSubmit = () => {
    let finalValue = feedbackValue;
    if (type === 'character' && feedbackValue === 'Others') {
      if (!otherText.trim()) {
        message.error('Please enter a specific value for "Others"');
        return;
      }
      finalValue = otherText;
    }
    if (finalValue) {
      onSubmit(finalValue);
      message.success('Thank you for your feedback!', 3);
      setFeedbackValue('');
      setOtherText('');
      onCancel();
    }
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null}>
      <Flex vertical align="center" gap={10}>
        <Text style={{ fontSize: '16px', color: colourToken.white }}>
          {modalText}
        </Text>
        <Select
          placeholder="Select feedback"
          onChange={(value: string) => setFeedbackValue(value)}
          value={feedbackValue}
          style={{ width: '100%', marginTop: 10 }}
        >
          {modalSelections.map((selection) => (
            <Option key={selection} value={selection}>
              {selection}
            </Option>
          ))}
          {type === 'character' && (
            <Option key="Others" value="Others">
              Others
            </Option>
          )}
        </Select>
        {type === 'character' && feedbackValue === 'Others' && (
          <Input
            placeholder="Please specify"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            style={{ width: '100%', marginTop: 10 }}
          />
        )}
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit Feedback
        </Button>
      </Flex>
    </Modal>
  );
};

export default FeedbackModal;
