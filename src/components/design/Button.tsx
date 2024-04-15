import React, { ButtonHTMLAttributes, memo } from "react";

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="cursor-pointer items-center rounded-lg border-none bg-slate-200 p-1 outline-none hover:bg-slate-400 active:bg-slate-600"
    type="button"
    {...props}
  >
    {props.children}
  </button>
);

export default memo(Button);
