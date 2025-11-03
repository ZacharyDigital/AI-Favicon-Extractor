import axios from 'axios';
import type { FaviconResponse } from '@/types/favicon';

// Backend API base URL - configurable via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Deep fetch all favicons from a URL
 */
export async function fetchFavicons(url: string): Promise<FaviconResponse> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get<FaviconResponse>(
      `${API_BASE_URL}/api/deep/${encodedUrl}`,
      {
        timeout: 30000, // 30 second timeout
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        `Failed to fetch favicons: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Get the best favicon URL for a website
 */
export async function getBestFavicon(url: string): Promise<string> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get<string>(
      `${API_BASE_URL}/api/best/${encodedUrl}`,
      {
        timeout: 30000,
        responseType: 'text',
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get best favicon: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Download favicon as image blob
 */
export async function downloadFaviconImage(url: string): Promise<Blob> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get(
      `${API_BASE_URL}/api/image/${encodedUrl}`,
      {
        timeout: 30000,
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to download favicon: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Download a specific icon by its direct URL
 */
export async function downloadIconByUrl(iconUrl: string): Promise<Blob> {
  try {
    const response = await axios.get(iconUrl, {
      timeout: 30000,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to download icon: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Verify if an icon URL is valid
 */
export async function verifyIconUrl(url: string): Promise<boolean> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get<{ url: string; valid: boolean }>(
      `${API_BASE_URL}/api/verify/${encodedUrl}`,
      {
        timeout: 10000,
      }
    );
    return response.data.valid;
  } catch (error) {
    return false;
  }
}

/**
 * Check API health status
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}
