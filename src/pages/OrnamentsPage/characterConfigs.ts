import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkuFemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png';
import chuvannathadiImage from 'assets/images/kathakali-stock-images/chuvannathadi.png';
import pachaOrnamentsData from './data/pachaOrnamentsData';
import minukkuFemaleOrnamentsData from './data/minukkuFemaleOrnamentsData';
import chuvannaThadiOrnamentsData from './data/chuvannaThadiOrnamentsData';

import type { Ornament } from './types';

export type CharacterConfig = {
  title: string;
  image: string;
  data: Ornament[];
  imageStyle?: React.CSSProperties;
  svgStyle?: React.CSSProperties;
};

const characterConfigs: Record<string, CharacterConfig> = {
  pacha: {
    title: 'Pacha',
    image: pachaImage,
    data: pachaOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 1000,
      height: 'auto',
      transform: 'translate(25px, -50px)',
      pointerEvents: 'none',
      margin: '0 auto'
    },
    svgStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      transform: 'translate(25px, -50px)'
    }
  },
  minukkufemale: {
    title: 'Minukku Female',
    image: minukkuFemaleImage,
    data: minukkuFemaleOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 800,
      height: 'auto',
      transform: 'translate(0px, 150px)',
      margin: '0 auto',
      pointerEvents: 'none'
    },
    svgStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      transform: 'translate(0px, 150px)',
    }
  },
  chuvannathadi: {
    title: 'Chuvanna Thadi',
    image: chuvannathadiImage,
    data: chuvannaThadiOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 800,
      height: 'auto',
      transform: 'translate(0px, 150px)',
      margin: '0 auto',
      pointerEvents: 'none'
    },
    svgStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      transform: 'translate(0px, 150px)',
    }
  }
};

export default characterConfigs;
