// theme.ts
import { theme as AntdTheme } from 'antd';

const themeStyles = {
  token: {},
};

const colours = {
  primary: '#2b2d38',
  white: '#fff',
  gray: '#ababab',
  pink: '#c81f58',
  pinkLight: '#db2a6b',
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

export const useStyleToken = () => {
  const { token } = AntdTheme.useToken();
  return {
    ...token,
    pageHeadingStyle: pageHeadingTextStyle,
    titleTextStyle,
    subtitleTextStyle,
  };
};

export default themeStyles;
