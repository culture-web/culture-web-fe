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
