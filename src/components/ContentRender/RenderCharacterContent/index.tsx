import React, { useEffect, useState } from 'react';
import { Carousel, Card, Spin, Typography, Flex, Image } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import charactersData from 'assets/data/characters.json';
import Button from 'components/Common/Button';
import { PredictionMultiple, Character } from 'types/interface';
import toPascalCase from 'utils/toPascalCase';
import { useColourToken, useStyleToken } from 'themeStyles';
import * as characterImages from './images';
import RenderForOne from './RenderForOne';

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
          <Card
            key={characterInfo.name}
            bordered={false}
            styles={{
              body: { backgroundColor: colourToken.darkGray },
            }}
          >
            <Flex align="center" vertical key={characterInfo.name}>
              <Title
                style={styleToken.renderContent.renderSectionHeadingTextStyle}
              >
                {characterInfo.name}
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
            </Flex>
          </Card>
        );
      })}
    </Carousel>
  );
};

export default RenderCharacterContent;
