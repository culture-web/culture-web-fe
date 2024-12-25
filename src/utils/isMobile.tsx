// Use Grid in ant d and check if is mobile
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const useIsMobile = () => {
  const screens = useBreakpoint();
  return screens.xs;
};

export default useIsMobile; // Default export
