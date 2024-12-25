import { Typography, Flex } from 'antd';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import kathakaliVideoUrl from './content';

const { Title, Text } = Typography;

function AboutUsPage() {
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();
  return (
    <Flex vertical>
      <Title style={styleToken.pageHeadingTextStyle}>About Us</Title>
      <Flex vertical={isMobile} gap="large">
        <Flex>
          <iframe
            src={kathakaliVideoUrl}
            title="Kathakali Youtube Video"
            allowFullScreen
            frameBorder={0}
            width="1000px"
            height={isMobile ? '300px' : 'auto'}
          />
        </Flex>
        <Flex vertical>
          <Title style={styleToken.titleTextStyle}>
            KathakalAI has many resources that teach you more about different
            cultures.
          </Title>
          <Flex vertical>
            <a
              href="/cultures/kathakali"
              style={styleToken.cultureLinkTextStylePink}
            >
              Kathakali
            </a>
            <Text style={styleToken.subtitleTextStyle}>
              Kathakali is a classical dance-drama from Kerala, India, known for
              its vibrant costumes, intricate makeup, and elaborate facial
              expressions. It combines dance, music, and acting to tell stories
              from Indian epics like the Mahabharata and Ramayana.
            </Text>
            <a
              href="/cultures/kootiyattam"
              style={styleToken.cultureLinkTextStylePink}
            >
              Kootiyattam
            </a>
            <Text style={styleToken.subtitleTextStyle}>
              Koodiyattam is an ancient Sanskrit theater tradition from Kerala,
              considered one of the oldest living forms of theater. It blends
              dance, drama, and ritualistic elements.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AboutUsPage;
