import { GitHubApi } from "../../github-api/api";
import { PullRequest } from "../../storage/loaded-state";
import { PullRequestNode } from "../../github-api/implementation";
import moment from "moment";

/**
 * Refreshes the list of pull requests for a list of repositories.
 *
 * This optimizes for the minimum number of API requests to GitHub as
 * brute-forcing would quickly go over API rate limits if the user has several
 * hundred repositories or many pull requests opened.
 */
export async function refreshOpenPullRequests(
  githubApi: GitHubApi
): Promise<PullRequest[]> {
  const { prs: myMergedPrs } = await githubApi.loadMyMergedPullRequests();
  const { prs: myPrs, viewer } = await githubApi.loadMyOpenPullRequests();
  const { prs: toReviewPrs } = await githubApi.loadToReviewPullRequests();
  const { prs: needsRevisionPrs } =
    await githubApi.loadNeedsRevisionPullRequests();

  const isReviewFromMeSpecificallyRequested = (pr: PullRequestNode) =>
    pr.reviewRequests.nodes
      .filter(Boolean)
      .some(
        ({ requestedReviewer }) => requestedReviewer?.login === viewer.login
      );

  const prIds = new Set(toReviewPrs.map((pr) => pr.number));

  const prs = [
    ...toReviewPrs,
    ...needsRevisionPrs.filter(
      (pr) => pr.reviewDecision === "CHANGES_REQUESTED" && !prIds.has(pr.number)
    ),
    ...myPrs,
    ...myMergedPrs.filter(
      (pr) => moment().diff(moment(pr.updatedAt), "days") < 1
    ),
  ];

  return prs.map((node: PullRequestNode, index: { toString: () => any }) => ({
    author: node.author && {
      avatarUrl: node.author.avatarUrl,
      login: node.author.login,
    },
    changeSummary: {
      additions: node.additions,
      changedFiles: node.changedFiles,
      deletions: node.deletions,
    },
    checkStatus: node.statusCheckRollup?.state ?? "SUCCESS",
    comments: Array.from({ length: node.totalCommentsCount }, () => ({
      authorLogin: "",
      createdAt: "",
    })),
    draft: node.isDraft,
    htmlUrl: node.url,
    isMerged: node.merged,
    nodeId: index.toString(),
    pullRequestNumber: node.number,
    repoName: "",
    repoOwner: node.repository.nameWithOwner,
    reviewDecision: node.reviewDecision,
    reviewRequested: isReviewFromMeSpecificallyRequested(node),
    reviewRequests: node.reviewRequests.nodes
      .map(({ requestedReviewer }) => requestedReviewer)
      .concat(node.participants.nodes)
      .filter(Boolean)
      .filter((reviewer) => reviewer?.login !== node.author.login),
    reviews: [],
    title: node.title,
    updatedAt: node.updatedAt,
  }));
}
