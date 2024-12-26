import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutUsPage from 'pages/AboutUsPage';
import CommunityPage from 'pages/CommunityPage';
import ContactUsPage from 'pages/ContactUsPage';
import CulturesPage from 'pages/CulturesPage';
import MainPage from 'pages/MainPage';
import KathakaliPage from 'pages/CulturesKathakaliPage';
import KootiyattamPage from 'pages/CulturesKootiyattamPage';
import Navbar from 'components/Common/Navbar';
import DropdownNavbar from 'components/Common/DropdownNavbar';
import useIsMobile from 'utils/isMobile';
import { ConfigProvider, Flex } from 'antd';
import themeStyles from './themeStyles'; // Import your custom theme

function App() {
  const isMobile = useIsMobile();
  return (
    <BrowserRouter>
      <ConfigProvider theme={themeStyles}>
        <Flex vertical>
          {isMobile ? <DropdownNavbar /> : <Navbar />}
          <Flex vertical>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/cultures" element={<CulturesPage />} />
              <Route path="/cultures/kathakali" element={<KathakaliPage />} />
              <Route
                path="/cultures/kootiyattam"
                element={<KootiyattamPage />}
              />
            </Routes>
          </Flex>
        </Flex>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
