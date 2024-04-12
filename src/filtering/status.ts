import { CheckStatus } from "../github-api/api";
import { PullRequest } from "../storage/loaded-state";

/**
 * Returns the {@link PullRequestState} of a PR.
 */
export function pullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  if (pr.author?.login === currentUserLogin) {
    return outgoingPullRequestState(pr);
  }
  return incomingPullRequestState(pr);
}

function incomingPullRequestState(pr: PullRequest): PullRequestState {
  return {
    kind: "incoming",
    draft: pr.draft === true,
    checkStatus: pr.checkStatus,
    changesRequested: pr.reviewDecision === "CHANGES_REQUESTED",
    approved: false,
    isMerged: pr.isMerged,
  };
}

function outgoingPullRequestState(pr: PullRequest): PullRequestState {
  return {
    kind: "outgoing",
    draft: pr.draft === true,
    changesRequested: pr.reviewDecision === "CHANGES_REQUESTED",
    approved: pr.reviewDecision === "APPROVED",
    checkStatus: pr.checkStatus,
    isMerged: pr.isMerged,
  };
}

export type PullRequestState = {
  approved: boolean;
  changesRequested: boolean;
  draft: boolean;
  kind: "incoming" | "outgoing";
  isMerged: boolean;
  checkStatus?: CheckStatus;
};
