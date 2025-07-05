import { BASE_URL } from "~/constants/constant";

export interface AddReviewPayload {
  revieweeUsername: string;
  comment: string;
  txHash: string;
  rating: "positive" | "neutral" | "negative";
  personas?: { name: string; weight: number }[];
  overallPersona?: string;
}

export async function addReview(payload: AddReviewPayload): Promise<{ isSuccess: boolean }> {
  const token = localStorage.getItem("waffle_auth_token");

  if (!token) {
    throw new Error("Not authenticated. Please log in.");
  }

  const res = await fetch(`${BASE_URL}/reviews/${payload.revieweeUsername}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to submit review: ${errorText}`);
  }

  return await res.json();
}
