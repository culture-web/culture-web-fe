import Adbhuta1 from '../../assets/images/kathakali-expressions/adbhuta.jpg';
import Adbhuta2 from '../../assets/images/kathakali-expressions/adbhuta-2.jpg';
import Adbhuta3 from '../../assets/images/kathakali-expressions/adbhuta-3.jpg';

import Bhayanaka1 from '../../assets/images/kathakali-expressions/bhayanaka.jpg';
import Bhayanaka2 from '../../assets/images/kathakali-expressions/bhayanaka-2.jpg';
import Bhayanaka3 from '../../assets/images/kathakali-expressions/bhayanaka-3.jpg';

import Bibatsa1 from '../../assets/images/kathakali-expressions/bibatsa.jpg';
import Bibatsa2 from '../../assets/images/kathakali-expressions/bibatsa-2.jpg';
import Bibatsa3 from '../../assets/images/kathakali-expressions/bibatsa-3.jpg';

import Hasya1 from '../../assets/images/kathakali-expressions/hasya.jpg';
import Hasya2 from '../../assets/images/kathakali-expressions/hasya-2.jpg';
import Hasya3 from '../../assets/images/kathakali-expressions/hasya-3.jpg';

import Karuna1 from '../../assets/images/kathakali-expressions/karuna.jpg';
import Karuna2 from '../../assets/images/kathakali-expressions/karuna-2.jpg';
import Karuna3 from '../../assets/images/kathakali-expressions/karuna-3.jpg';

import Raudra1 from '../../assets/images/kathakali-expressions/raudra.jpg';
import Raudra2 from '../../assets/images/kathakali-expressions/raudra-2.jpg';
import Raudra3 from '../../assets/images/kathakali-expressions/raudra-3.jpg';

import Shanta1 from '../../assets/images/kathakali-expressions/shanta.jpg';
import Shanta2 from '../../assets/images/kathakali-expressions/shanta-2.jpg';
import Shanta3 from '../../assets/images/kathakali-expressions/shanta-3.jpg';

import Sringara1 from '../../assets/images/kathakali-expressions/sringara.jpg';
import Sringara2 from '../../assets/images/kathakali-expressions/sringara-2.jpg';
import Sringara3 from '../../assets/images/kathakali-expressions/sringara-3.jpg';

import Vira1 from '../../assets/images/kathakali-expressions/vira.jpg';
import Vira2 from '../../assets/images/kathakali-expressions/vira-2.jpg';
import Vira3 from '../../assets/images/kathakali-expressions/vira-3.jpg';

import { QuizCategory } from "./quizTypes";

import generateOptions from './helperFunctions';

const startingQuestion = 'Which expression is this?';

// Define your expression constants.
const ADBHUTA = 'Adbhuta';
const BHAYANAKA = 'Bhayanaka';
const BIBATSA = 'Bibatsa';
const HASYA = 'Hasya';
const KARUNA = 'Karuna';
const RAUDRA = 'Raudra';
const SHANTA = 'Shanta';
const SRINGARA = 'Sringara';
const VIRA = 'Vira';

// Array of all expressions.
const expressions = [
  ADBHUTA,
  BHAYANAKA,
  BIBATSA,
  HASYA,
  KARUNA,
  RAUDRA,
  SHANTA,
  SRINGARA,
  VIRA,
];

