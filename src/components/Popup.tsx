import { observer } from "mobx-react-lite";
import React, { memo } from "react";
import { Filter, FilteredPullRequests } from "../filtering/filters";
import { Core } from "../state/core";
import PullRequestList from "./PullRequestList";
import Status from "./Status";
import { Settings } from "./Settings";
// import { CopyIcon } from "@primer/octicons-react";
// import { isRunningAsPopup } from "../popup-environment";

interface PopupProps {
  core: Core;
}

const Popup = observer(({ core }: PopupProps) => {
  const { filteredPullRequests: prs } = core ?? {};

  const onOpen = (pullRequestUrl: string) => {
    core.openPullRequest(pullRequestUrl).catch(console.error);
  };

  if (core.overallStatus !== "loaded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-2">
      {core.token && (
        <>
          {/* {isRunningAsPopup() && (
            <a
              target="_blank"
              href={`chrome-extension://${chrome.runtime.id}/index.html`}
              rel="noreferrer"
            >
              <CopyIcon />
            </a>
          )} */}
          <PullRequests core={core} onOpen={onOpen} prs={prs} />
        </>
      )}
      <div className="mt-2 flex">
        <Settings core={core} />
      </div>
    </div>
  );
});

function headerForFilter(filter: Filter): string {
  switch (filter) {
    case Filter.NEEDS_REVIEW:
      return "My Queue";
    case Filter.MINE:
      return "My PRs";
    case Filter.RECENTLY_MERGED:
      return "My Recently Merged PRs";
    default:
      return "Invalid Filter";
  }
}

function PullRequests({
  core,
  prs,
  onOpen,
}: {
  core: Core;
  prs: FilteredPullRequests | null;
  onOpen: (pullRequestUrl: string) => void;
}): JSX.Element {
  const filters: Array<Filter> = [
    Filter.NEEDS_REVIEW,
    Filter.MINE,
    Filter.RECENTLY_MERGED,
  ];
  return (
    <div className="flex flex-col gap-3">
      <Status core={core} />
      {filters.map((filter: Filter, index: number) => {
        return (
          <div className="flex flex-col gap-2" key={index}>
            <div style={{ fontSize: 18 }}>{headerForFilter(filter)}</div>
            <PullRequestList
              pullRequests={prs?.[filter] ?? null}
              onOpen={onOpen}
            />
          </div>
        );
      })}
    </div>
  );
}

export default memo(Popup);
