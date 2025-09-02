import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Upload, 
  message, 
  Typography, 
  Flex, 
  Avatar, 
  Divider,
  Spin,
  Space
} from 'antd';
import { 
  SendOutlined, 
  PictureOutlined, 
  RobotOutlined, 
  UserOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import { 
  uploadImgToCharRecBESingle,
  uploadImgToExpressionRecBESingle,
  sendChatQuery
} from 'utils/invokeBackend';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatProps {
  onClose?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your Kathakali AI assistant. I can help you with:

🎭 **Character Recognition** - Upload images and I'll identify Kathakali characters
🎨 **Expression Analysis** - I'll recognize the nine emotions (Navarasas)
📚 **Cultural Knowledge** - Ask about stories, traditions, and meanings
🎪 **Performance Context** - Learn about specific scenes and narratives

**Try asking:**
• "What character is this and what story are they from?"
• "Explain the significance of this makeup style"
• "What does this expression represent?"
• "Tell me about Kathakali music and instruments"

Feel free to upload images and ask anything about Kathakali!`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      setUploadedFile(info.file);
    } else if (info.file.status === 'error') {
      message.error('Image upload failed');
    }
  };

  const removeImage = () => {
    setUploadedFile(null);
  };

  const processImageWithAI = async (imageFile: File) => {
    try {
      // Try both character and expression recognition
      const [characterResult, expressionResult] = await Promise.allSettled([
        uploadImgToCharRecBESingle(imageFile),
        uploadImgToExpressionRecBESingle(imageFile)
      ]);

      let analysisResult = '';
      
      if (characterResult.status === 'fulfilled' && characterResult.value.prediction?.length > 0) {
        const topCharacter = characterResult.value.prediction[0];
        const confidence = topCharacter.location.probability;
        analysisResult += `**Character Analysis**: I detect this as a **${topCharacter.prediction}** character with ${(confidence * 100).toFixed(1)}% confidence.\n\n`;
        
        // Add character information based on the detected character
        const characterInfo = getCharacterInfo(topCharacter.prediction);
        if (characterInfo) {
          analysisResult += characterInfo + '\n\n';
        }
      }

      if (expressionResult.status === 'fulfilled' && expressionResult.value.prediction?.length > 0) {
        const topExpression = expressionResult.value.prediction[0];
        const confidence = topExpression.location.probability;
        analysisResult += `**Expression Analysis**: The expression appears to be **${topExpression.prediction}** with ${(confidence * 100).toFixed(1)}% confidence.\n\n`;
        
        // Add expression information
        const expressionInfo = getExpressionInfo(topExpression.prediction);
        if (expressionInfo) {
          analysisResult += expressionInfo + '\n\n';
        }
      }

      if (!analysisResult) {
        analysisResult = 'I was unable to clearly identify the character or expression in this image. However, I can still help answer questions about Kathakali! ';
      }

      return analysisResult;
    } catch (error) {
      console.error('Error processing image:', error);
      return 'I encountered an error while analyzing the image, but I can still help answer your questions about Kathakali! ';
    }
  };

  const getCharacterInfo = (character: string): string => {
    const characterData: Record<string, string> = {
      'Pacha': 'Pacha characters represent noble, virtuous heroes like Rama, Krishna, or Arjuna. They have green face makeup and are typically the protagonists in Kathakali stories.',
      'Kathi': 'Kathi characters are anti-heroes or demonic figures with a knife-like mustache. They often play villainous roles but can also be complex characters with both good and evil traits.',
      'Minukku-Female': 'Minukku characters represent gentle, feminine roles including goddesses, noble women, and sages. They have lustrous, radiant makeup representing purity and divinity.',
      'Chuvanna-Thadi': 'Chuvanna Thadi (Red Beard) characters are extremely evil demons like Ravana or other rakshasa kings. Their red beards and fierce makeup represent their demonic nature.',
      'Vella-Thadi': 'Vella Thadi (White Beard) characters represent supernatural beings, monkeys like Hanuman, or elderly characters. The white beard signifies wisdom or otherworldly nature.',
      'Kari-Male': 'Kari characters represent forest dwellers, hunters, or demons. They often have black makeup and play supporting roles in the epic narratives.',
    };
    return characterData[character] || '';
  };

  const getExpressionInfo = (expression: string): string => {
    const expressionData: Record<string, string> = {
      'Raudra': 'Raudra represents anger and fury. This expression is used to show rage, wrath, and destructive emotions, often seen in battle scenes or when characters face betrayal.',
      'Sringara': 'Sringara represents love and romance. This gentle expression shows affection, beauty, and romantic feelings between characters.',
      'Bibatsa': 'Bibatsa represents disgust and revulsion. This expression shows contempt, aversion, or moral outrage at unacceptable behavior.',
      'Karuna': 'Karuna represents compassion and pity. This sorrowful expression conveys empathy, sadness, and emotional pain.',
      'Shanta': 'Shanta represents peace and tranquility. This serene expression shows calmness, wisdom, and spiritual contentment.',
      'Adbhuta': 'Adbhuta represents wonder and amazement. This expression shows surprise, awe, and marvel at extraordinary events.',
      'Vira': 'Vira represents heroism and valor. This bold expression demonstrates courage, bravery, and noble determination.',
      'Bhayanaka': 'Bhayanaka represents fear and terror. This expression shows fright, horror, and anxiety in threatening situations.',
      'Hasya': 'Hasya represents laughter and humor. This joyful expression demonstrates happiness, mirth, and comic relief.',
    };
    return expressionData[expression] || '';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessageId = Date.now().toString();
    const imageUrl = uploadedFile?.originFileObj 
      ? URL.createObjectURL(uploadedFile.originFileObj)
      : undefined;

    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: inputValue.trim() || 'Analyze this image',
      image: imageUrl,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and file
    const currentInput = inputValue;
    const currentFile = uploadedFile?.originFileObj;
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);

    try {
      let aiResponse = '';
      
      // Process image if uploaded
      if (currentFile) {
        const imageAnalysis = await processImageWithAI(currentFile);
        aiResponse += imageAnalysis;
      }

      // Send to chat API with context
      const chatResponse = await sendChatQuery(currentInput, currentFile, aiResponse);
      aiResponse += chatResponse;

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse || 'I apologize, but I couldn\'t process your request at the moment. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatHeaderStyle = {
    background: 'linear-gradient(135deg, #2b2d38 0%, #c81f58 100%)',
    color: '#fff',
    borderRadius: '12px 12px 0 0',
    padding: '16px 20px',
  };

  const messageStyle = (isUser: boolean) => ({
    marginBottom: '16px',
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems: 'flex-start',
    gap: '8px',
  });

  const messageBubbleStyle = (isUser: boolean) => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px',
    backgroundColor: isUser ? '#c81f58' : '#f5f5f5',
    color: isUser ? '#fff' : '#2b2d38',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
  });

  return (
    <Card 
      style={{ 
        width: '100%',
        maxWidth: isMobile ? '100%' : '800px',
        height: isMobile ? '70vh' : '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(43, 45, 56, 0.1)',
      }}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Header */}
      <div style={chatHeaderStyle}>
        <Flex justify="space-between" align="center">
          <Space>
            <RobotOutlined style={{ fontSize: '24px' }} />
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Kathakali AI Assistant
            </Title>
          </Space>
          {onClose && (
            <Button 
              type="text" 
              onClick={onClose}
              style={{ color: '#fff' }}
            >
              ✕
            </Button>
          )}
        </Flex>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
          Ask me about Kathakali characters, expressions, stories, and traditions
        </Text>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto',
        background: '#fafafa',
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={messageStyle(msg.type === 'user')}>
            {msg.type === 'assistant' && (
              <Avatar 
                icon={<RobotOutlined />} 
                style={{ backgroundColor: '#c81f58', flexShrink: 0 }}
              />
            )}
            <div style={messageBubbleStyle(msg.type === 'user')}>
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Uploaded" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'block'
                  }} 
                />
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.7, 
                marginTop: '4px' 
              }}>
                {msg.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            {msg.type === 'user' && (
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#2b2d38', flexShrink: 0 }}
              />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={messageStyle(false)}>
            <Avatar 
              icon={<RobotOutlined />} 
              style={{ backgroundColor: '#c81f58', flexShrink: 0 }}
            />
            <div style={messageBubbleStyle(false)}>
              <Space>
                <Spin indicator={<LoadingOutlined spin />} size="small" />
                <Text>Analyzing and thinking...</Text>
              </Space>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Input Area */}
      <div style={{ padding: '16px 20px', background: '#fff' }}>
        {uploadedFile && (
          <div style={{ 
            marginBottom: '12px', 
            padding: '8px', 
            background: '#f0f0f0', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Space>
              <PictureOutlined style={{ color: '#c81f58' }} />
              <Text style={{ fontSize: '14px' }}>{uploadedFile.name}</Text>
            </Space>
            <Button 
              type="text" 
              size="small" 
              onClick={removeImage}
              style={{ color: '#999' }}
            >
              ✕
            </Button>
          </div>
        )}
        
        <Flex gap="middle">
          <Upload
            beforeUpload={() => false}
            onChange={handleImageUpload}
            accept="image/*"
            showUploadList={false}
            maxCount={1}
          >
            <Button 
              icon={<PictureOutlined />}
              style={{ 
                color: '#c81f58',
                borderColor: '#c81f58',
                height: '40px'
              }}
            />
          </Upload>
          
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Kathakali... (Press Enter to send, Shift+Enter for new line)"
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ flex: 1 }}
          />
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !uploadedFile || isLoading}
            style={{ 
              backgroundColor: '#c81f58',
              borderColor: '#c81f58',
              height: '40px'
            }}
          >
            Send
          </Button>
        </Flex>
      </div>
    </Card>
  );
};

export default AIChat;
