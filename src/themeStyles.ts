// theme.ts
import { theme as AntdTheme } from 'antd';

const themeStyles = {
    token: {
    },
  };

export const useStyleToken = () => {
    const { token } = AntdTheme.useToken();
    return {
      ...token,
      button: {
        colorBgButton: '#c81f58',
        colorBgButtonHover: '#db2a6b',
        textColor: '#fff',
      },
    };
  }
  
  export default themeStyles;
  