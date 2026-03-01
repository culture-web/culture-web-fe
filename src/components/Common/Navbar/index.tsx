import { NavLink, useNavigate } from 'react-router-dom'; // React Router's NavLink for navigation
import { Button, Image, Flex, Dropdown, Avatar } from 'antd'; // Ant Design components
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logoKathakalAI from 'assets/images/logos/kathakalai-pink.png';
import { useStyleToken, useColourToken } from 'themeStyles';
import { useAuth } from 'contexts/AuthContext';

function Navbar() {
  const styleToken = useStyleToken();
  const colourToken = useColourToken();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  
  // Debug logging to see authentication state
  console.log('Navbar render - Authentication state:', { 
    isAuthenticated, 
    user: user ? { id: user.id, email: user.email, name: user.name } : null 
  });
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const activeLinkStyles = styleToken.navigationBar.activeLinkStyle;
  const defaultLinkStyles = styleToken.navigationBar.defaultLinkStyle;

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'signout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

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
          to="/learn"
          style={({ isActive }) =>
            isActive ? activeLinkStyles : defaultLinkStyles
          }
        >
          Learn
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
        {isAuthenticated ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              style={{
                ...defaultLinkStyles,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
              }}
            >
              <Avatar size="small" icon={<UserOutlined />} />
              {user?.name || 'User'}
            </Button>
          </Dropdown>
        ) : (
          <Flex align="center" gap="small" style={{ marginLeft: '1rem' }}>
            <Button
              onClick={() => handleNavigate('/sign-in')}
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '6px 16px',
                borderRadius: '6px',
                minWidth: '80px',
                height: '36px',
                color: colourToken.pinkLight,
                backgroundColor: 'transparent',
                border: `2px solid ${colourToken.pinkLight}`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colourToken.pinkLight;
                e.currentTarget.style.color = colourToken.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colourToken.pinkLight;
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => handleNavigate('/sign-up')}
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '6px 16px',
                borderRadius: '6px',
                minWidth: '80px',
                height: '36px',
                color: colourToken.white,
                backgroundColor: colourToken.pinkLight,
                border: `2px solid ${colourToken.pinkLight}`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colourToken.pink;
                e.currentTarget.style.borderColor = colourToken.pink;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colourToken.pinkLight;
                e.currentTarget.style.borderColor = colourToken.pinkLight;
              }}
            >
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Navbar;
