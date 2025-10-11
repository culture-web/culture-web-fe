import CultureCard from 'components/Common/CultureCard';
import { Typography, Flex } from 'antd';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import cultureData from './content';

const { Title } = Typography;

function CulturesPage() {
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();
  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>Cultures</Title>
      <Flex gap="2rem" vertical={isMobile} style={{ marginBottom: isMobile ? '2rem' : '0rem' }}>
        {cultureData.map((culture) => (
          <CultureCard
            key={culture.name}
            name={culture.name}
            url={culture.url}
            imageUrl={culture.imageUrl}
            description={culture.description}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default CulturesPage;
