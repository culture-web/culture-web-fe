import { useState } from 'react';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali6.jpg';
import ImageUpload from 'components/FileUploads/ImageUpload';
import { Image, Flex, Typography, Button } from 'antd';
import {
  uploadImgToCharRecBE,
  uploadImgToExpressionRecBE,
} from 'utils/invokeBackend';
import RenderCharacterContent from 'components/ContentRender/RenderCharacterContent';
import RenderExpressionContent from 'components/ContentRender/RenderExpressionContent';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
const { Text, Title } = Typography;

function KathakaliPage() {
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isExpressionModalOpen, setIsExpressionModalOpen] = useState(false);
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const handleNavigation = (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>Kathakali</Title>
      <Flex style={{ width: '50%' }}>
        <Image src={kathakaliImage} alt="Kathakali" />
      </Flex>

      <nav>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'overview')
          }
          style={{ fontSize: '1.25rem', color: '#ffffff' }}
        >
          Overview
        </Button>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'algorithm1')
          }
          style={{ fontSize: '1.25rem', color: '#ffffff' }}
        >
          Character Recognition Algorithm
        </Button>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'algorithm2')
          }
          style={{ fontSize: '1.25rem', color: '#ffffff' }}
        >
          Expression Recognition Algorithm
        </Button>
      </nav>
      <Flex vertical align="center" style={{ maxWidth: '75vw' }}>
        <section id="overview" className="mb-large">
          <Title level={2} style={{ color: '#ffffff', marginBottom: '1rem' }}>
            Overview
          </Title>
          <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
            Kathakali is a classical dance-drama form from Kerala, India,
            renowned for its vibrant costumes, elaborate makeup, and dramatic
            storytelling. It combines dance, music, and acting to depict stories
            from Hindu epics like the Mahabharata and Ramayana. The performers
            use expressive facial expressions, detailed hand gestures (mudras),
            and precise body movements to convey emotions and narratives.
            Traditionally performed at night, Kathakali is a highly stylised art
            form that emphasizes exaggerated expressions and dramatic elements,
            creating a visually striking and immersive theatrical experience.
          </Text>
        </section>
        <section id="algorithm1" className="mb-large">
          <Flex vertical>
            <Title level={2} style={{ color: '#ffffff', marginBottom: '1rem' }}>
              Character Recognition Algorithm
            </Title>
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              This is an AI algorithm that helps users understand the major
              types of Kathakali characters, namely: Pacha, Kathi,
              Minukku-Female, Chuvanna-Thadi, Vella-Thadi and Kari-Male.
            </Text>
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              To learn more about this research,{' '}
              <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S2212054823000450"
                target="_blank"
                rel="noopener noreferrer"
                className="red"
              >
                read this
              </a>
              .
            </Text>
            <Button onClick={() => setIsCharacterModalOpen(true)}>
              Upload Image
            </Button>

            {isCharacterModalOpen && (
              <ImageUpload
                isOpen={isCharacterModalOpen}
                onClose={() => setIsCharacterModalOpen(false)}
                uploadFunction={uploadImgToCharRecBE}
                renderContent={(prediction, file) => (
                  <RenderCharacterContent
                    predictionMultiple={prediction}
                    file={file}
                  />
                )}
              />
            )}
          </Flex>
          <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
            The algorithm uses image recognition to identify the characters and
            display the name of the character. Simply upload an image of a
            Kathakali character to see the result.
          </Text>
        </section>

        <section id="algorithm2" className="mb-large">
          <Flex vertical>
            <Title level={2} style={{ color: '#ffffff', marginBottom: '1rem' }}>
              Expression Recognition Algorithm
            </Title>
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              This is an AI algorithm that helps users understand the
              Navarasasas (9 Types of Facial Expressions of Kathakali).
            </Text>
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              These are: Raudra (Anger), Sringara (Love), Bibatsa (Odious),
              Karuna (Pity), Shanta (Peace), Adbhuta (Wonder), Vira (Heroic),
              Bhayanaka (Terrible) and Hasya (Comic).
            </Text>
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              This research is accepted for IEEE SPICES 2024, India.
            </Text>
            <Button onClick={() => setIsExpressionModalOpen(true)}>
              Upload Image
            </Button>
            {isExpressionModalOpen && (
              <ImageUpload
                isOpen={isExpressionModalOpen}
                onClose={() => setIsExpressionModalOpen(false)}
                uploadFunction={uploadImgToExpressionRecBE}
                renderContent={(prediction, file) => (
                  <RenderExpressionContent
                    predictionMultiple={prediction}
                    file={file}
                  />
                )}
              />
            )}
            <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
              The algorithm uses image recognition to identify the expressions
              and display the name of the expression. Simply upload an image of
              a Kathakali expression to see the result.
            </Text>
          </Flex>
        </section>
      </Flex>
    </Flex>
  );
}

export default KathakaliPage;
