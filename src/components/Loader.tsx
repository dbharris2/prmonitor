import { observer } from "mobx-react-lite";
import React from "react";
import { ClipLoader } from "react-spinners";

export const Loader = observer(() => (
  <div className="flex justify-center p-4">
    <ClipLoader />
  </div>
));
