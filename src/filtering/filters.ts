import { PullRequest } from "../storage/loaded-state";
import { EnrichedPullRequest } from "./enriched-pull-request";
import { pullRequestState } from "./status";

export enum Filter {
  ALL = "all",
  MINE = "mine",
  NEEDS_REVIEW = "needsReview",
  RECENTLY_MERGED = "recentlyMerged",
}

export type FilteredPullRequests = {
  [filter in Filter]: EnrichedPullRequest[];
};

export function filterPullRequests(
  userLogin: string,
  openPullRequests: PullRequest[]
): FilteredPullRequests {
  const enrichedPullRequests = openPullRequests.map((pr) => ({
    state: pullRequestState(pr, userLogin),
    ...pr,
  }));

  const mine = enrichedPullRequests.filter(
    (pr) => pr.author?.login === userLogin && !pr.isMerged
  );
  const recentlyMerged = enrichedPullRequests.filter(
    (pr) => pr.author?.login === userLogin && pr.isMerged
  );
  const needsReviewAndRevision = enrichedPullRequests.filter(
    (pr) => userLogin !== pr.author?.login
  );
  const all = [...mine, ...recentlyMerged, ...needsReviewAndRevision];

  return {
    all,
    mine,
    needsReview: needsReviewAndRevision,
    recentlyMerged,
  };
}
