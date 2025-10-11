import React, { useEffect, useState } from 'react';
import { Card, Flex, Typography, Carousel } from 'antd';
import { PredictionMultiple } from 'types/interface';
import { useColourToken, useStyleToken } from 'themeStyles';
import expressionToContent from './expressions';
import RenderForOne from './RenderForOne';

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

  // If predictionMultiple length is 1, just return for just 1
  if (predictionMultiple.prediction.length === 1) {
    return (
      <RenderForOne
        prediction={predictionMultiple.prediction[0]}
        imageUrl={imageUrl}
      />
    );
  }

  return (
    <Carousel arrows>
      {predictionMultiple.prediction.map((prediction) => {
        const characterInfo =
          expressionToContent[
            prediction.prediction as keyof typeof expressionToContent
          ];
        if (!characterInfo) return null;
        return (
          <Card
            key={characterInfo.Name}
            bordered={false}
            styles={{
              body: { backgroundColor: colourToken.darkGray },
            }}
          >
            <Flex align="center" vertical key={characterInfo.Name}>
              <Title
                style={styleToken.renderContent.renderSectionHeadingTextStyle}
              >
                {characterInfo.Name}
              </Title>
              <div
                style={{
                  width: `${prediction.location.width + 50}px`,
                  height: `${prediction.location.height + 50}px`,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `-${prediction.location.x}px -${prediction.location.y}px`,
                }}
              />
              <Text
                style={styleToken.renderContent.renderSectionContentTextStyle}
              >
                {characterInfo.Description}
              </Text>
            </Flex>
          </Card>
        );
      })}
    </Carousel>
  );
};

export default RenderExpressionContent;
