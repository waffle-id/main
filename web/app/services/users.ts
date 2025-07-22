export interface User {
  _id: string;
  address: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  reputationScore: number;
  hasInvitationAuthority: boolean;
  createdAt: string;
  updatedAt: string;
  writtenReviewCount: number;
  receivedReviewCount: number;
}

export interface UserProfile {
  address?: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  reputationScore: number;
  hasInvitationAuthority: boolean;
  userPersonaScores?: any[];
  isScraped?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    sort: null | {
      by: string;
      order: string;
    };
  };
}

export async function fetchUsers(params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: string;
}): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.size) searchParams.set('size', params.size.toString());
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.order) searchParams.set('order', params.order);

  const url = `https://api.waffle.food/account${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchUserProfile(username: string): Promise<UserProfile> {
  const response = await fetch(`https://api.waffle.food/account/${username}`, {
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

export async function checkUserExists(address: string): Promise<{
  success: boolean;
  username?: string;
  address?: string;
  error?: string;
}> {
  const response = await fetch(`https://api.waffle.food/account/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`Failed to check user existence: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    success: data.success,
    username: data.username,
    address: data.address,
  };
}

export function categorizeUsersByReputation(users: User[]) {
  const credible = users.filter(user => user.reputationScore >= 1000);
  const leastCredible = users.filter(user => user.reputationScore < 1000);
  
  return {
    credible,
    leastCredible,
    total: users.length
  };
}
