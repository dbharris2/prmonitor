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

  return [
    ...toReviewPrs,
    ...needsRevisionPrs.filter(
      (pr) =>
        pr.reviewDecision === "CHANGES_REQUESTED" &&
        pr.reviewRequests.nodes.find(
          ({ requestedReviewer }) => requestedReviewer.login === viewer.login
        )
    ),
    ...myPrs,
    ...myMergedPrs.filter(
      (pr) => moment().diff(moment(pr.updatedAt), "days") < 1
    ),
  ].map((node: PullRequestNode, index: { toString: () => any }) => ({
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
    reviewRequested: node.reviewRequests.nodes.some(
      ({ requestedReviewer }) => requestedReviewer.login === viewer.login
    ),
    reviewRequests: node.reviewRequests.nodes
      .map(({ requestedReviewer }) => requestedReviewer)
      .concat(
        node.participants.nodes.filter(
          (participant) => participant.login !== viewer.login
        )
      ),
    reviews: [],
    title: node.title,
    updatedAt: node.updatedAt,
  }));
}
