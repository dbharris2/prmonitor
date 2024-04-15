import moment from "moment";
import React, { memo } from "react";
import Button from "./design/Button";
import { Core } from "../state/core";
import { observer } from "mobx-react-lite";

interface StatusProps {
  core: Core;
}

const Status = observer(({ core }: StatusProps) => {
  const { loadedState } = core ?? {};

  return (
    <div className="flex w-full flex-col rounded-lg border border-solid border-gray-300 bg-white p-2">
      {core.lastError ? (
        <div className="flex justify-between">
          <div className="flex items-center">Error: {core.lastError}</div>
          <LastUpdated timestamp={loadedState?.startRefreshTimestamp} />
          <Button
            onClick={() => {
              core.triggerBackgroundRefresh();
            }}
            title="Refresh"
          >
            Refresh
          </Button>
        </div>
      ) : (
        <div className="flex justify-between">
          {core.refreshing ? (
            <div className="flex items-center">Refreshing...</div>
          ) : (
            <LastUpdated timestamp={loadedState?.startRefreshTimestamp} />
          )}
          {core.refreshing ? (
            <Button
              onClick={() => {
                core.triggerRestart();
              }}
              title="Reload"
            >
              Reload
            </Button>
          ) : (
            <Button
              onClick={() => {
                core.triggerBackgroundRefresh();
              }}
              title="Refresh"
            >
              Refresh
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

function LastUpdated({
  timestamp,
}: {
  timestamp: moment.MomentInput;
}): JSX.Element {
  return (
    <div className="flex items-center">
      Last updated {moment(timestamp).fromNow()}
    </div>
  );
}

export default memo(Status);
