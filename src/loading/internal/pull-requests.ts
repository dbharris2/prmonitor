import { GitHubApi } from "../../github-api/api";
import { PullRequest } from "../../storage/loaded-state";
import { PullRequestNode } from "../../github-api/implementation";
import moment from "moment";

export function testPRs(): Promise<PullRequest[]> {
  return Promise.all([
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1098,
      updatedAt: "9 December 2023",
      author: {
        login: "dbharris2",
        avatarUrl:
          "https://cdn.iconscout.com/icon/free/png-256/free-eevee-eievui-pokemon-cartoon-game-video-pokemongo-32216.png",
      },
      changeSummary: {
        changedFiles: 6,
        additions: 134,
        deletions: 344,
      },
      title: "Codemod old API to new API",
      draft: false,
      reviewRequested: true,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [
        {
          authorLogin: "someone-else",
          state: "APPROVED",
          submittedAt: "10 December 2023",
        },
      ],
      comments: [
        { authorLogin: "", createdAt: "" },
        { authorLogin: "", createdAt: "" },
      ],
      reviewDecision: "APPROVED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1234,
      updatedAt: "10 December 2023",
      author: {
        login: "dbharris2",
        avatarUrl:
          "https://cdn.iconscout.com/icon/free/png-256/free-eevee-eievui-pokemon-cartoon-game-video-pokemongo-32216.png",
      },
      changeSummary: {
        changedFiles: 27,
        additions: 732,
        deletions: 640,
      },
      title: "Use new endpoint on homepage",
      draft: false,
      reviewRequested: true,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [],
      comments: [
        { authorLogin: "", createdAt: "" },
        { authorLogin: "", createdAt: "" },
      ],
      reviewDecision: "REVIEW_REQUIRED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1308,
      updatedAt: "10 December 2023",
      author: {
        login: "dbharris2",
        avatarUrl:
          "https://cdn.iconscout.com/icon/free/png-256/free-eevee-eievui-pokemon-cartoon-game-video-pokemongo-32216.png",
      },
      changeSummary: {
        changedFiles: 27,
        additions: 732,
        deletions: 640,
      },
      title: "Use new routing API",
      draft: false,
      reviewRequested: false,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [{ authorLogin: "dbharris2", state: "CHANGES_REQUESTED" }],
      comments: [
        { authorLogin: "", createdAt: "" },
        { authorLogin: "", createdAt: "" },
      ],
      reviewDecision: "CHANGES_REQUESTED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1023,
      updatedAt: "8 December 2023",
      author: {
        login: "dbharris2",
        avatarUrl:
          "https://cdn.iconscout.com/icon/free/png-256/free-eevee-eievui-pokemon-cartoon-game-video-pokemongo-32216.png",
      },
      changeSummary: {
        changedFiles: 4,
        additions: 12,
        deletions: 64,
      },
      title: "Update unit tests for nav bar",
      draft: true,
      reviewRequested: true,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [],
      comments: [
        { authorLogin: "", createdAt: "" },
        { authorLogin: "", createdAt: "" },
      ],
      reviewDecision: "REVIEW_REQUIRED",
      checkStatus: "FAILURE",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1521,
      updatedAt: "10 December 2023",
      author: {
        login: "someone-else",
        avatarUrl:
          "https://daily.pokecommunity.com/wp-content/uploads/2018/11/pokemon_icon_092_00.png",
      },
      changeSummary: {
        changedFiles: 7,
        additions: 112,
        deletions: 32,
      },
      title: "Ship new accounts page",
      draft: false,
      reviewRequested: true,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [{ authorLogin: "dbharris2", state: "CHANGES_REQUESTED" }],
      comments: [{ authorLogin: "dbharris2", createdAt: "10 December 2023" }],
      reviewDecision: "REVIEW_REQUIRED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1521,
      updatedAt: "9 December 2023",
      author: {
        login: "someone-else",
        avatarUrl:
          "https://daily.pokecommunity.com/wp-content/uploads/2018/11/pokemon_icon_092_00.png",
      },
      changeSummary: {
        changedFiles: 7,
        additions: 112,
        deletions: 32,
      },
      title: "Fix bug when scrolling through accounts",
      draft: false,
      reviewRequested: true,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [],
      comments: [
        { authorLogin: "", createdAt: "" },
        { authorLogin: "", createdAt: "" },
      ],
      reviewDecision: "REVIEW_REQUIRED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
    {
      nodeId: "123",
      htmlUrl: "",
      repoOwner: "dbharris",
      repoName: "test-repo",
      pullRequestNumber: 1771,
      updatedAt: "9 December 2023",
      author: {
        login: "another-someone",
        avatarUrl: "https://www.icons101.com/icon_ico/id_60018/025_Pikachu.ico",
      },
      changeSummary: {
        changedFiles: 4,
        additions: 12,
        deletions: 64,
      },
      title: "Add caching to queries",
      draft: false,
      reviewRequested: false,
      requestedReviewers: [],
      requestedTeams: [],
      reviews: [{ authorLogin: "dbharris2", state: "CHANGES_REQUESTED" }],
      comments: [{ authorLogin: "dbharris2", createdAt: "10 December 2023" }],
      reviewDecision: "CHANGES_REQUESTED",
      checkStatus: "SUCCESS",
      isMerged: false,
    },
  ]);
}

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
  // if (true) {
  //   return testPRs();
  // }

  const { prs: myMergedPrs } = await githubApi.loadMyMergedPullRequests();
  const { prs: myPrs, viewer } = await githubApi.loadMyOpenPullRequests();
  const { prs: toReviewPrs } = await githubApi.loadToReviewPullRequests();
  const { prs: needsRevisionPrs } =
    await githubApi.loadNeedsRevisionPullRequests();

  return [
    ...toReviewPrs.filter((pr) =>
      pr.reviewRequests.nodes.find(
        ({ requestedReviewer }) => requestedReviewer.login === viewer.login
      )
    ),
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
    reviewRequested: false,
    reviews: [],
    title: node.title,
    updatedAt: node.updatedAt,
  }));
}
