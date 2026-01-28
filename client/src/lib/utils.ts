import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert Google Drive share link to direct image URL
 * Input: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';

  // Check if it's already a direct link
  if (url.includes('drive.google.com/uc?')) {
    return url;
  }

  // Extract file ID from share link
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  // Return original if not a Google Drive link
  return url;
}

/**
 * Convert array of Google Drive URLs
 */
export function convertGoogleDriveUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) return [];
  return urls.map(convertGoogleDriveUrl);
}
