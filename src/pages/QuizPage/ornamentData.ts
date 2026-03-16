import kireedam from '../../assets/images/kathakali-ornaments/kireedam.png';
import thoda from '../../assets/images/kathakali-ornaments/thoda.png';
import chevippuvu from '../../assets/images/kathakali-ornaments/chevippuvu.png';
import chutti from '../../assets/images/kathakali-ornaments/chutti.png';
import kazhuthunada from '../../assets/images/kathakali-ornaments/kazhuthunada.png';
import kazhuttaram from '../../assets/images/kathakali-ornaments/kazhuttaram.png';
import paruttikkaimani from '../../assets/images/kathakali-ornaments/paruttikkaimani.png';
import tolputtu from '../../assets/images/kathakali-ornaments/tolputtu.png';
import kuralaram from '../../assets/images/kathakali-ornaments/kuralaram.png';
import uttariya from '../../assets/images/kathakali-ornaments/uttariya.png';
import kastakatakam from '../../assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from '../../assets/images/kathakali-ornaments/kalases.png';
import pattuval from '../../assets/images/kathakali-ornaments/pattuval.png';
import patiarannanam from '../../assets/images/kathakali-ornaments/patiarannanam.png';
import ottanakku from '../../assets/images/kathakali-ornaments/ottanakku.png';
import tantappatippu from '../../assets/images/kathakali-ornaments/tantappatippu.png';
import chuttituni from '../../assets/images/kathakali-ornaments/chuttituni.png';
import kecchamani from '../../assets/images/kathakali-ornaments/kecchamani.png';
import { QuizCategory } from "./quizTypes";

import generateOptions from './helperFunctions';

const startingQuestion = 'Which ornament is this?';

const KIREEDAM = 'Kireedam';
const THODA = 'Thoda';
const CHEVIPPUVU = 'Chevippuvu';
const CHUTTI = 'Chutti';
const KAZHUTHU_NADA = 'Kazhuthu-Nada';
const KAZHUTTARAM = 'Kazhuttaram';
const PARUTTIKKAIMANI = 'Paruttikkaimani';
const TOLPUTTU = 'Tolputtu';
const KURALARAM = 'Kuralaram';
const UTTARIYA = 'Uttariya';
const KASTAKATAKAM = 'Kastakatakam';
const KALASES = 'Kalases';
const PATTU_VAL = 'Pattu-Val';
const PATIARANNANAM = 'Patiarannanam';
const OTTANAKKU = 'Ottanakku';
const TANTAPPATIPPU = 'Tantappatippu';
const CHUTTITUNI = 'Chuttituni';
const KECCHAMANI = 'Kecchamani';


const ornaments = [
  KIREEDAM,
  THODA,
  CHEVIPPUVU,
  CHUTTI,
  KAZHUTHU_NADA,
  KAZHUTTARAM,
  PARUTTIKKAIMANI,
  TOLPUTTU,
  KURALARAM,
  UTTARIYA,
  KASTAKATAKAM,
  KALASES,
  PATTU_VAL,
  PATIARANNANAM,
  OTTANAKKU,
  TANTAPPATIPPU,
  CHUTTITUNI,
  KECCHAMANI,
];

