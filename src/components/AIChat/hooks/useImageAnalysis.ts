import { 
  uploadImgToCharRecBESingle,
  uploadImgToExpressionRecBESingle,
} from 'utils/invokeBackend';
import useCharacterData from './useCharacterData';

const useImageAnalysis = () => {
  const { getCharacterInfo, getExpressionInfo } = useCharacterData();

  const processImageWithAI = async (imageFile: File): Promise<string> => {
    try {
      // Try both character and expression recognition
      const [characterResult, expressionResult] = await Promise.allSettled([
        uploadImgToCharRecBESingle(imageFile),
        uploadImgToExpressionRecBESingle(imageFile)
      ]);

      let analysisResult = '';
      
      if (characterResult.status === 'fulfilled' && characterResult.value.prediction?.length > 0) {
        const topCharacter = characterResult.value.prediction[0];
        const confidence = topCharacter.location.probability;
        analysisResult += `**Character Analysis**: I detect this as a **${topCharacter.prediction}** character with ${(confidence * 100).toFixed(1)}% confidence.\n\n`;
        
        // Add character information based on the detected character
        const characterInfo = getCharacterInfo(topCharacter.prediction);
        if (characterInfo) {
          analysisResult += `${characterInfo}\n\n`;
        }
      }

      if (expressionResult.status === 'fulfilled' && expressionResult.value.prediction?.length > 0) {
        const topExpression = expressionResult.value.prediction[0];
        const confidence = topExpression.location.probability;
        analysisResult += `**Expression Analysis**: The expression appears to be **${topExpression.prediction}** with ${(confidence * 100).toFixed(1)}% confidence.\n\n`;
        
        // Add expression information
        const expressionInfo = getExpressionInfo(topExpression.prediction);
        if (expressionInfo) {
          analysisResult += `${expressionInfo}\n\n`;
        }
      }

      if (!analysisResult) {
        analysisResult = 'I was unable to clearly identify the character or expression in this image. However, I can still help answer questions about Kathakali!';
      }

      return analysisResult;
    } catch (error) {
      console.error('Error processing image:', error);
      return 'I encountered an error while analyzing the image, but I can still help answer your questions about Kathakali!';
    }
  };

  return { processImageWithAI };
};

export default useImageAnalysis;