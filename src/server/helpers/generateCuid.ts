/**
 * Generates a collision-resistant unique identifier (CUID)
 * Format: c[timestamp][counter][random][pid][hostnameHash]
 *
 * Components:
 * - timestamp: Current time in milliseconds, base36 encoded (sortable)
 * - counter: Random 4-digit base36 number to reduce collisions
 * - random: 8 characters of random base36 string for entropy
 * - pid: Process ID in base36 (Node.js only), padded to 4 chars, or '0000' fallback
 * - hostnameHash: Sum of char codes of hostname, base36 encoded, padded to 4 chars
 *
 * @returns {string} A unique identifier string prefixed with 'c'
 */

export function generateCuid(): string {
  // Timestamp part for chronological ordering, base36 for compactness
  const timestamp = Date.now().toString(36);

  // Random 4-digit base36 number to reduce collision chances
  const counter = Math.floor(Math.random() * 10000)
    .toString(36)
    .padStart(4, "0");

  // Random base36 string (8 chars) to add entropy
  const random = Math.random().toString(36).substring(2, 10);

  // Process ID in Node.js, base36 encoded and padded to 4 chars
  // Fallback to '0000' if running outside Node.js or no PID available
  const pid =
    typeof process !== "undefined" && process.pid
      ? (process.pid % 10000).toString(36).padStart(4, "0")
      : "0000";

  // Hostname: in browser use window.location.hostname; in Node.js fallback to 'node'
  const hostname = typeof window !== "undefined" ? window.location.hostname : "node";

  // Create a simple hash from hostname by summing char codes, then base36 encode
  // Padded to 4 chars for consistent length
  const hostnameHash = Array.from(hostname)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(36)
    .padStart(4, "0");

  // Concatenate all parts with prefix 'c' to form the final CUID string
  return `c${timestamp}${counter}${random}${pid}${hostnameHash}`;
}
