import React, { useEffect, useState } from 'react';
import { Carousel, Card, Spin, Typography, Flex, Image } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import charactersData from 'assets/data/characters.json';
import Button from 'components/Common/Button';
import { PredictionMultiple, Character } from 'types/interface';
import toPascalCase from 'utils/toPascalCase';
import { useColourToken, useStyleToken } from 'themeStyles';
import * as characterImages from './images';

const { Title, Text } = Typography;

const RenderCharacterContent: React.FC<{
  predictionMultiple: PredictionMultiple;
  file: File;
}> = ({ predictionMultiple, file }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const colourToken = useColourToken();
  const styleToken = useStyleToken();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setLoading(false);
      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [file]);

  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} />;
  }

  return (
    <Carousel arrows>
      {predictionMultiple.prediction.map((prediction) => {
        const characterInfo = charactersData.find(
          (char: Character) =>
            char.name.toLowerCase() === prediction.prediction.toLowerCase(),
        );
        if (!characterInfo) return null;

        const characterImage =
          characterImages[
            toPascalCase(characterInfo.name) as keyof typeof characterImages
          ];

        return (
          <Flex align="center" vertical key={characterInfo.name}>
            <Card
              key={characterInfo.name}
              bordered={false}
              styles={{
                body: { backgroundColor: colourToken.darkGray },
              }}
            >
              <Title
                style={styleToken.renderContent.renderSectionHeadingTextStyle}
              >
                {characterInfo.name}
              </Title>
              <Image
                src={imageUrl}
                style={{
                  objectFit: 'cover', // To make sure the image covers the area
                  objectPosition: `-${prediction.location.x}px -${prediction.location.y}px`, // This will adjust the position of the image
                  width: '100%',
                  height: '100%', // Optional, adjust as per your design needs
                }}
                preview={false} // Disables the default Ant Design image preview
              />
              <Text
                style={styleToken.renderContent.renderSectionContentTextStyle}
              >
                {characterInfo.shortDescription}
              </Text>
              <Flex align="center" vertical>
                <Image src={characterImage} alt={characterInfo.name} />
                <Text
                  style={styleToken.renderContent.renderSectionContentTextStyle}
                >
                  Example:
                </Text>
                <Text
                  style={styleToken.renderContent.renderSectionContentTextStyle}
                >
                  {characterInfo.examples}
                </Text>
              </Flex>
              <Button onClick={() => window.open(characterInfo.url, '_blank')}>
                Find Out More
              </Button>
            </Card>
          </Flex>
        );
      })}
    </Carousel>
  );
};

export default RenderCharacterContent;
