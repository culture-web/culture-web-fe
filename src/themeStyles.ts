// theme.ts
import { theme as AntdTheme } from 'antd';

const colours = {
  primary: '#2b2d38',
  white: '#fff',
  gray: '#ababab',
  pink: '#c81f58',
  pinkLight: '#db2a6b',
  green: '#00a86b',
  black: '#000',
  red: '#ff474c',
  darkGray: '#1c1e24',
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

// Navigation Bar Styles

const navigationBarStyle = {
  marginTop: '1rem',
  justifyContent: 'space-between',
  padding: '0 2rem',
  backgroundColor: colours.primary,
};

const navigationBarKathakalAIButtonStyle = {
  color: colours.pinkLight,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  outline: 'none',
};

const navigationBarActiveLinkStyle = {
  fontSize: '1.5rem',
  textDecoration: 'underline',
  color: colours.white,
};

const navigationBarDefaultLinkStyle = {
  fontSize: '1.5rem',
  color: colours.gray,
  textDecoration: 'none',
};

const pageHeadingTextStyle = {
  color: colours.white,
  fontSize: '3.5rem',
  marginBottom: '2rem',
};

const cultureLinkTextStylePink = {
  color: colours.pinkLight,
  fontSize: '2rem',
  textDecoration: 'underline',
  marginBottom: '0.5rem',
};

const cultureLinkTextStyleWhite = {
  color: colours.white,
  fontSize: '2rem',
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

const renderSectionHeadingTextStyle = {
  color: colours.white,
  fontSize: '2rem',
  marginBottom: '1rem',
};

const renderSectionContentTextStyle = {
  color: colours.white,
  fontSize: '1.2rem',
  marginBottom: '1rem',
};

const cultureSectionButtonTextStyle = {
  fontSize: '1.25rem',
  color: colours.white,
};

const cultureSectionHeadingTextStyle = {
  color: colours.white,
  marginBottom: '1rem',
  fontSize: '2rem',
};

const cultureSectionContentTextStyle = {
  color: colours.gray,
  fontSize: '1.5rem',
};

export const useStyleToken = () => {
  const { token } = AntdTheme.useToken();
  return {
    ...token,
    pageHeadingTextStyle,
    titleTextStyle,
    subtitleTextStyle,
    thankyouTextStyle,
    cultureLinkTextStylePink,
    cultureLinkTextStyleWhite,
    navigationBar: {
      navigationBarStyle,
      kathakalAIButtonStyle: navigationBarKathakalAIButtonStyle,
      activeLinkStyle: navigationBarActiveLinkStyle,
      defaultLinkStyle: navigationBarDefaultLinkStyle,
    },
    culture: {
      cultureSectionButtonTextStyle,
      cultureSectionHeadingTextStyle,
      cultureSectionContentTextStyle,
    },
    renderContent: {
      renderSectionHeadingTextStyle,
      renderSectionContentTextStyle,
    },
  };
};

export default themeStyles;
