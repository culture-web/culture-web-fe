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

/**
 * Randomly select two wrong answers (ensuring they don't match the correct answer),
 * add the correct answer and then shuffle the options.
 */
function generateOptions(correctAnswer: string): string[] {
  // Get all expressions except the correct one.
  const otherOptions = expressions.filter(expr => expr !== correctAnswer);

  // Shuffle the otherOptions array (Fisher–Yates algorithm).
  for (let i = otherOptions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherOptions[i], otherOptions[j]] = [otherOptions[j], otherOptions[i]];
  }
  
  // Take the first two as wrong answers.
  const chosenWrong = otherOptions.slice(0, 2);
  
  // Create the options array including the correct answer.
  const options = [...chosenWrong, correctAnswer];
  
  // Shuffle the final options array.
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

const quizExpression: QuizCategory[] = [
  {
    id: 1,
    title: ADBHUTA,
    items: [
      { id: 101, question: startingQuestion, image: Adbhuta1, options: generateOptions(ADBHUTA), correctAnswer: ADBHUTA },
      { id: 102, question: startingQuestion, image: Adbhuta2, options: generateOptions(ADBHUTA), correctAnswer: ADBHUTA },
      { id: 103, question: startingQuestion, image: Adbhuta3, options: generateOptions(ADBHUTA), correctAnswer: ADBHUTA },
    ],
  },
  {
    id: 2,
    title: BHAYANAKA,
    items: [
      { id: 104, question: startingQuestion, image: Bhayanaka1, options: generateOptions(BHAYANAKA), correctAnswer: BHAYANAKA },
      { id: 105, question: startingQuestion, image: Bhayanaka2, options: generateOptions(BHAYANAKA), correctAnswer: BHAYANAKA },
      { id: 106, question: startingQuestion, image: Bhayanaka3, options: generateOptions(BHAYANAKA), correctAnswer: BHAYANAKA },
    ],
  },
  {
    id: 3,
    title: BIBATSA,
    items: [
      { id: 107, question: startingQuestion, image: Bibatsa1, options: generateOptions(BIBATSA), correctAnswer: BIBATSA },
      { id: 108, question: startingQuestion, image: Bibatsa2, options: generateOptions(BIBATSA), correctAnswer: BIBATSA },
      { id: 109, question: startingQuestion, image: Bibatsa3, options: generateOptions(BIBATSA), correctAnswer: BIBATSA },
    ],
  },
  {
    id: 4,
    title: HASYA,
    items: [
      { id: 110, question: startingQuestion, image: Hasya1, options: generateOptions(HASYA), correctAnswer: HASYA },
      { id: 111, question: startingQuestion, image: Hasya2, options: generateOptions(HASYA), correctAnswer: HASYA },
      { id: 112, question: startingQuestion, image: Hasya3, options: generateOptions(HASYA), correctAnswer: HASYA },
    ],
  },
  {
    id: 5,
    title: KARUNA,
    items: [
      { id: 113, question: startingQuestion, image: Karuna1, options: generateOptions(KARUNA), correctAnswer: KARUNA },
      { id: 114, question: startingQuestion, image: Karuna2, options: generateOptions(KARUNA), correctAnswer: KARUNA },
      { id: 115, question: startingQuestion, image: Karuna3, options: generateOptions(KARUNA), correctAnswer: KARUNA },
    ],
  },
  {
    id: 6,
    title: RAUDRA,
    items: [
      { id: 116, question: startingQuestion, image: Raudra1, options: generateOptions(RAUDRA), correctAnswer: RAUDRA },
      { id: 117, question: startingQuestion, image: Raudra2, options: generateOptions(RAUDRA), correctAnswer: RAUDRA },
      { id: 118, question: startingQuestion, image: Raudra3, options: generateOptions(RAUDRA), correctAnswer: RAUDRA },
    ],
  },
  {
    id: 7,
    title: SHANTA,
    items: [
      { id: 119, question: startingQuestion, image: Shanta1, options: generateOptions(SHANTA), correctAnswer: SHANTA },
      { id: 120, question: startingQuestion, image: Shanta2, options: generateOptions(SHANTA), correctAnswer: SHANTA },
      { id: 121, question: startingQuestion, image: Shanta3, options: generateOptions(SHANTA), correctAnswer: SHANTA },
    ],
  },
  {
    id: 8,
    title: SRINGARA,
    items: [
      { id: 122, question: startingQuestion, image: Sringara1, options: generateOptions(SRINGARA), correctAnswer: SRINGARA },
      { id: 123, question: startingQuestion, image: Sringara2, options: generateOptions(SRINGARA), correctAnswer: SRINGARA },
      { id: 124, question: startingQuestion, image: Sringara3, options: generateOptions(SRINGARA), correctAnswer: SRINGARA },
    ],
  },
  {
    id: 9,
    title: VIRA,
    items: [
      { id: 125, question: startingQuestion, image: Vira1, options: generateOptions(VIRA), correctAnswer: VIRA },
      { id: 126, question: startingQuestion, image: Vira2, options: generateOptions(VIRA), correctAnswer: VIRA },
      { id: 127, question: startingQuestion, image: Vira3, options: generateOptions(VIRA), correctAnswer: VIRA },
    ],
  },
];

export default quizExpression;
