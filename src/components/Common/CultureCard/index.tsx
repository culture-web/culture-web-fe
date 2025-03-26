import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Flex, Typography } from 'antd';
import Button from 'components/Common/Button';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

const { Text } = Typography;

interface CultureCardProps {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
}

const CultureCard: React.FC<CultureCardProps> = ({ name, url, imageUrl, description }) => {
  const navigate = useNavigate();
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const buttonText = `Read More About ${name}`;

  const navigateToCulture = () => {
    navigate(`/cultures/${url.toLowerCase()}`);
  };

  return (
    <Flex vertical>
      <Image
        src={imageUrl}
        alt={name}
        style={{
          width: isMobile ? '100%' : '600px',
          height: isMobile ? '300px' : '400px',
          objectFit: 'cover', // Ensures the image scales properly within the box
          borderRadius: '8px', // Optional for rounded corners
          border: '2px solid #ccc', // Added border property

        }}
        preview={false}
      />
      <Text style={styleToken.cultureLinkTextStyleWhite}>{name}</Text>
      <Text style={styleToken.cultureLinkTextStyleDescriptionWhite}>{description}</Text>
      <Button onClick={navigateToCulture}>{buttonText}</Button>
    </Flex>
  );
};

export default CultureCard;
