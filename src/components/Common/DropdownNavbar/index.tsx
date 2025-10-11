import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Image, Flex } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import logoKathakalAI from 'assets/images/logos/kathakalai-pink.png';
import { useStyleToken } from 'themeStyles';

function DropdownNavbar() {
  const [open, setOpen] = useState(false);
  const styleToken = useStyleToken();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const activeLinkStyles = styleToken.navigationBar.activeLinkStyle;
  const defaultLinkStyles = styleToken.navigationBar.defaultLinkStyle;

  return (
    <Flex
      style={styleToken.navigationBar.navigationBarStyle}
      align="center"
      vertical
    >
      <Flex gap="large">
        <Button
          type="text"
          onClick={() => handleNavigate('/')}
          style={styleToken.navigationBar.kathakalAIButtonStyle}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Image
            src={logoKathakalAI}
            alt="KathakalAI Logo"
            preview={false}
            style={{ height: '60px', marginRight: '0.5rem' }}
          />
          KathakalAI
        </Button>

        <MenuOutlined
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        />
      </Flex>
      {open && (
        <Flex vertical gap="large" style={{ marginTop: '1rem' }}>
          <NavLink
            to="/"
            onClick={() => handleNavigate('/')}
            style={({ isActive }) =>
              isActive ? activeLinkStyles : defaultLinkStyles
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cultures"
            onClick={() => handleNavigate('/cultures')}
            style={({ isActive }) =>
              isActive ? activeLinkStyles : defaultLinkStyles
            }
          >
            Cultures
          </NavLink>
          <NavLink
            to="/about-us"
            onClick={() => handleNavigate('/about-us')}
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
            onClick={() => handleNavigate('/contact-us')}
            style={({ isActive }) =>
              isActive ? activeLinkStyles : defaultLinkStyles
            }
          >
            Contact Us
          </NavLink>
        </Flex>
      )}
    </Flex>
  );
}

export default DropdownNavbar;
