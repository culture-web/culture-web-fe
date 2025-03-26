import { NavLink, useNavigate } from 'react-router-dom'; // React Router's NavLink for navigation
import { Button, Image, Flex } from 'antd'; // Ant Design components
import logoKathakalAI from 'assets/images/logos/kathakalai-pink.png';
import { useStyleToken } from 'themeStyles';

function Navbar() {
  const styleToken = useStyleToken();
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const activeLinkStyles = styleToken.navigationBar.activeLinkStyle;
  const defaultLinkStyles = styleToken.navigationBar.defaultLinkStyle;

  return (
    <Flex style={styleToken.navigationBar.navigationBarStyle}>
      <Button
        type="text"
        onClick={() => handleNavigate('/')}
        style={styleToken.navigationBar.kathakalAIButtonStyle}
        onMouseDown={(e) => e.preventDefault()} // Prevent the default behavior of focus/active states
      >
        <Image
          src={logoKathakalAI}
          alt="KathakalAI Logo"
          style={{
            height: '60px',
            marginRight: '0.5rem', // Space between the logo and text
          }}
          preview={false} // Disables the preview popup on click
        />
        KathakalAI
      </Button>
      <Flex align="center" gap="large">
        <NavLink
          to="/"
          style={({ isActive }) =>
            isActive ? activeLinkStyles : defaultLinkStyles
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/cultures"
          style={({ isActive }) =>
            isActive ? activeLinkStyles : defaultLinkStyles
          }
        >
          Cultures
        </NavLink>
        <NavLink
          to="/about-us"
          style={({ isActive }) =>
            isActive ? activeLinkStyles : defaultLinkStyles
          }
        >
          About Us
        </NavLink>
        <NavLink
            to="/quiz"
            onClick={() => handleNavigate('/quiz')}
            style={({ isActive }) =>
              isActive ? activeLinkStyles : defaultLinkStyles
            }
          >
            Quiz
          </NavLink>
        <NavLink
          to="/contact-us"
          style={({ isActive }) =>
            isActive ? activeLinkStyles : defaultLinkStyles
          }
        >
          Contact Us
        </NavLink>
      </Flex>
    </Flex>
  );
}

export default Navbar;
