import React from 'react';
import { Card, Image, Typography, Flex } from 'antd';
import { Prediction, Character } from 'types/interface';
import { useColourToken, useStyleToken } from 'themeStyles';
import charactersData from 'assets/data/characters.json';
import toPascalCase from 'utils/toPascalCase';
import Button from 'components/Common/Button';
import * as characterImages from './images';

const { Title, Text } = Typography;

interface RenderForOneProps {
  prediction: Prediction;
  imageUrl: string; // Image URL passed as prop
}

const RenderForOne: React.FC<RenderForOneProps> = ({
  prediction,
  imageUrl,
}) => {
  const styleToken = useStyleToken();
  const colourToken = useColourToken();
  const characterInfo = charactersData.find(
    (char: Character) =>
      char.name.toLowerCase() === prediction.prediction.toLowerCase(),
  );
  if (!characterInfo) return null;

  const characterImage =
    characterImages[
      toPascalCase(characterInfo.name) as keyof typeof characterImages
    ];

  if (!characterInfo) return null;

  return (
    <Card
      key={characterInfo.name}
      bordered={false}
      styles={{
        body: { backgroundColor: colourToken.darkGray },
      }}
    >
      <Flex align="center" vertical key={characterInfo.name}>
        <Title style={styleToken.renderContent.renderSectionHeadingTextStyle}>
          {characterInfo.name}
        </Title>
        <Image
          src={imageUrl}
          preview={false} // Disables the preview popup on click
        />
        <Text style={styleToken.renderContent.renderSectionContentTextStyle}>
          {characterInfo.shortDescription}
        </Text>
      </Flex>
      <Flex align="center" vertical>
        <Image src={characterImage} alt={characterInfo.name} />
        <Text style={styleToken.renderContent.renderSectionContentTextStyle}>
          Example:
        </Text>
        <Text style={styleToken.renderContent.renderSectionContentTextStyle}>
          {characterInfo.examples}
        </Text>
      </Flex>
      <Button onClick={() => window.open(characterInfo.url, '_blank')}>
        Find Out More
      </Button>
    </Card>
  );
};

export default RenderForOne;
