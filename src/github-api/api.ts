import { PullRequestRet } from "./implementation";

/**
 * A simple wrapper around GitHub's API.
 */
export interface GitHubApi {
  loadViewer(): Promise<{ login: string }>;
  loadMyMergedPullRequests(): Promise<PullRequestRet>;
  loadMyOpenPullRequests(): Promise<PullRequestRet>;
  loadNeedsRevisionPullRequests(): Promise<PullRequestRet>;
  loadToReviewPullRequests(): Promise<PullRequestRet>;
}

// Ref: https://docs.github.com/en/graphql/reference/enums#pullrequestreviewdecision
export type ReviewDecision =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "REVIEW_REQUIRED";

// Ref: https://docs.github.com/en/graphql/reference/enums#statusstate
export type CheckStatus =
  | "ERROR"
  | "EXPECTED"
  | "FAILURE"
  | "PENDING"
  | "SUCCESS";

export interface PullRequestStatus {
  reviewDecision: ReviewDecision;
  checkStatus?: CheckStatus;
}

export interface RepoReference {
  owner: string;
  name: string;
}

export interface PullRequestReference {
  repo: RepoReference;
  number: number;
}
