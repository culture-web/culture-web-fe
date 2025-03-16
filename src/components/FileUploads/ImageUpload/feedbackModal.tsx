import React, { useState } from 'react';
import { Modal, Select, Typography, message , Flex } from 'antd';
import Button from 'components/Common/Button';
import { useColourToken } from 'themeStyles';


const { Text } = Typography;
const { Option } = Select;

interface FeedbackModalProps {
  visible: boolean;
  modalText: string;
  modalSelections: string[];
  onCancel: () => void;
  onSubmit: (feedbackValue: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  modalText,
  modalSelections,
  onCancel,
  onSubmit,
}) => {
  const [feedbackValue, setFeedbackValue] = useState<string>('');
  const colourToken = useColourToken();

  const handleSubmit = () => {
    if (feedbackValue) {
      onSubmit(feedbackValue);
      // Show a green success toast on top
      message.success('Thank you for your feedback!', 3);
      setFeedbackValue('');
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
        </Select>
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
