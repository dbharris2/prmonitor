import React, { memo } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import PullRequestStatus from "./PullRequestStatus";
import { CommentIcon } from "@primer/octicons-react";
import moment from "moment";
import cn from "../cn";

interface Props {
  pullRequest: EnrichedPullRequest;
  onOpen(pullRequestUrl: string): void;
}

const PullRequestItem = ({ onOpen, pullRequest }: Props) => {
  const open = (e: React.MouseEvent) => {
    onOpen(pullRequest.htmlUrl);
    e.preventDefault();
  };

  return (
    <a
      className={cn(
        "flex cursor-pointer border-b border-solid bg-[#fff] p-2 first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-purple-100",
        {
          "bg-red-100":
            pullRequest.state.changesRequested &&
            moreThanOneDayAgo(pullRequest.updatedAt),
        },
        {
          "bg-green-200": pullRequest.state.approved,
        }
      )}
      key={pullRequest.nodeId}
      onClick={open}
      href={pullRequest.htmlUrl}
    >
      <PullRequestItemContent pullRequest={pullRequest} />
    </a>
  );
};

const PullRequestItemContent = ({
  pullRequest,
}: {
  pullRequest: EnrichedPullRequest;
}) => (
  <div className="flex w-full flex-col">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Avatar src={pullRequest.author?.avatarUrl ?? ""} />
        <div className="flex flex-wrap">
          {pullRequest.title} (#{pullRequest.pullRequestNumber})
        </div>
      </div>
      {moment(pullRequest.updatedAt).fromNow()}
    </div>
    <div className="flex justify-between">
      <div className="flex grow flex-wrap gap-2">
        {pullRequest.repoOwner}
        <div className="flex gap-1">
          <div className="text-green-700">
            +{pullRequest.changeSummary.additions}
          </div>
          <div className="text-red-700">
            -{pullRequest.changeSummary.deletions}
          </div>
          @{pullRequest.changeSummary.changedFiles}
          <div className="ml-1">
            <CommentIcon /> {pullRequest.comments.length}
          </div>
        </div>
        <ReviewerAvatars pullRequest={pullRequest} />
      </div>
      <PullRequestStatus pullRequest={pullRequest} />
    </div>
  </div>
);

const ReviewerAvatars = ({
  pullRequest,
}: {
  pullRequest: EnrichedPullRequest;
}) => {
  if (!pullRequest.reviewRequests || pullRequest.reviewRequests.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-0.5">
      {pullRequest.reviewRequests?.map(({ avatarUrl }, index) => (
        <Avatar key={index} src={avatarUrl} />
      ))}
    </div>
  );
};

const Avatar = ({ src }: { src: string }) => (
  <img
    className="h-5 w-5 rounded-xl border-2 border-solid border-stone-700"
    src={src}
  />
);

function moreThanOneDayAgo(timestamp: string) {
  return moment().diff(moment(timestamp), "days") >= 1;
}

export default memo(PullRequestItem);
