import { CheckStatus } from "../github-api/api";
import { PullRequest } from "../storage/loaded-state";

/**
 * Returns the {@link PullRequestState} of a PR.
 */
export function pullRequestState(
  pr: PullRequest,
  viewerLogin: string
): PullRequestState {
  if (pr.author?.login === viewerLogin) {
    return outgoingPullRequestState(pr);
  }
  return incomingPullRequestState(pr);
}

function incomingPullRequestState(pr: PullRequest): PullRequestState {
  return {
    approved: false,
    draft: pr.draft === true,
    changesRequested: pr.reviewDecision === "CHANGES_REQUESTED",
    checkStatus: pr.checkStatus,
    kind: "incoming",
    isMerged: pr.isMerged,
    isReviewFromMeSpecificallyRequested: pr.reviewRequested,
  };
}

function outgoingPullRequestState(pr: PullRequest): PullRequestState {
  return {
    approved: pr.reviewDecision === "APPROVED",
    changesRequested: pr.reviewDecision === "CHANGES_REQUESTED",
    checkStatus: pr.checkStatus,
    draft: pr.draft === true,
    kind: "outgoing",
    isMerged: pr.isMerged,
    isReviewFromMeSpecificallyRequested: false,
  };
}

export type PullRequestState = {
  approved: boolean;
  changesRequested: boolean;
  checkStatus?: CheckStatus;
  draft: boolean;
  kind: "incoming" | "outgoing";
  isMerged: boolean;
  isReviewFromMeSpecificallyRequested?: boolean;
};
