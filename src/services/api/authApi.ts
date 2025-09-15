import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_API_CLIENT_SECRET || '';
const USERNAME = import.meta.env.VITE_API_USERNAME || '';
const PASSWORD = import.meta.env.VITE_API_PASSWORD || '';

/**
 * Generate an access token using credentials from .env
 */
export async function generateTokenFromEnv(): Promise<TokenResponse> {
  const response = await axios.post('https://cutoffpoint.com.gh/oauth/token', {
    grant_type: 'password',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: USERNAME,
    password: PASSWORD,
    scope: '',
  });
  return response.data;
}


export interface TokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export async function login(phoneNumber: string): Promise<TokenResponse> {
  const response = await axios.post('https://cutoffpoint.com.gh/oauth/token', {
    grant_type: 'password',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: phoneNumber,
    password: '', // Adjust as needed for your backend
    scope: '',
  });
  return response.data;
}

export async function refreshToken(refresh_token: string): Promise<TokenResponse> {
  const response = await axios.post('https://cutoffpoint.com.gh/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  return response.data;
}
