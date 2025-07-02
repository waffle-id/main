import { randomUUID } from "crypto";

type NonceRecord = {
  nonce: string;
  createdAt: number; // timestamp
};

const nonces: Map<string, NonceRecord> = new Map();

const NONCE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export function generateNonce(address: string): string {
  const nonce = randomUUID();
  nonces.set(address.toLowerCase(), {
    nonce,
    createdAt: Date.now(),
  });
  return nonce;
}

export function getNonce(address: string): string | null {
  const record = nonces.get(address.toLowerCase());
  if (!record) return null;

  const now = Date.now();
  if (now - record.createdAt > NONCE_EXPIRY_MS) {
    nonces.delete(address.toLowerCase());
    return null;
  }

  return record.nonce;
}

export function deleteNonce(address: string): void {
  nonces.delete(address.toLowerCase());
}
