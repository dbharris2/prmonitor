import { observer } from "mobx-react-lite";
import React, { memo } from "react";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { Loader } from "./Loader";
import PullRequestItem from "./PullRequestItem";

interface Props {
  pullRequests: EnrichedPullRequest[] | null;
  onOpen(pullRequestUrl: string): void;
}

const PullRequestList = observer((props: Props) => {
  return (
    <div className="rounded-lg border border-solid bg-white">
      {props.pullRequests === null ? (
        <Loader />
      ) : props.pullRequests.length === 0 ? (
        <div className="p-1" />
      ) : (
        <>
          {props.pullRequests.map((pullRequest) => (
            <PullRequestItem
              key={pullRequest.nodeId}
              pullRequest={pullRequest}
              onOpen={props.onOpen}
            />
          ))}
        </>
      )}
    </div>
  );
});

export default memo(PullRequestList);
