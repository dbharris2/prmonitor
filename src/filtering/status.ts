import { CheckStatus } from "../github-api/api";
import { PullRequest, ReviewState } from "../storage/loaded-state";
import {
  getLastAuthorCommentTimestamp,
  getLastReviewOrCommentTimestamp,
} from "./timestamps";

/**
 * Returns the {@link PullRequestState} of a PR.
 */
export function pullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  if (pr.author?.login === currentUserLogin) {
    return outgoingPullRequestState(pr, currentUserLogin);
  }
  return incomingPullRequestState(pr, currentUserLogin);
}

function incomingPullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  const lastReviewOrCommentFromCurrentUser = getLastReviewOrCommentTimestamp(
    pr,
    currentUserLogin
  );
  const hasNewCommentByAuthor =
    lastReviewOrCommentFromCurrentUser < getLastAuthorCommentTimestamp(pr);
  const hasReviewed = lastReviewOrCommentFromCurrentUser > 0;

  const stateByUser = new Map<string, ReviewState>();

  // Keep track of the last known state of reviews left by others.
  for (const review of pr.reviews) {
    if (review.authorLogin === currentUserLogin || !review.submittedAt) {
      continue;
    }
    const submittedAt = new Date(review.submittedAt).getTime();
    if (
      submittedAt < getLastReviewOrCommentTimestamp(pr, currentUserLogin) &&
      review.state === "CHANGES_REQUESTED"
    ) {
      // This change request may not be relevant anymore because the author has
      // taken action.
      stateByUser.set(review.authorLogin, "PENDING");
      continue;
    }
    // Set the user's current state to the current review. If it's a comment
    // however, we don't want to override a previous approval or request for
    // changes.
    if (!stateByUser.has(review.authorLogin) || review.state !== "COMMENTED") {
      stateByUser.set(review.authorLogin, review.state);
    }
  }

  const states = new Set(stateByUser.values());
  return {
    kind: "incoming",
    draft: pr.draft === true,
    newReviewRequested: !hasReviewed || states.has("PENDING"),
    authorResponded: hasReviewed && hasNewCommentByAuthor,
    checkStatus: pr.checkStatus,
    changesRequested: states.has("CHANGES_REQUESTED") || !pr.reviewRequested,
    mergeable: pr.mergeable === true,
    approved: false,
  };
}

function outgoingPullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  const stateByUser = new Map<string, ReviewState>();

  // Keep track of the last known state of reviews left by others.
  for (const review of pr.reviews) {
    if (review.authorLogin === currentUserLogin || !review.submittedAt) {
      continue;
    }
    const submittedAt = new Date(review.submittedAt).getTime();
    if (
      submittedAt < getLastReviewOrCommentTimestamp(pr, currentUserLogin) &&
      review.state === "CHANGES_REQUESTED"
    ) {
      // This change request may not be relevant anymore because the author has
      // taken action.
      stateByUser.set(review.authorLogin, "PENDING");
      continue;
    }
    // Set the user's current state to the current review. If it's a comment
    // however, we don't want to override a previous approval or request for
    // changes.
    if (!stateByUser.has(review.authorLogin) || review.state !== "COMMENTED") {
      stateByUser.set(review.authorLogin, review.state);
    }
  }

  // Ensure that anyone who commented without leaving a review is counted too.
  for (const comment of pr.comments) {
    if (comment.authorLogin === currentUserLogin) {
      continue;
    }
    if (!stateByUser.has(comment.authorLogin)) {
      stateByUser.set(comment.authorLogin, "COMMENTED");
    }
  }

  // Requested reviewers are specifically reviewers who haven't posted a review
  // after a request. This can also be the case when they had previously
  // reviewed, but the author requested another review from them.
  for (const requestedReviewer of pr.requestedReviewers || []) {
    stateByUser.set(requestedReviewer, "PENDING");
  }

  const states = new Set(stateByUser.values());
  return {
    kind: "outgoing",
    draft: pr.draft === true,
    changesRequested: states.has("CHANGES_REQUESTED") || !pr.reviewRequested,
    mergeable: pr.mergeable === true,
    approved: states.has("APPROVED"),
    checkStatus: pr.checkStatus,
    newReviewRequested: states.has("PENDING"),
    authorResponded: false,
  };
}

export type PullRequestState = {
  approved: boolean;
  authorResponded: boolean;
  changesRequested: boolean;
  draft: boolean;
  kind: "incoming" | "outgoing";
  mergeable: boolean;
  newReviewRequested: boolean;
  
  checkStatus?: CheckStatus;
}
