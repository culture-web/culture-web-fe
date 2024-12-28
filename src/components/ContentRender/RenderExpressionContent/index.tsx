import React, { useEffect, useState } from 'react';
import { Carousel, Card, Flex, Typography, Image } from 'antd';
import { PredictionMultiple } from 'types/interface';
import expressionToContent from './expressions';
import { useColourToken, useStyleToken } from 'themeStyles';

const { Title, Text } = Typography;

const RenderExpressionContent: React.FC<{
  predictionMultiple: PredictionMultiple;
  file: File;
}> = ({ predictionMultiple, file }) => {
  const [imageUrl, setImageUrl] = useState('');
  const colourToken = useColourToken();
  const styleToken = useStyleToken();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [file]);

  return (
    <Carousel arrows>
      {predictionMultiple.prediction.map((prediction) => {
        const characterInfo =
          expressionToContent[
            prediction.prediction as keyof typeof expressionToContent
          ];
        if (!characterInfo) return null;
        return (
          <Flex align="center" vertical>
            <Card
              key={characterInfo.Name}
              bordered={false}
              styles={{
                body: { backgroundColor: colourToken.darkGray },
              }}
            >
              <Title
                style={styleToken.renderContent.renderSectionHeadingTextStyle}
              >
                {characterInfo.Name}
              </Title>
              <Image
                src={imageUrl}
                style={{
                  objectFit: 'cover', // Ensures the image fills the container without distorting
                  objectPosition: `-${prediction.location.x}px -${prediction.location.y}px`, // Adjust the position of the image
                  width: '100%',
                  height: '100%', // Adjust as needed (e.g., fixed height or auto)
                }}
                preview={false} // Disables the preview popup on click
              />
              <Text
                style={styleToken.renderContent.renderSectionContentTextStyle}
              >
                {characterInfo.Description}
              </Text>
            </Card>
          </Flex>
        );
      })}
    </Carousel>
  );
};

export default RenderExpressionContent;
