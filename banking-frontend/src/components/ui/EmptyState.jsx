function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="state-box">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