const quizOrnament: QuizCategory[] = [
  {
    id: 1,
    title: KIREEDAM,
    items: [
      { id: 101, question: startingQuestion, image: kireedam, options: generateOptions(KIREEDAM, ornaments), correctAnswer: KIREEDAM },
    ],
  },
  {
    id: 2,
    title: THODA,
    items: [
      { id: 102, question: startingQuestion, image: thoda, options: generateOptions(THODA, ornaments), correctAnswer: THODA },
    ],
  },
  {
    id: 3,
    title: CHEVIPPUVU,
    items: [
      { id: 103, question: startingQuestion, image: chevippuvu, options: generateOptions(CHEVIPPUVU, ornaments), correctAnswer: CHEVIPPUVU },
    ],
  },
  {
    id: 4,
    title: CHUTTI,
    items: [
      { id: 104, question: startingQuestion, image: chutti, options: generateOptions(CHUTTI, ornaments), correctAnswer: CHUTTI },
    ],
  },
  {
    id: 5,
    title: KAZHUTHU_NADA,
    items: [
      { id: 105, question: startingQuestion, image: kazhuthunada, options: generateOptions(KAZHUTHU_NADA, ornaments), correctAnswer: KAZHUTHU_NADA },
    ],
  },
  {
    id: 6,
    title: KAZHUTTARAM,
    items: [
      { id: 106, question: startingQuestion, image: kazhuttaram, options: generateOptions(KAZHUTTARAM, ornaments), correctAnswer: KAZHUTTARAM },
    ],
  },
  {
    id: 7,
    title: PARUTTIKKAIMANI,
    items: [
      { id: 107, question: startingQuestion, image: paruttikkaimani, options: generateOptions(PARUTTIKKAIMANI, ornaments), correctAnswer: PARUTTIKKAIMANI },
    ],
  },
  {
    id: 8,
    title: TOLPUTTU,
    items: [
      { id: 108, question: startingQuestion, image: tolputtu, options: generateOptions(TOLPUTTU, ornaments), correctAnswer: TOLPUTTU },
    ],
  },
  {
    id: 9,
    title: KURALARAM,
    items: [
      { id: 109, question: startingQuestion, image: kuralaram, options: generateOptions(KURALARAM, ornaments), correctAnswer: KURALARAM },
    ],
  },
  {
    id: 10,
    title: UTTARIYA,
    items: [
      { id: 110, question: startingQuestion, image: uttariya, options: generateOptions(UTTARIYA, ornaments), correctAnswer: UTTARIYA },
    ],
  },
  {
    id: 11,
    title: KASTAKATAKAM,
    items: [
      { id: 111, question: startingQuestion, image: kastakatakam, options: generateOptions(KASTAKATAKAM, ornaments), correctAnswer: KASTAKATAKAM },
    ],
  },
  {
    id: 12,
    title: KALASES,
    items: [
      { id: 112, question: startingQuestion, image: kalases, options: generateOptions(KALASES, ornaments), correctAnswer: KALASES },
    ],
  },
  {
    id: 13,
    title: PATTU_VAL,
    items: [
      { id: 113, question: startingQuestion, image: pattuval, options: generateOptions(PATTU_VAL, ornaments), correctAnswer: PATTU_VAL },
    ],
  },
  {
    id: 14,
    title: PATIARANNANAM,
    items: [
      { id: 114, question: startingQuestion, image: patiarannanam, options: generateOptions(PATIARANNANAM, ornaments), correctAnswer: PATIARANNANAM },
    ],
  },
  {
    id: 15,
    title: OTTANAKKU,
    items: [
      { id: 115, question: startingQuestion, image: ottanakku, options: generateOptions(OTTANAKKU, ornaments), correctAnswer: OTTANAKKU },
    ],
  },
  {
    id: 16,
    title: TANTAPPATIPPU,
    items: [
      { id: 116, question: startingQuestion, image: tantappatippu, options: generateOptions(TANTAPPATIPPU, ornaments), correctAnswer: TANTAPPATIPPU },
    ],
  },
  {
    id: 17,
    title: CHUTTITUNI,
    items: [
      { id: 117, question: startingQuestion, image: chuttituni, options: generateOptions(CHUTTITUNI, ornaments), correctAnswer: CHUTTITUNI },
    ],
  },
  {
    id: 18,
    title: KECCHAMANI,
    items: [
      { id: 118, question: startingQuestion, image: kecchamani, options: generateOptions(KECCHAMANI, ornaments), correctAnswer: KECCHAMANI},
    ]
  }
];

export default quizOrnament;