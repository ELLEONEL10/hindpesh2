/**
 * Utility functions for Google Drive links
 */

/**
 * Extracts file ID from various Google Drive URL formats
 */
const extractFileId = (link: string): string => {
  if (!link) return '';

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
  const match1 = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) {
    return match1[1];
  }
  
  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  const match2 = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) {
    return match2[1];
  }
  
  // Pattern 3: Just the file ID itself
  return link.trim();
};

/**
 * Converts a Google Drive shareable link to a playable audio stream URL
 * For audio files, we need to use a format that works with HTML5 audio elements
 */
export const convertGoogleDriveLink = (link: string, type: 'audio' | 'pdf' = 'pdf'): string => {
  if (!link) return '';

  const fileId = extractFileId(link);
  if (!fileId) return link; // Return original if we can't extract ID

  // For audio files, use Google Drive's streaming URL
  // This format works better for HTML5 audio players
  if (type === 'audio') {
    // Method 1: Direct download link (works if file is public)
    // This will stream the audio file
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // For PDF files, use Google Drive viewer
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Gets a direct streaming URL for Google Drive audio files
 * Uses multiple fallback methods to ensure audio plays
 * 
 * Note: Google Drive has CORS restrictions. For audio to play directly:
 * 1. File must be set to "Anyone with the link can view"
 * 2. We use a CORS proxy for better compatibility
 */
export const getGoogleDriveAudioStreamUrl = (link: string): string => {
  const fileId = extractFileId(link);
  if (!fileId) return link;

  // Method 1: Direct download link (works if CORS allows)
  const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  // Method 2: Use CORS proxy for better compatibility
  // This bypasses CORS restrictions for audio streaming
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;
  
  // Return proxy URL for better compatibility
  // If you host your own CORS proxy, replace corsproxy.io with your proxy URL
  return proxyUrl;
  
  // Alternative: Return direct URL if you've configured CORS on your server
  // return directUrl;
};

/**
 * Gets a direct download link for Google Drive file
 */
export const getGoogleDriveDownloadLink = (link: string): string => {
  if (!link) return '';

  let fileId = '';
  const match1 = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) {
    fileId = match1[1];
  } else {
    const match2 = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
      fileId = match2[1];
    } else {
      fileId = link.trim();
    }
  }

  if (!fileId) return link;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

