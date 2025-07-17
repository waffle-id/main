export type UserLeaderboard = {
  _id: string;
  address: string | null;
  username: string | null;
  reputationScore: number;
  hasInvitationAuthority: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string | null;
  __v: number;
};
