// theme.ts
import { theme as AntdTheme } from 'antd';

const colours = {
  primary: '#2b2d38',
  white: '#fff',
  gray: '#ababab',
  pink: '#c81f58',
  pinkLight: '#db2a6b',
  green: '#00a86b',
};

const themeStyles = {
  token: {},
  components: {
    Input: {
      colorTextPlaceholder: colours.gray,
    },
  },
};

export const useColourToken = () => ({
  ...colours,
});

// Page Headings, such as Home, Cultures, etc...
const pageHeadingTextStyle = {
  color: colours.white,
  fontSize: '3.5rem',
  marginBottom: '1rem',
};

const cultureLinkTextStylePink = {
  color: colours.pinkLight,
  fontSize: '2rem',
  textDecoration: 'underline',
  marginBottom: '0.5rem',
};

const titleTextStyle = {
  color: colours.white,
  fontSize: '3rem',
  marginBottom: '1rem',
};

const subtitleTextStyle = {
  color: colours.gray,
  fontSize: '1.5rem',
  marginBottom: '1rem',
};

const thankyouTextStyle = {
  color: colours.green,
  fontSize: '1.5rem',
  marginBottom: '1rem',
};

export const useStyleToken = () => {
  const { token } = AntdTheme.useToken();
  return {
    ...token,
    pageHeadingTextStyle,
    titleTextStyle,
    subtitleTextStyle,
    thankyouTextStyle,
    cultureLinkTextStyle: cultureLinkTextStylePink,
  };
};

export default themeStyles;
