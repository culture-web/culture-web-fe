import BACKEND_URI from '../configs/env.config';

const uploadImgToCharRecBE = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${BACKEND_URI}/kathakali/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image.');
  }

  return response.json();
};

export default uploadImgToCharRecBE;
