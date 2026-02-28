import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutUsPage from 'pages/AboutUsPage';
import ContactUsPage from 'pages/ContactUsPage';
import CulturesPage from 'pages/CulturesPage';
import QuizPage from 'pages/QuizPage';
import MainPage from 'pages/MainPage';
import KathakaliPage from 'pages/CulturesKathakaliPage';
import KootiyattamPage from 'pages/CulturesKootiyattamPage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import ResetPasswordPage from 'pages/ResetPasswordPage';
import MudrasPage from 'pages/MudrasPage';
import AdminPage from 'pages/AdminPage';
import AdminLoginPage from 'pages/AdminLoginPage';
import ProtectedRoute from 'components/Common/ProtectedRoute';
import OrnamentsPage from 'pages/OrnamentsPage';
import OrnamentsCharacterListPage from 'pages/OrnamentsCharacterListPage';
import Navbar from 'components/Common/Navbar';
import DropdownNavbar from 'components/Common/DropdownNavbar';
import useIsMobile from 'utils/isMobile';
import { ConfigProvider, Flex } from 'antd';
import { AuthProvider } from 'contexts/AuthContext';
import themeStyles from './themeStyles'; // Import your custom theme

function App() {
  const isMobile = useIsMobile();
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider theme={themeStyles}>
          <Flex vertical>
            {isMobile ? <DropdownNavbar /> : <Navbar />}
            <Flex vertical style={{ padding: '0 2rem' }}>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/cultures" element={<CulturesPage />} />
                <Route path="/cultures/kathakali" element={<KathakaliPage />} />
                <Route
                  path="/cultures/kootiyattam"
                  element={<KootiyattamPage />}
                />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/learn" element={<MudrasPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route 
                path="/k-manage-portal" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/cultures/kathakali/ornaments" element={<OrnamentsCharacterListPage />}/>
              <Route path="/cultures/kathakali/ornaments/:characterId" element={<OrnamentsPage />} />
              </Routes>
            </Flex>
          </Flex>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
