import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkuFemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png';
import chuvannathadiImage from 'assets/images/kathakali-stock-images/chuvannathadi.png';
import kathiImage from 'assets/images/kathakali-stock-images/kathi.png'
import karimaleImage from 'assets/images/kathakali-stock-images/karimale.png'
import krishnaImage from 'assets/images/kathakali-stock-images/krishna.png'
import rowdrabheemanImage from 'assets/images/kathakali-stock-images/rowdrabheeman.png'
import pachaOrnamentsData from './data/pachaOrnamentsData';
import minukkuFemaleOrnamentsData from './data/minukkuFemaleOrnamentsData';
import chuvannaThadiOrnamentsData from './data/chuvannaThadiOrnamentsData';
import kathiOrnamentsData from './data/kathiOrnamentsData';
import kariMaleOrnamentsData from './data/kariMaleOrnamentsData';
import krishnaOrnamentsData from './data/krishnaOrnamentsData';
import rowdrabheemanOrnamentsData from './data/rowdrabheemanOrnamentsData';

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
      transform: 'translate(0px, 120px)',
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
      transform: 'translate(0px, 120px)',
    }
  },
  kathi: {
    title: 'Kathi',
    image: kathiImage,
    data: kathiOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 800,
      height: 'auto',
      transform: 'translate(25px, 50px)',
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
      transform: 'translate(25px, 50px)',
    }
  },
  karimale: {
    title: 'Kari Male',
    image: karimaleImage,
    data: kariMaleOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 1000,
      height: 'auto',
      transform: 'translate(0px, 00px)',
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
      transform: 'translate(0px, 0px)',
    }
  },
  krishna: {
    title: 'Krishna',
    image: krishnaImage,
    data: krishnaOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 1000,
      height: 'auto',
      transform: 'translate(0px, 50px)',
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
      transform: 'translate(0px, 50px)'
    }
  },  
  rowdrabheeman: {
    title: 'Rowdrabheeman',
    image: rowdrabheemanImage,
    data: rowdrabheemanOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 1000,
      height: 'auto',
      transform: 'translate(0px, 50px)',
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
      transform: 'translate(0px, 50px)'
    }
  },
};

export default characterConfigs;
