/**
 * Sanitizes and normalizes user input into a valid HTTP/HTTPS URL
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Extracts a readable domain/hostname for display or fallback
 */
export function extractDomain(url: string): string {
  try {
    const valid = normalizeUrl(url);
    const parsed = new URL(valid);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Returns a high-res favicon URL for a given target website
 */
export function getFaviconUrl(url: string): string {
  try {
    const domain = extractDomain(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  } catch {
    return '';
  }
}

/**
 * Generates an automatic title if the user left it blank
 */
export function suggestTitleFromUrl(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return 'Tautan Baru';
  const parts = domain.split('.');
  if (parts.length > 1) {
    const mainName = parts[0];
    return mainName.charAt(0).toUpperCase() + mainName.slice(1);
  }
  return domain;
}
