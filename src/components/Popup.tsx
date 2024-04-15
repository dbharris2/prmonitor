import { observer } from "mobx-react-lite";
import React from "react";
import { Filter, FilteredPullRequests } from "../filtering/filters";
import { Core } from "../state/core";
import { Loader } from "./Loader";
import PullRequestList from "./PullRequestList";
import Status from "./Status";
import { Settings } from "./Settings";
import { CopyIcon } from "@primer/octicons-react";
import { isRunningAsPopup } from "../popup-environment";

export interface PopupProps {
  core: Core;
}

export interface PopupState {
  currentFilter: Filter;
}

export const Popup = observer((props: PopupProps) => {
  const { core } = props;
  const { filteredPullRequests: prs } = core ?? {};

  const onOpen = (pullRequestUrl: string) => {
    core.openPullRequest(pullRequestUrl).catch(console.error);
  };

  if (core.overallStatus !== "loaded") {
    return <Loader />;
  }

  return (
    <div className="flex w-[600px] flex-col">
      {core.token && (
        <>
          {isRunningAsPopup() && (
            <a
              target="_blank"
              href={`chrome-extension://${chrome.runtime.id}/index.html`}
              rel="noreferrer"
            >
              <CopyIcon />
            </a>
          )}
          <PullRequests core={core} onOpen={onOpen} prs={prs} />
        </>
      )}
      <div className="mt-2 flex">
        <Settings core={props.core} />
      </div>
    </div>
  );
});

function headerForFilter(filter: Filter): string {
  switch (filter) {
    case Filter.NEEDS_REVIEW:
      return "Needs Review";
    case Filter.NEEDS_REVISION:
      return "Author's Queue";
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
    Filter.NEEDS_REVISION,
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
