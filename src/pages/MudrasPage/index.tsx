import { useState } from 'react';
import AIChat from 'components/AIChat';
import FloatingChatButton from 'components/FloatingChatButton';
import { Flex, Typography, Button, Modal } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

const { Text, Title } = Typography;

function MudrasPage() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const headingStyle = isMobile ? styleToken.culture.cultureSectionHeadingTextStyleMobile : styleToken.culture.cultureSectionHeadingTextStyle;
  const contentStyle = isMobile ? styleToken.culture.cultureSectionContentTextStyleMobile : styleToken.culture.cultureSectionContentTextStyle;

  const modalRender = (modal: React.ReactNode) => (
    <div style={{ backgroundColor: 'transparent' }}>
      {modal}
    </div>
  );

  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>Learn Mudras & Cultural Knowledge</Title>

      <Flex vertical align="center" style={{ maxWidth: isMobile ? '90%' : '75%' }}>
        <section id="overview">
          <Title style={headingStyle}>
            What are Mudras?
          </Title>
          <Text style={contentStyle}>
            Mudras are symbolic hand gestures that are fundamental to Indian classical dance forms like Kathakali, Bharatanatyam, and Kootiyattam. Each mudra represents specific meanings, emotions, objects, and narratives. These intricate hand positions combined with body movements and facial expressions create a sophisticated language of storytelling and cultural expression.
          </Text>
          <Text style={{...contentStyle, marginTop: '1rem', display: 'block'}}>
            There are primarily two types of mudras:
          </Text>
          <ul style={{ ...contentStyle, marginLeft: '2rem', marginTop: '0.5rem' }}>
            <li><strong>Asamyuta Mudras:</strong> Hand gestures performed with a single hand</li>
            <li><strong>Samyuta Mudras:</strong> Hand gestures performed with both hands together</li>
          </ul>
        </section>

        <section id="learning" style={{ marginTop: '2rem' }}>
          <Title style={headingStyle}>
            Learn More with AI Assistant
          </Title>
          <Text style={contentStyle}>
            Our AI-powered Learning Assistant provides detailed information about various mudras, their meanings, cultural significance, and their use in different classical dance traditions. Ask any questions about:
          </Text>
          <ul style={{ ...contentStyle, marginLeft: '2rem', marginTop: '0.5rem' }}>
            <li>Specific mudra names, meanings, and variations</li>
            <li>How mudras are used in storytelling and expression</li>
            <li>The history and cultural significance of mudras</li>
            <li>Mudras in different classical dance forms</li>
            <li>How to perform specific mudras</li>
          </ul>
          <Flex gap="large" style={{ margin: '1.5rem 0rem' }}>
            <Button 
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => setIsChatModalOpen(true)}
              style={{ 
                backgroundColor: '#c81f58',
                borderColor: '#c81f58',
                height: '40px',
                fontSize: '16px'
              }}
            >
              Start Learning with AI Assistant
            </Button>
          </Flex>
          <Text style={contentStyle}>
            The AI assistant uses our comprehensive knowledge base to provide accurate and detailed information about mudras, cultural traditions, and classical dance forms.
          </Text>
        </section>
      </Flex>

      {/* AI Chat Modal */}
      <Modal
        open={isChatModalOpen}
        onCancel={() => setIsChatModalOpen(false)}
        footer={null}
        width={isMobile ? '95%' : '90%'}
        style={{ maxWidth: '900px' }}
        styles={{ 
          body: { padding: 0, backgroundColor: 'transparent' },
          content: { backgroundColor: 'transparent', boxShadow: 'none', padding: 0 },
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
        }}
        centered
        destroyOnClose
        maskClosable
        closable={false}
        modalRender={modalRender}
      >
        <AIChat onClose={() => setIsChatModalOpen(false)} />
      </Modal>

      {/* Floating Chat Button */}
      <FloatingChatButton 
        onClick={() => setIsChatModalOpen(true)}
        isMobile={isMobile}
      />
    </Flex>
  );
}

export default MudrasPage;
