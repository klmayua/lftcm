import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML rendering
const purifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Use this when rendering user-generated HTML content
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, purifyConfig) as string;
}

/**
 * Sanitize plain text - removes all HTML tags
 * Use this for text-only content that shouldn't have any HTML
 */
export function sanitizeText(dirty: string | undefined | null): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] }) as string;
}

/**
 * Sanitize URL to prevent javascript: protocol attacks
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '';

  const sanitized = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] }) as string;

  // Block javascript: and data: protocols
  if (/^(javascript|data|vbscript):/i.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Escape special characters for use in HTML attributes
 */
export function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email) return '';

  // Remove any HTML tags
  const clean = DOMPurify.sanitize(email, { ALLOWED_TAGS: [] }) as string;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return '';
  }

  return clean.toLowerCase().trim();
}

/**
 * Sanitize file names to prevent directory traversal
 */
export function sanitizeFilename(filename: string | undefined | null): string {
  if (!filename) return '';

  // Remove path components and null bytes
  return filename
    .replace(/\\/g, '/')
    .replace(/\//g, '_')
    .replace(/\0/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}
