import React, { memo } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { PullRequestState } from "../filtering/status";
import { CheckStatus } from "../github-api/api";
import cn from "../cn";

type Props = {
  isApproved?: boolean;
  isDraft?: boolean;
  isMerged?: boolean;
  isPending?: boolean;
  isReviewRequested?: boolean;
  isRevisionRequested?: boolean;
  title: string;
};

const Badge = ({
  isApproved,
  isDraft,
  isMerged,
  isPending,
  isReviewRequested,
  isRevisionRequested,
  title,
}: Props) => (
  <span
    className={cn(
      "inline-block whitespace-nowrap rounded-full bg-gray-600 px-2 py-1 text-xs font-semibold leading-none text-white",
      {
        "bg-green-600": isApproved,
        "bg-gray-600": isDraft,
        "bg-purple-500": isMerged,
        "bg-blue-500": isPending,
        "bg-orange-400": isReviewRequested,
        "bg-red-600": isRevisionRequested,
      }
    )}
  >
    {title}
  </span>
);

const APPROVED = <Badge isApproved key="approved" title="Approved" />;
const CHANGES_REQUESTED = (
  <Badge isRevisionRequested key="needs-revision" title="Author's Queue" />
);
const CHECK_STATUS_FAILED = (
  <Badge isRevisionRequested key="tests-fail" title="Tests" />
);
const CHECK_STATUS_PASSED = <Badge isApproved key="tests-pass" title="Tests" />;
const CHECK_STATUS_PENDING = (
  <Badge isRevisionRequested key="tests-pending" title="Tests" />
);
const DRAFT = <Badge isDraft key="draft" title="Draft" />;
const MERGED = <Badge isMerged key="merged" title="Merged" />;
const NEEDS_REVIEW = (
  <Badge isReviewRequested key="needs-review" title="Needs Review" />
);

const PullRequestStatus = ({
  pullRequest,
}: {
  pullRequest: EnrichedPullRequest;
}) => {
  const badges = getBadges(pullRequest.state);
  if (badges.length > 0) {
    return <div className="flex items-center gap-1">{badges}</div>;
  }
  return <></>;
};

function getBadges(state: PullRequestState): JSX.Element[] {
  switch (state.kind) {
    case "incoming":
      return getIncomingStateBadges(state);
    case "outgoing":
      return getOutgoingStateBadges(state);
  }
}

function getCheckStatusBadge(checkStatus?: CheckStatus): JSX.Element[] {
  switch (checkStatus) {
    case "PENDING":
      return [CHECK_STATUS_PENDING];
    case "SUCCESS":
      return [CHECK_STATUS_PASSED];
    case "FAILURE":
      return [CHECK_STATUS_FAILED];
    case "ERROR":
    case "EXPECTED":
    default:
      return [];
  }
}

function getIncomingStateBadges(state: PullRequestState): JSX.Element[] {
  const badges: JSX.Element[] = [];

  if (state.draft) {
    badges.push(DRAFT);
  } else if (state.changesRequested) {
    badges.push(CHANGES_REQUESTED);
  }

  badges.push(...getCheckStatusBadge(state.checkStatus));

  return badges;
}

function getOutgoingStateBadges(state: PullRequestState): JSX.Element[] {
  const badges: JSX.Element[] = [];

  if (state.isMerged) {
    badges.push(MERGED);
    return badges;
  } else if (state.draft) {
    badges.push(DRAFT);
  } else if (state.approved) {
    badges.push(APPROVED);
  } else if (state.changesRequested) {
    badges.push(CHANGES_REQUESTED);
  } else {
    badges.push(NEEDS_REVIEW);
  }

  badges.push(...getCheckStatusBadge(state.checkStatus));

  return badges;
}

export default memo(PullRequestStatus);
