import React from 'react';
import { Card, Image, Typography, Flex } from 'antd';
import { Prediction } from 'types/interface'; // Assuming interface types are defined somewher
import { useColourToken, useStyleToken } from 'themeStyles'; // Assuming these hooks are defined somewhere
import expressionToContent from './expressions';

const { Title, Text } = Typography;

interface RenderForOneProps {
  prediction: Prediction;
  imageUrl: string; // Image URL passed as prop
}

const RenderForOne: React.FC<RenderForOneProps> = ({
  prediction,
  imageUrl,
}) => {
  const characterInfo =
    expressionToContent[
      prediction.prediction as keyof typeof expressionToContent
    ];
  const styleToken = useStyleToken();
  const colourToken = useColourToken();

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
        <Title style={styleToken.renderContent.renderSectionHeadingTextStyle}>
          {characterInfo.Name}
        </Title>
        <Image
          src={imageUrl}
          preview={false} // Disables the preview popup on click
        />
        <Text style={styleToken.renderContent.renderSectionContentTextStyle}>
          {characterInfo.Description}
        </Text>
      </Flex>
    </Card>
  );
};

export default RenderForOne;
