import {
  PullsGetResponse,
  PullsListResponseItem,
  ReposGetResponse
} from "@octokit/rest";
import {
  PullsListReviewsResponse,
  ReviewState
} from "../../github/api/reviews";
import { storage } from "./helper";

/**
 * Storage of the last information we loaded about pull requests.
 */
export const lastCheckStorage = storage<LastCheck>("lastCheck");

export interface LastCheck {
  /**
   * The list of all repositories that the user is a member of.
   */
  repos: Repo[];

  /**
   * The list of all open pull requests across all repositories.
   *
   * This includes pull requests that the user isn't involved in (yet). We will check the
   * status of each pull request to see whether its status has changed, or whether the user
   * is now involved (e.g. by being added as a reviewer).
   *
   * This is important because a repository's `pushed_at` field does not get updated when a
   * new comment has been added to a pull request, whereas it does change when a pull request
   * is created. This allows us to only ever look for new pull requests in repositories that
   * where `pushed_at` has changed since our last check.
   */
  openPullRequests: PullRequest[];
}

export interface Repo {
  owner: string;
  name: string;

  /** Date when the last commit was pushed (across any branch). */
  pushedAt: string;
}

export function repoFromResponse(response: ReposGetResponse): Repo {
  return {
    owner: response.owner.login,
    name: response.name,
    pushedAt: response.pushed_at
  };
}

export interface PullRequest {
  nodeId: string;
  htmlUrl: string;
  repoOwner: string;
  repoName: string;
  pullRequestNumber: number;
  authorLogin: string;
  title: string;
  requestedReviewers: string[];
  reviews: Review[];
}

export interface Review {
  authorLogin: string;
  state: ReviewState;
  submittedAt: string;
}

export function pullRequestFromResponse(
  response: PullsGetResponse | PullsListResponseItem,
  reviews: PullsListReviewsResponse
): PullRequest {
  return {
    nodeId: response.node_id,
    htmlUrl: response.html_url,
    repoOwner: response.base.repo.owner.login,
    repoName: response.base.repo.name,
    pullRequestNumber: response.number,
    authorLogin: response.user.login,
    title: response.title,
    requestedReviewers: response.requested_reviewers.map(r => r.login),
    reviews: reviews.map(r => ({
      authorLogin: r.user.login,
      state: r.state,
      submittedAt: r.submitted_at
    }))
  };
}
