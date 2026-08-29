function Banner({ variant = "error", children }) {
  if (!children) return null;

  const cls = variant === "success" ? "success-banner" : "error-banner";

  return <div className={cls}>{children}</div>;
}

export default Banner;
