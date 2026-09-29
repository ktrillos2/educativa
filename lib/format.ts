export function formatPrice(price: any): string {
    if (price === null || price === undefined || price === '') return "$350.000 COP";
    const str = String(price).trim();
    if (str.startsWith('$')) return str;
    return `$${str}`;
}

/**
 * Normalizes a course title for consistent visual rendering.
 * If the string is ALL_CAPS it converts to Title Case.
 * Mixed-case titles are returned as-is.
 */
export function toTitleCase(str: string): string {
    if (!str) return str;
    // If more than 60% of the alphabetic characters are uppercase → normalize
    const letters = str.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, "");
    if (letters.length === 0) return str;
    const upperCount = (str.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length;
    if (upperCount / letters.length > 0.6) {
        // Convert to Title Case
        const SMALL_WORDS = new Set(["de", "del", "la", "el", "los", "las", "en", "a", "y", "o", "con", "por", "para", "un", "una"]);
        return str
            .toLowerCase()
            .split(" ")
            .map((word, i) =>
                i === 0 || !SMALL_WORDS.has(word)
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
            )
            .join(" ");
    }
    return str;
}
