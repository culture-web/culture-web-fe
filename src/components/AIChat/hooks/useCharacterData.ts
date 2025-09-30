import { CharacterData, ExpressionData } from '../types';

export const useCharacterData = () => {
  const getCharacterInfo = (character: string): string => {
    const characterData: CharacterData = {
      'Pacha': 'Pacha characters represent noble, virtuous heroes like Rama, Krishna, or Arjuna. They have green face makeup and are typically the protagonists in Kathakali stories.',
      'Kathi': 'Kathi characters are anti-heroes or demonic figures with a knife-like mustache. They often play villainous roles but can also be complex characters with both good and evil traits.',
      'Minukku-Female': 'Minukku characters represent gentle, feminine roles including goddesses, noble women, and sages. They have lustrous, radiant makeup representing purity and divinity.',
      'Chuvanna-Thadi': 'Chuvanna Thadi (Red Beard) characters are extremely evil demons like Ravana or other rakshasa kings. Their red beards and fierce makeup represent their demonic nature.',
      'Vella-Thadi': 'Vella Thadi (White Beard) characters represent supernatural beings, monkeys like Hanuman, or elderly characters. The white beard signifies wisdom or otherworldly nature.',
      'Kari-Male': 'Kari characters represent forest dwellers, hunters, or demons. They often have black makeup and play supporting roles in the epic narratives.',
    };
    return characterData[character] || '';
  };

  const getExpressionInfo = (expression: string): string => {
    const expressionData: ExpressionData = {
      'Raudra': 'Raudra represents anger and fury. This expression is used to show rage, wrath, and destructive emotions, often seen in battle scenes or when characters face betrayal.',
      'Sringara': 'Sringara represents love and romance. This gentle expression shows affection, beauty, and romantic feelings between characters.',
      'Bibatsa': 'Bibatsa represents disgust and revulsion. This expression shows contempt, aversion, or moral outrage at unacceptable behavior.',
      'Karuna': 'Karuna represents compassion and pity. This sorrowful expression conveys empathy, sadness, and emotional pain.',
      'Shanta': 'Shanta represents peace and tranquility. This serene expression shows calmness, wisdom, and spiritual contentment.',
      'Adbhuta': 'Adbhuta represents wonder and amazement. This expression shows surprise, awe, and marvel at extraordinary events.',
      'Vira': 'Vira represents heroism and valor. This bold expression demonstrates courage, bravery, and noble determination.',
      'Bhayanaka': 'Bhayanaka represents fear and terror. This expression shows fright, horror, and anxiety in threatening situations.',
      'Hasya': 'Hasya represents laughter and humor. This joyful expression demonstrates happiness, mirth, and comic relief.',
    };
    return expressionData[expression] || '';
  };

  return { getCharacterInfo, getExpressionInfo };
};