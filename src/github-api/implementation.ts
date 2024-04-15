import { CheckStatus, GitHubApi, ReviewDecision } from "./api";
import { request } from "@octokit/request";

const PR_FRAGMENT = `... on PullRequest {
  additions
  author {
    login
    avatarUrl
  }
  changedFiles
  deletions
  isDraft
  merged
  number
  participants(first: 10) {
    nodes {
      avatarUrl
      login
    }
  }
  repository {
    nameWithOwner
  }
  reviewDecision
  reviewRequests(first: 10) {
    nodes {
      requestedReviewer {
        ... on User {
          avatarUrl
          name
          login
        }
      }
    }
  }
  state
  statusCheckRollup {
    state
  }
  title
  totalCommentsCount
  updatedAt
  url
}`;

export type PullRequestNode = {
  additions: number;
  author: { login: string; avatarUrl: string };
  changedFiles: number;
  deletions: number;
  isDraft: boolean;
  merged: boolean;
  number: number;
  participants: { nodes: { avatarUrl: string; login: string }[] };
  repository: { nameWithOwner: string };
  reviewDecision: ReviewDecision;
  reviewRequests: {
    nodes: { requestedReviewer: { avatarUrl: string; login: string } }[];
  };
  statusCheckRollup: { state: CheckStatus };
  title: string;
  totalCommentsCount: number;
  updatedAt: string;
  url: string;
  viewer: { login: string };
};

export type PullRequestRet = {
  prs: PullRequestNode[];
  viewer: { login: string };
};

export function buildGitHubApi(token: string): GitHubApi {
  return {
    async loadViewer(): Promise<{ login: string }> {
      const response = await request("POST /graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: `query Viewer {
          viewer {
            login
          }
        }`,
        variables: {
          login: "octokit",
        },
      });

      return response.data.data.viewer;
    },
    async loadMyOpenPullRequests(): Promise<PullRequestRet> {
      const response = await request("POST /graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: `query MyOpenPullRequests($qstr: String!) {
          search(query: $qstr, type: ISSUE, first: 30) {
            nodes {
              ${PR_FRAGMENT}
            }
          }
          viewer {
            login
          }
        }`,
        variables: {
          login: "octokit",
          qstr: "author:@me is:pr is:open",
        },
      });

      return {
        prs: response.data.data.search.nodes,
        viewer: response.data.data.viewer,
      };
    },
    async loadNeedsRevisionPullRequests(): Promise<PullRequestRet> {
      const response = await request("POST /graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: `query NeedsRevisionPullRequests($qstr: String!) {
          search(query: $qstr, type: ISSUE, first: 30) {
            nodes {
              ${PR_FRAGMENT}
            }
          }
          viewer {
            login
          }
        }`,
        variables: {
          login: "octokit",
          qstr: "-author:@me -is:draft is:open is:pr involves:@me -review:approved",
        },
      });

      return {
        prs: response.data.data.search.nodes,
        viewer: response.data.data.viewer,
      };
    },
    async loadToReviewPullRequests(): Promise<PullRequestRet> {
      const response = await request("POST /graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: `query ToReviewPullRequests($qstr: String!) {
          search(query: $qstr, type: ISSUE, first: 30) {
            nodes {
              ${PR_FRAGMENT}
            }
          }
          viewer {
            login
          }
        }`,
        variables: {
          login: "octokit",
          qstr: "-author:@me -is:draft is:open is:pr review-requested:@me -review:approved",
        },
      });

      return {
        prs: response.data.data.search.nodes,
        viewer: response.data.data.viewer,
      };
    },
    async loadMyMergedPullRequests(): Promise<PullRequestRet> {
      const response = await request("POST /graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: `query MyMergedPullRequests($qstr: String!) {
          search(query: $qstr, type: ISSUE, first: 30) {
            nodes {
              ${PR_FRAGMENT}
            }
          }
          viewer {
            login
          }
        }`,
        variables: {
          login: "octokit",
          qstr: "author:@me is:pr is:merged",
        },
      });

      return {
        prs: response.data.data.search.nodes,
        viewer: response.data.data.viewer,
      };
    },
  };
}
