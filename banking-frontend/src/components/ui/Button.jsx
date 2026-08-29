function Button({
  variant = "primary",
  size,
  as: Component = "button",
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}

export default Button;
