import { observer } from "mobx-react-lite";
import React, { FormEvent, useRef, useState } from "react";
import { Core } from "../state/core";
import Button from "./Button";

interface Props {
  core: Core;
}

export const Settings = observer(({ core }: Props) => {
  const [state, setState] = useState<{
    editing: boolean | "default";
  }>({
    editing: "default",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Show the token editing form if:
  // - editing is "default" (user has not said whether they want to open or dismiss the form)
  //   AND the token is not set; or
  // - editing is explicitly set to true (user opened the form).
  const editing = state.editing === "default" ? !core.token : state.editing;

  const openForm = () => {
    setState({
      editing: true,
    });
  };

  const saveForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef.current) {
      return;
    }
    const token = inputRef.current.value;
    core
      .setNewToken(token)
      .then(() => console.log("GitHub API token updated."));
    setState({
      editing: false,
    });
  };

  const cancelForm = () => {
    setState({
      editing: false,
    });
  };

  return (
    <div className="flex w-full flex-col">
      {!editing ? (
        core.loadedState ? (
          <div className="flex items-center justify-between">
            <div>
              Signed in as{" "}
              <span>{core.loadedState.userLogin || "unknown"}</span>
            </div>
            <Button onClick={openForm}>Update token</Button>
          </div>
        ) : core.lastError ? (
          <div className="flex items-center justify-between">
            <div>Is your token valid?</div>
            <Button onClick={openForm}>Update token</Button>
          </div>
        ) : core.token ? (
          <div className="flex items-center justify-between">
            <div>
              We're loading your pull requests. This could take a while...
            </div>
            <Button onClick={openForm}>Update token</Button>
          </div>
        ) : (
          <>
            <div>
              Welcome to PR Monitor! In order to use this Chrome extension, you
              need to provide a GitHub API token. This will be used to load your
              pull requests.
            </div>
            <div>
              <Button onClick={openForm}>Update token</Button>
            </div>
          </>
        )
      ) : (
        <form onSubmit={saveForm}>
          {!core.token && (
            <div>
              Welcome to PR Monitor! In order to use this Chrome extension, you
              need to provide a GitHub API token. This will be used to load your
              pull requests.
            </div>
          )}
          <div>
            Enter a GitHub API token with <b>repo</b> scope
          </div>
          <div className="flex items-center justify-between gap-2">
            <input className="mr-2 flex w-full p-2" ref={inputRef} />
            <Button type="submit">Save</Button>
            <Button onClick={cancelForm}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
});
