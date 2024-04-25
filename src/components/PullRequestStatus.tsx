import React, { memo } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { PullRequestState } from "../filtering/status";
import { CheckStatus } from "../github-api/api";
import cn from "../cn";
import {
  BeakerIcon,
  CheckIcon,
  CodeReviewIcon,
  FileDiffIcon,
  GitMergeIcon,
  GitPullRequestDraftIcon,
} from "@primer/octicons-react";

type Props = {
  icon: React.ReactNode;
  isApproved?: boolean;
  isDraft?: boolean;
  isMerged?: boolean;
  isPending?: boolean;
  isReviewRequested?: boolean;
  isRevisionRequested?: boolean;
};

const Badge = ({
  icon,
  isApproved,
  isDraft,
  isMerged,
  isPending,
  isReviewRequested,
  isRevisionRequested,
}: Props) => (
  <span
    className={cn(
      "flex items-center whitespace-nowrap rounded-full bg-gray-600 px-2 py-1 text-xs font-semibold leading-none text-white",
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
    {icon}
  </span>
);

const APPROVED = <Badge icon={<CheckIcon />} isApproved key="approved" />;
const CHANGES_REQUESTED = (
  <Badge icon={<FileDiffIcon />} isRevisionRequested key="needs-revision" />
);
const CHECK_STATUS_FAILED = (
  <Badge icon={<BeakerIcon />} isRevisionRequested key="tests-fail" />
);
const CHECK_STATUS_PASSED = (
  <Badge icon={<BeakerIcon />} isApproved key="tests-pass" />
);
const CHECK_STATUS_PENDING = (
  <Badge icon={<BeakerIcon />} isPending key="tests-pending" />
);
const DRAFT = <Badge icon={<GitPullRequestDraftIcon />} isDraft key="draft" />;
const MERGED = <Badge icon={<GitMergeIcon />} isMerged key="merged" />;
const NEEDS_REVIEW = (
  <Badge icon={<CodeReviewIcon />} isReviewRequested key="needs-review" />
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
  }
  if (state.isReviewFromMeSpecificallyRequested) {
    badges.push(NEEDS_REVIEW);
  }
  if (state.changesRequested) {
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
