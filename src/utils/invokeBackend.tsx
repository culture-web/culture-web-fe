import { ChatbotResponse } from 'components/AIChat/types';
import BACKEND_URI from 'configs/env.config';
import { PredictionMultiple, Prediction } from 'types/interface';

const getImageDimensions = (
  imageFile: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(imageFile);
  });

const uploadCharacterData = async (
  imageFile: File,
  predicted: string,
  actual: string,
  type: string,
): Promise<void> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('predicted', predicted);
  formData.append('actual', actual);
  formData.append('type', type);

  const response = await fetch(
    `${BACKEND_URI}/kathakali/upload-training-data`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to upload character data.');
  }

  // Return empty
  
};

const uploadImage = async (
  imageFile: File,
  endpoint: string,
  isMultipleRecognition: boolean,
): Promise<PredictionMultiple> => {
  const formData = new FormData();
  const { width, height } = await getImageDimensions(imageFile);
  formData.append('image', imageFile);
  formData.append('isMultipleRecognition', String(isMultipleRecognition)); // Append boolean as a string

  const response = await fetch(`${BACKEND_URI}/kathakali/${endpoint}`, {
    method: 'POST',
    body: formData,
  })
    .then((output) => output.json())
    .catch(() => {
      throw new Error('Failed to upload image.');
    });

  const toReturn: Prediction[] = response.map(
    (value: { prediction: string; location: number[]; accuracy: number[] }) =>
      !isMultipleRecognition
        ? {
            prediction: value.prediction,
            location: {
              x: 0,
              y: 0,
              width,
              height,
              probability: value.accuracy,
            },
          }
        : {
            prediction: value.prediction,
            location: {
              x: value.location[0],
              y: value.location[1],
              width: value.location[2] - value.location[0],
              height: value.location[3] - value.location[1],
              probability: value.accuracy,
            },
          },
  );
  return { prediction: toReturn };
};

export const uploadImgToExpressionRecBESingle = async (
  imageFile: File,
): Promise<PredictionMultiple> =>
  uploadImage(imageFile, 'classify-expression', false);

export const uploadImgToExpressionRecBEMultiple = async (
  imageFile: File,
): Promise<PredictionMultiple> =>
  uploadImage(imageFile, 'classify-expression', true);

export const uploadImgToCharRecBESingle = async (
  imageFile: File,
): Promise<PredictionMultiple> => uploadImage(imageFile, '', false);

export const uploadImgToCharRecBEMultiple = async (
  imageFile: File,
): Promise<PredictionMultiple> => uploadImage(imageFile, '', true);

export const uploadCharacterDataToBE = async (
  imageFile: File,
  predicted: string,
  actual: string,
  type: string,
): Promise<void> => uploadCharacterData(imageFile, predicted, actual, type);

export const sendChatQuery = async (
  query: string,
  imageFile?: File,
  imageAnalysis?: string,
  mudrasMode: boolean = false,
): Promise<ChatbotResponse> => {
  try {
    // Always use FormData to be consistent with backend multer middleware
    const formData = new FormData();
    formData.append('query', query);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (imageAnalysis) {
      formData.append('imageAnalysis', imageAnalysis);
    }

    // Use chat-mudras endpoint for Mudras RAG mode, otherwise use production chat
    const endpoint = mudrasMode ? 'chat-mudras' : 'chat';

    const response = await fetch(`${BACKEND_URI}/kathakali/${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to get chat response: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response format
    if (data.shortAnswer !== undefined) {
      // New structured response format
      return {
        shortAnswer: data.shortAnswer || 'I apologize, but I couldn\'t generate a response at the moment.',
        reasoning: data.reasoning || null,
        sections: data.sections || [],
        tables: data.tables || [],
        metadata: data.metadata || {
          hasStructuredContent: false,
          responseLength: 0,
          processingTimestamp: new Date().toISOString(),
        }
      };
    } 
      // Legacy response format - convert to new format
      const responseText = data.response || 'I apologize, but I couldn\'t generate a response at the moment.';
      return {
        shortAnswer: responseText,
        reasoning: null,
        sections: [],
        tables: [],
        metadata: {
          hasStructuredContent: false,
          responseLength: responseText.length,
          processingTimestamp: new Date().toISOString(),
        }
      };
    
  } catch {
    // Chat API Error - return error response in new format
    return {
      shortAnswer: 'Failed to communicate with the AI assistant',
      reasoning: null,
      sections: [],
      tables: [],
      metadata: {
        hasStructuredContent: false,
        responseLength: 0,
        processingTimestamp: new Date().toISOString(),
      }
    };
  }
};
