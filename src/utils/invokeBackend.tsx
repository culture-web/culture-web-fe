import { ChatbotResponse } from 'components/AIChat/types';
import BACKEND_URI from 'configs/env.config';
import { getCurrentUserToken } from 'configs/supabase.config';
import { PredictionMultiple, Prediction } from 'types/interface';

export interface BackendMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  created_at: string;
  title?: string;
  lastMessageAt?: string;
}

export const createNewSession = async (): Promise<ChatSession> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  try {
    const token = await getCurrentUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Failed to get auth token for session creation:', error);
  }

  const response = await fetch(`${BACKEND_URI}/chat/sessions`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || data;
};

export const getUserSessions = async (): Promise<ChatSession[]> => {
  const headers: Record<string, string> = {};
  
  try {
    const token = await getCurrentUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Failed to get auth token for sessions:', error);
    return [];
  }

  const response = await fetch(`${BACKEND_URI}/chat/sessions`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    console.warn('Failed to fetch sessions:', response.status);
    return [];
  }

  const data = await response.json();
  return data.data || data || [];
};

export const getSessionMessages = async (sessionId: string): Promise<BackendMessage[]> => {
  const headers: Record<string, string> = {};
  
  try {
    const token = await getCurrentUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Failed to get auth token for session messages:', error);
    throw new Error('Authentication required to fetch session messages');
  }

  const response = await fetch(`${BACKEND_URI}/chat/sessions/${sessionId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session messages: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  const messages = data.data || data.messages || data || [];
  return messages;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const headers: Record<string, string> = {};
  
  try {
    const token = await getCurrentUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    throw new Error('Authentication required to delete session');
  }

  const response = await fetch(`${BACKEND_URI}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.status} ${response.statusText}`);
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const headers: Record<string, string> = {};
  
  try {
    const token = await getCurrentUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    throw new Error('Authentication required to delete message');
  }

  const response = await fetch(`${BACKEND_URI}/chat/messages/${messageId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete message: ${response.status} ${response.statusText}`);
  }
};

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
  sessionId?: string,
  mudrasMode: boolean = false,
): Promise<ChatbotResponse> => {
  try {
    // Always use FormData to be consistent with backend multer middleware
    const formData = new FormData();
    
    // TODO: For mudras backward compatibility, to update to use the "message" field
    formData.append('query', query);

    formData.append('message', query);
    formData.append('role', 'user');
    
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (imageAnalysis) {
      formData.append('imageAnalysis', imageAnalysis);
    }

    try {
      const rawSettings = localStorage.getItem('globalChatSettings');
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings);
        if (typeof parsed?.systemPrompt === 'string' && parsed.systemPrompt.trim().length > 0) {
          formData.append('systemPrompt', parsed.systemPrompt);
        }
        if (Number.isFinite(Number(parsed?.similarityThreshold))) {
          formData.append('similarityThreshold', String(parsed.similarityThreshold));
        }
        if (Number.isFinite(Number(parsed?.vectorWeight))) {
          const vectorWeight = Math.max(0, Math.min(1, Number(parsed.vectorWeight)));
          formData.append('vectorWeight', String(vectorWeight));
          formData.append('fullTextWeight', String(Number((1 - vectorWeight).toFixed(2))));
        }
        if (Number.isFinite(Number(parsed?.topN))) {
          formData.append('topN', String(parsed.topN));
        }
        if (typeof parsed?.multiTurnOptimization === 'boolean') {
          formData.append('multiTurnOptimization', String(parsed.multiTurnOptimization));
        }
      }
    } catch (settingsError) {
      console.warn('Failed to apply global chat settings:', settingsError);
    }

    // Add Supabase JWT token if user is authenticated
    const headers: Record<string, string> = {};
    try {
      const token = await getCurrentUserToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token for chat:', error);
      // Continue without token for anonymous chat
    }

    // Use chat-mudras endpoint for Mudras RAG mode, otherwise use production chat
    const urlEndpoint = mudrasMode ? `${BACKEND_URI}/kathakali/chat-mudras` : `${BACKEND_URI}/chat/messages`;

    const response = await fetch(urlEndpoint, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get chat response: ${response.status} ${response.statusText}. Body: ${errorText}`);
    }

    const data = await response.json();

    // Parse multiple backend response shapes:
    // 1) data.data.response (wrapped)
    // 2) data.response (legacy wrapper)
    // 3) data (direct structured payload from /kathakali/chat-mudras)
    const directStructured = data
      && typeof data === 'object'
      && (data.shortAnswer !== undefined
        || data.reasoning !== undefined
        || Array.isArray(data.sections)
        || Array.isArray(data.tables));
    const chatbotResponse = data.data?.response || data.response || (directStructured ? data : null);

    if (chatbotResponse && chatbotResponse.shortAnswer !== undefined) {
      const result = {
        shortAnswer: chatbotResponse.shortAnswer || 'I apologize, but I couldn\'t generate a response at the moment.',
        reasoning: chatbotResponse.reasoning || null,
        sections: chatbotResponse.sections || [],
        tables: chatbotResponse.tables || [],
        metadata: chatbotResponse.metadata || {
          hasStructuredContent: false,
          responseLength: 0,
          processingTimestamp: new Date().toISOString(),
        }
      };
      return result;
    } 
      // Fallback - try direct data structure or legacy format
      const responseText = data.shortAnswer || data.response || 'I apologize, but I couldn\'t generate a response at the moment.';
      
      const fallbackResult = {
        shortAnswer: typeof responseText === 'string' ? responseText : responseText.shortAnswer || 'No response available',
        reasoning: null,
        sections: [],
        tables: [],
        metadata: {
          hasStructuredContent: false,
          responseLength: typeof responseText === 'string' ? responseText.length : 0,
          processingTimestamp: new Date().toISOString(),
        }
      };
      return fallbackResult;
    
  } catch {
    // Chat API Error - return error response in new format
    const errorResult = {
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
    return errorResult;
  }
};
