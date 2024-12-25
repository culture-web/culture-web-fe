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
    <Flex vertical>
      <Title style={styleToken.pageHeadingStyle}>Cultures</Title>
      <Flex justify="center" align="center" gap="large" vertical={isMobile}>
        {cultureData.map((culture) => (
          <CultureCard
            key={culture.name}
            name={culture.name}
            url={culture.url}
            imageUrl={culture.imageUrl}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default CulturesPage;
