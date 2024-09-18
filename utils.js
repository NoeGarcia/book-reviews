import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname in ES modules
export const __dirname = dirname(fileURLToPath(import.meta.url));

export function formatReviewText(reviewText) {
    return reviewText.replace(/\n/g, '<br>');
}