import { verifyMessage } from "ethers";

export function verifyWalletSignature({
  address,
  message,
  signature,
}: {
  address: string;
  message: string;
  signature: string;
}) {
  const recovered = verifyMessage(message, signature);
  return recovered.toLowerCase() === address.toLowerCase();
}
