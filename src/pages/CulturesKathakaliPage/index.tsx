import { useState } from 'react';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali6.jpg';
import ImageUpload from 'components/FileUploads/ImageUpload';
import { Image, Flex, Typography, Button } from 'antd';
import {
  // uploadImgToCharRecBEMultiple,
  uploadImgToCharRecBESingle,
  // uploadImgToExpressionRecBEMultiple,
  uploadImgToExpressionRecBESingle,
  uploadCharacterDataToBE,
} from 'utils/invokeBackend';
import RenderCharacterContent from 'components/ContentRender/RenderCharacterContent';
import RenderExpressionContent from 'components/ContentRender/RenderExpressionContent';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

const { Text, Title } = Typography;

function KathakaliPage() {
  const [isCharacterModalSingleOpen, setIsCharacterModalSingleOpen] =
    useState(false);
  const [isExpressionModalSingleOpen, setIsExpressionModalSingleOpen] =
    useState(false);
  // const [isCharacterModalMultipleOpen, setIsCharacterModalMultipleOpen] =
  //   useState(false);
  // const [isExpressionModalMultipleOpen, setIsExpressionModalMultipleOpen] =
  //   useState(false);
  

  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const headingStyle = isMobile ? styleToken.culture.cultureSectionHeadingTextStyleMobile : styleToken.culture.cultureSectionHeadingTextStyle;
  const contentStyle = isMobile ? styleToken.culture.cultureSectionContentTextStyleMobile : styleToken.culture.cultureSectionContentTextStyle;

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
      <Flex vertical align="center" style={{ maxWidth: isMobile ? '90%' : '75%' }}>
        <section id="overview">
          <Title style={headingStyle}>
            Overview
          </Title>
          <Text style={contentStyle}>
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
            <Title style={headingStyle}>
              Character Recognition Algorithm
            </Title>
            <Text style={contentStyle}>
              This is an AI algorithm that helps users understand the major
              types of Kathakali characters, namely: Pacha, Kathi,
              Minukku-Female, Chuvanna-Thadi, Vella-Thadi and Kari-Male.
            </Text>
            <Text style={contentStyle}>
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
            <Flex gap="large" style={{ margin: '0.5rem 0rem' }}>
              <Button onClick={() => setIsCharacterModalSingleOpen(true)}>
                Upload Character Image
              </Button>
              {/* <Button onClick={() => setIsCharacterModalMultipleOpen(true)}>
                Upload Image Multiple (BETA)
              </Button> */}
            </Flex>
          </Flex>
          <Text style={contentStyle}>
            The algorithm uses image recognition to identify the characters and
            display the name of the character. Simply upload an image of a
            Kathakali character to see the result.
          </Text>
        </section>

        <section id="algorithm2">
          <Flex vertical>
            <Title style={headingStyle}>
              Expression Recognition Algorithm
            </Title>
            <Text style={contentStyle}>
              This is an AI algorithm that helps users understand the
              Navarasasas (9 Types of Facial Expressions of Kathakali).
            </Text>
            <Text style={contentStyle}>
              These are: Raudra (Anger), Sringara (Love), Bibatsa (Odious),
              Karuna (Pity), Shanta (Peace), Adbhuta (Wonder), Vira (Heroic),
              Bhayanaka (Terrible) and Hasya (Comic).
            </Text>
            <Text style={contentStyle}>
              This research is accepted for IEEE SPICES 2024, India.
            </Text>
            <Flex gap="large" style={{ margin: '0.5rem 0rem' }}>
              <Button onClick={() => setIsExpressionModalSingleOpen(true)}>
                Upload Expression Image
              </Button>
              {/* <Button onClick={() => setIsExpressionModalMultipleOpen(true)}>
                Upload Image Multiple (BETA)
              </Button> */}
            </Flex>
            <Text style={contentStyle}>
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
          uploadFeedbackFunction={uploadCharacterDataToBE}
          uploadFunction={uploadImgToExpressionRecBESingle}
          renderContent={(prediction, file) => (
            <RenderExpressionContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
          modalText="What should be the expression?"
          modalSelections={[
            'Raudra',
            'Sringara',
            'Bibatsa',
            'Karuna',
            'Shanta',
            'Adbhuta',
            'Vira',
            'Bhayanaka',
            'Hasya',
          ]}
          type="expression"
        />
      )}
      {/* {isExpressionModalMultipleOpen && (
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
      )} */}
      {isCharacterModalSingleOpen && (
        <ImageUpload
          isOpen={isCharacterModalSingleOpen}
          onClose={() => setIsCharacterModalSingleOpen(false)}
          uploadFunction={uploadImgToCharRecBESingle}
          uploadFeedbackFunction={uploadCharacterDataToBE}
          renderContent={(prediction, file) => (
            <RenderCharacterContent
              predictionMultiple={prediction}
              file={file}
            />
          )}
          modalText="What should be the character?"
          modalSelections={[
            'Red-beard',
            'Kari-Male',
            'Pacha',
            'Kathi',
            'White-beard',
            'Minukku-Female',
          ]}
          type="character"
        />
      )}
      {/* {isCharacterModalMultipleOpen && (
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
      )} */}
    </Flex>
  );
}

export default KathakaliPage;
