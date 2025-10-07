import { 
  uploadImgToCharRecBESingle,
  uploadImgToExpressionRecBESingle,
} from 'utils/invokeBackend';
import expressionToContent from 'components/ContentRender/RenderExpressionContent/expressions';

const useImageAnalysis = () => {
  const getExpressionInfo = (expression: string): string => {
    const expressionInfo = expressionToContent[expression as keyof typeof expressionToContent];
    return expressionInfo ? `${expressionInfo.Name}: ${expressionInfo.Description}` : '';
  };

  const processImageWithAI = async (imageFile: File): Promise<string> => {
    try {
      const [characterResult, expressionResult] = await Promise.allSettled([
        uploadImgToCharRecBESingle(imageFile),
        uploadImgToExpressionRecBESingle(imageFile)
      ]);

      let analysisResult = '';

      if (characterResult.status === 'fulfilled' && characterResult.value.prediction?.length > 0) {
        const topCharacter = characterResult.value.prediction[0];
        analysisResult += `Character: ${topCharacter.prediction}\n\n`;
      }

      if (expressionResult.status === 'fulfilled' && expressionResult.value.prediction?.length > 0) {
        const topExpression = expressionResult.value.prediction[0];
        analysisResult += `Expression: ${topExpression.prediction}\n\n`;
        
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