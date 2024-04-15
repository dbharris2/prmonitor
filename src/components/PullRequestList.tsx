import React, { memo } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import PullRequestItem from "./PullRequestItem";

interface Props {
  pullRequests: EnrichedPullRequest[] | null;
  onOpen(pullRequestUrl: string): void;
}

const PullRequestList = ({pullRequests, onOpen}: Props) => {
  return (
    <div className="rounded-lg border border-solid bg-white">
      {pullRequests === null ? (
        <div>Loading...</div>
      ) : pullRequests.length === 0 ? (
        <div className="p-1" />
      ) : (
        pullRequests.map((pullRequest) => (
          <PullRequestItem
            key={pullRequest.nodeId}
            pullRequest={pullRequest}
            onOpen={onOpen}
          />
        ))
      )}
    </div>
  );
};

export default memo(PullRequestList);
