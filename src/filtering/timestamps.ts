import { PullRequest } from "../storage/loaded-state";

export function getLastUpdateTimestamp(pr: PullRequest) {
  let prTimestamp = new Date(pr.updatedAt).getTime();
  for (const comment of pr.comments) {
    prTimestamp = Math.max(prTimestamp, new Date(comment.createdAt).getTime());
  }
  for (const review of pr.reviews) {
    if (!review.submittedAt) {
      continue;
    }
    prTimestamp = Math.max(prTimestamp, new Date(review.submittedAt).getTime());
  }
  return prTimestamp;
}
