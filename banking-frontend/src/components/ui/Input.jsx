import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { error, className = "", ...props },
  ref
) {
  const classes = ["input", error ? "error" : "", className]
    .filter(Boolean)
    .join(" ");

  return <input ref={ref} className={classes} {...props} />;
});

export default Input;
