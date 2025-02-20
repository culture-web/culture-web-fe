import { useState } from 'react';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali6.jpg';
import ImageUpload from 'components/FileUploads/ImageUpload';
import { Image, Flex, Typography, Button } from 'antd';
import {
  uploadImgToCharRecBEMultiple,
  uploadImgToCharRecBESingle,
  uploadImgToExpressionRecBEMultiple,
  uploadImgToExpressionRecBESingle,
} from 'utils/invokeBackend';
import RenderCharacterContent from 'components/ContentRender/RenderCharacterContent';
import RenderExpressionContent from 'components/ContentRender/RenderExpressionContent';
import { useStyleToken } from 'themeStyles';

const { Text, Title } = Typography;

function KathakaliPage() {
  const [isCharacterModalSingleOpen, setIsCharacterModalSingleOpen] =
    useState(false);
  const [isExpressionModalSingleOpen, setIsExpressionModalSingleOpen] =
    useState(false);
  const [isCharacterModalMultipleOpen, setIsCharacterModalMultipleOpen] =
    useState(false);
  const [isExpressionModalMultipleOpen, setIsExpressionModalMultipleOpen] =
    useState(false);

  const styleToken = useStyleToken();

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
        <Image src={kathakaliImage} alt="Kathakali" preview={false} />
      </Flex>

      <nav>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'overview')
          }
          style={styleToken.culture.cultureSectionButtonTextStyle}
        >
          Overview
        </Button>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'algorithm1')
          }
          style={styleToken.culture.cultureSectionButtonTextStyle}
        >
          Character Recognition Algorithm
        </Button>
        <Button
          type="text"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleNavigation(e, 'algorithm2')
          }
          style={styleToken.culture.cultureSectionButtonTextStyle}
        >
          Expression Recognition Algorithm
        </Button>
      </nav>
      <Flex vertical align="center" style={{ maxWidth: '75%' }}>
        <section id="overview">
          <Title style={styleToken.culture.cultureSectionHeadingTextStyle}>
            Overview
          </Title>
          <Text style={styleToken.culture.cultureSectionContentTextStyle}>
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
        <section id="algorithm1">
          <Flex vertical>
            <Title style={styleToken.culture.cultureSectionHeadingTextStyle}>
              Character Recognition Algorithm
            </Title>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              This is an AI algorithm that helps users understand the major
              types of Kathakali characters, namely: Pacha, Kathi,
              Minukku-Female, Chuvanna-Thadi, Vella-Thadi and Kari-Male.
            </Text>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              To learn more about this research,{' '}
              <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S2212054823000450"
                target="_blank"
                rel="noopener noreferrer"
              >
                read this
              </a>
              .
            </Text>
            <Flex gap="large">
              <Button onClick={() => setIsCharacterModalSingleOpen(true)}>
                Upload Image
              </Button>
              {/* <Button onClick={() => setIsCharacterModalMultipleOpen(true)}>
                Upload Image Multiple (BETA)
              </Button> */}
            </Flex>
          </Flex>
          <Text style={styleToken.culture.cultureSectionContentTextStyle}>
            The algorithm uses image recognition to identify the characters and
            display the name of the character. Simply upload an image of a
            Kathakali character to see the result.
          </Text>
        </section>

        <section id="algorithm2">
          <Flex vertical>
            <Title style={styleToken.culture.cultureSectionHeadingTextStyle}>
              Expression Recognition Algorithm
            </Title>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              This is an AI algorithm that helps users understand the
              Navarasasas (9 Types of Facial Expressions of Kathakali).
            </Text>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              These are: Raudra (Anger), Sringara (Love), Bibatsa (Odious),
              Karuna (Pity), Shanta (Peace), Adbhuta (Wonder), Vira (Heroic),
              Bhayanaka (Terrible) and Hasya (Comic).
            </Text>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              This research is accepted for IEEE SPICES 2024, India.
            </Text>
            <Flex gap="large">
              <Button onClick={() => setIsExpressionModalSingleOpen(true)}>
                Upload Image
              </Button>
              {/* <Button onClick={() => setIsExpressionModalMultipleOpen(true)}>
                Upload Image Multiple (BETA)
              </Button> */}
            </Flex>
            <Text style={styleToken.culture.cultureSectionContentTextStyle}>
              The algorithm uses image recognition to identify the expressions
              and display the name of the expression. Simply upload an image of
              a Kathakali expression to see the result.
            </Text>
          </Flex>
        </section>
      </Flex>
      {isExpressionModalSingleOpen && (
        <ImageUpload
          isOpen={isExpressionModalSingleOpen}
          onClose={() => setIsExpressionModalSingleOpen(false)}
          uploadFunction={uploadImgToExpressionRecBESingle}
          renderContent={(prediction, file) => (
            <RenderExpressionContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
        />
      )}
      {isExpressionModalMultipleOpen && (
        <ImageUpload
          isOpen={isExpressionModalMultipleOpen}
          onClose={() => setIsExpressionModalMultipleOpen(false)}
          uploadFunction={uploadImgToExpressionRecBEMultiple}
          renderContent={(prediction, file) => (
            <RenderExpressionContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
        />
      )}
      {isCharacterModalSingleOpen && (
        <ImageUpload
          isOpen={isCharacterModalSingleOpen}
          onClose={() => setIsCharacterModalSingleOpen(false)}
          uploadFunction={uploadImgToCharRecBESingle}
          renderContent={(prediction, file) => (
            <RenderCharacterContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
        />
      )}
      {isCharacterModalMultipleOpen && (
        <ImageUpload
          isOpen={isCharacterModalMultipleOpen}
          onClose={() => setIsCharacterModalMultipleOpen(false)}
          uploadFunction={uploadImgToCharRecBEMultiple}
          renderContent={(prediction, file) => (
            <RenderCharacterContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
        />
      )}
    </Flex>
  );
}

export default KathakaliPage;
