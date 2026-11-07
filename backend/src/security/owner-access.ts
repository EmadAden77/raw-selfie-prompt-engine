import { createHash, timingSafeEqual } from 'node:crypto';

// Fail closed when the dedicated owner secret has not been configured.
// Never accept NVIDIA_API_KEY as a login credential or send either secret
// to the frontend bundle. Use a 32+ character random owner token.
export function authorizeNvidiaOwner(candidate: unknown): boolean {
  const expected = process.env.NVIDIA_OWNER_TOKEN;
  if (typeof expected !== 'string' ||
      expected.length < 32 || expected.length > 256 ||
      /\s/.test(expected) || expected.startsWith('nvapi-')) return false;
  if (typeof candidate !== 'string' ||
      candidate.length < 32 || candidate.length > 256) return false;
  const digest = (text: string) => createHash('sha256').update(text, 'utf8').digest();
  // Hashes have the same fixed length; timingSafeEqual avoids byte-by-byte
  // timing leaks about the secret.
  return timingSafeEqual(digest(expected), digest(candidate));
}
