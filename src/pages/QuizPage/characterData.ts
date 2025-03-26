import RedBeard1 from '../../assets/images/kathakali-characters/chuvanna-thadi.png';
import RedBeard2 from '../../assets/images/kathakali-characters/chuvanna-thadi-2.png';
import RedBeard3 from '../../assets/images/kathakali-characters/chuvanna-thadi-3.jpg';

import KariMale1 from '../../assets/images/kathakali-characters/kari-male.png';
import KariMale2 from '../../assets/images/kathakali-characters/kari-male-2.png';
import KariMale3 from '../../assets/images/kathakali-characters/kari-male-3.png';

import Pacha1 from '../../assets/images/kathakali-characters/pacha.png';
import Pacha2 from '../../assets/images/kathakali-characters/pacha-2.png';
import Pacha3 from '../../assets/images/kathakali-characters/pacha-3.jpg';

import Kathi1 from '../../assets/images/kathakali-characters/kathi.png';
import Kathi2 from '../../assets/images/kathakali-characters/kathi-2.png';
import Kathi3 from '../../assets/images/kathakali-characters/kathi-3.png';

import WhiteBeard1 from '../../assets/images/kathakali-characters/vella-thadi.png';
import WhiteBeard2 from '../../assets/images/kathakali-characters/vella-thadi-2.jpg';
import WhiteBeard3 from '../../assets/images/kathakali-characters/vella-thadi-3.jpg';

import MinukkuFemale1 from '../../assets/images/kathakali-characters/minukku-female.png';
import MinukkuFemale2 from '../../assets/images/kathakali-characters/minukku-female-2.jpg';
import MinukkuFemale3 from '../../assets/images/kathakali-characters/minukku-female-3.png';

import { QuizCategory } from "./quizTypes";

const startingQuestion = 'Which character is this?';

// Use your defined variables for each character.
const CHUVANNA_THADI = 'Chuvanna-Thadi';
const KARI_MALE = 'Kari-Male';
const PACHA = 'Pacha';
const KATHI = 'Kathi';
const VELLA_THADI = 'Vella-Thadi';
const MINUKKU_FEMALE = 'Minukku-Female';

// Array of all characters.
const characters = [
  CHUVANNA_THADI,
  KARI_MALE,
  PACHA,
  KATHI,
  VELLA_THADI,
  MINUKKU_FEMALE,
];

/**
 * Randomly select two wrong answers (ensuring they don't match the correct answer),
 * add the correct answer and then shuffle the options.
 */
function generateOptions(correctAnswer: string): string[] {
  // Get all characters except the correct one.
  const otherOptions = characters.filter(character => character !== correctAnswer);
  
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

const quizCharacter: QuizCategory[] = [
  {
    id: 1,
    title: CHUVANNA_THADI,
    items: [
      { id: 101, question: startingQuestion, image: RedBeard1, options: generateOptions(CHUVANNA_THADI), correctAnswer: CHUVANNA_THADI },
      { id: 102, question: startingQuestion, image: RedBeard2, options: generateOptions(CHUVANNA_THADI), correctAnswer: CHUVANNA_THADI },
      { id: 103, question: startingQuestion, image: RedBeard3, options: generateOptions(CHUVANNA_THADI), correctAnswer: CHUVANNA_THADI },
    ],
  },
  {
    id: 2,
    title: KARI_MALE,
    items: [
      { id: 104, question: startingQuestion, image: KariMale1, options: generateOptions(KARI_MALE), correctAnswer: KARI_MALE },
      { id: 105, question: startingQuestion, image: KariMale2, options: generateOptions(KARI_MALE), correctAnswer: KARI_MALE },
      { id: 106, question: startingQuestion, image: KariMale3, options: generateOptions(KARI_MALE), correctAnswer: KARI_MALE },
    ],
  },
  {
    id: 3,
    title: PACHA,
    items: [
      { id: 107, question: startingQuestion, image: Pacha1, options: generateOptions(PACHA), correctAnswer: PACHA },
      { id: 108, question: startingQuestion, image: Pacha2, options: generateOptions(PACHA), correctAnswer: PACHA },
      { id: 109, question: startingQuestion, image: Pacha3, options: generateOptions(PACHA), correctAnswer: PACHA },
    ],
  },
  {
    id: 4,
    title: KATHI,
    items: [
      { id: 110, question: startingQuestion, image: Kathi1, options: generateOptions(KATHI), correctAnswer: KATHI },
      { id: 111, question: startingQuestion, image: Kathi2, options: generateOptions(KATHI), correctAnswer: KATHI },
      { id: 112, question: startingQuestion, image: Kathi3, options: generateOptions(KATHI), correctAnswer: KATHI },
    ],
  },
  {
    id: 5,
    title: VELLA_THADI,
    items: [
      { id: 113, question: startingQuestion, image: WhiteBeard1, options: generateOptions(VELLA_THADI), correctAnswer: VELLA_THADI },
      { id: 114, question: startingQuestion, image: WhiteBeard2, options: generateOptions(VELLA_THADI), correctAnswer: VELLA_THADI },
      { id: 115, question: startingQuestion, image: WhiteBeard3, options: generateOptions(VELLA_THADI), correctAnswer: VELLA_THADI },
    ],
  },
  {
    id: 6,
    title: MINUKKU_FEMALE,
    items: [
      { id: 116, question: startingQuestion, image: MinukkuFemale1, options: generateOptions(MINUKKU_FEMALE), correctAnswer: MINUKKU_FEMALE },
      { id: 117, question: startingQuestion, image: MinukkuFemale2, options: generateOptions(MINUKKU_FEMALE), correctAnswer: MINUKKU_FEMALE },
      { id: 118, question: startingQuestion, image: MinukkuFemale3, options: generateOptions(MINUKKU_FEMALE), correctAnswer: MINUKKU_FEMALE },
    ],
  },
];

export default quizCharacter;