const quizExpression: QuizCategory[] = [
  {
    id: 1,
    title: ADBHUTA,
    items: [
      { id: 101, question: startingQuestion, image: Adbhuta1, options: generateOptions(ADBHUTA, expressions), correctAnswer: ADBHUTA },
      { id: 102, question: startingQuestion, image: Adbhuta2, options: generateOptions(ADBHUTA, expressions), correctAnswer: ADBHUTA },
      { id: 103, question: startingQuestion, image: Adbhuta3, options: generateOptions(ADBHUTA, expressions), correctAnswer: ADBHUTA },
    ],
  },
  {
    id: 2,
    title: BHAYANAKA,
    items: [
      { id: 104, question: startingQuestion, image: Bhayanaka1, options: generateOptions(BHAYANAKA, expressions), correctAnswer: BHAYANAKA },
      { id: 105, question: startingQuestion, image: Bhayanaka2, options: generateOptions(BHAYANAKA, expressions), correctAnswer: BHAYANAKA },
      { id: 106, question: startingQuestion, image: Bhayanaka3, options: generateOptions(BHAYANAKA, expressions), correctAnswer: BHAYANAKA },
    ],
  },
  {
    id: 3,
    title: BIBATSA,
    items: [
      { id: 107, question: startingQuestion, image: Bibatsa1, options: generateOptions(BIBATSA, expressions), correctAnswer: BIBATSA },
      { id: 108, question: startingQuestion, image: Bibatsa2, options: generateOptions(BIBATSA, expressions), correctAnswer: BIBATSA },
      { id: 109, question: startingQuestion, image: Bibatsa3, options: generateOptions(BIBATSA, expressions), correctAnswer: BIBATSA },
    ],
  },
  {
    id: 4,
    title: HASYA,
    items: [
      { id: 110, question: startingQuestion, image: Hasya1, options: generateOptions(HASYA, expressions), correctAnswer: HASYA },
      { id: 111, question: startingQuestion, image: Hasya2, options: generateOptions(HASYA, expressions), correctAnswer: HASYA },
      { id: 112, question: startingQuestion, image: Hasya3, options: generateOptions(HASYA, expressions), correctAnswer: HASYA },
    ],
  },
  {
    id: 5,
    title: KARUNA,
    items: [
      { id: 113, question: startingQuestion, image: Karuna1, options: generateOptions(KARUNA, expressions), correctAnswer: KARUNA },
      { id: 114, question: startingQuestion, image: Karuna2, options: generateOptions(KARUNA, expressions), correctAnswer: KARUNA },
      { id: 115, question: startingQuestion, image: Karuna3, options: generateOptions(KARUNA, expressions), correctAnswer: KARUNA },
    ],
  },
  {
    id: 6,
    title: RAUDRA,
    items: [
      { id: 116, question: startingQuestion, image: Raudra1, options: generateOptions(RAUDRA, expressions), correctAnswer: RAUDRA },
      { id: 117, question: startingQuestion, image: Raudra2, options: generateOptions(RAUDRA, expressions), correctAnswer: RAUDRA },
      { id: 118, question: startingQuestion, image: Raudra3, options: generateOptions(RAUDRA, expressions), correctAnswer: RAUDRA },
    ],
  },
  {
    id: 7,
    title: SHANTA,
    items: [
      { id: 119, question: startingQuestion, image: Shanta1, options: generateOptions(SHANTA, expressions), correctAnswer: SHANTA },
      { id: 120, question: startingQuestion, image: Shanta2, options: generateOptions(SHANTA, expressions), correctAnswer: SHANTA },
      { id: 121, question: startingQuestion, image: Shanta3, options: generateOptions(SHANTA, expressions), correctAnswer: SHANTA },
    ],
  },
  {
    id: 8,
    title: SRINGARA,
    items: [
      { id: 122, question: startingQuestion, image: Sringara1, options: generateOptions(SRINGARA, expressions), correctAnswer: SRINGARA },
      { id: 123, question: startingQuestion, image: Sringara2, options: generateOptions(SRINGARA, expressions), correctAnswer: SRINGARA },
      { id: 124, question: startingQuestion, image: Sringara3, options: generateOptions(SRINGARA, expressions), correctAnswer: SRINGARA },
    ],
  },
  {
    id: 9,
    title: VIRA,
    items: [
      { id: 125, question: startingQuestion, image: Vira1, options: generateOptions(VIRA, expressions), correctAnswer: VIRA },
      { id: 126, question: startingQuestion, image: Vira2, options: generateOptions(VIRA, expressions), correctAnswer: VIRA },
      { id: 127, question: startingQuestion, image: Vira3, options: generateOptions(VIRA, expressions), correctAnswer: VIRA },
    ],
  },
];

export default quizExpression;
