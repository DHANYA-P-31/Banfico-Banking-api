function Card({ title, action, children, className = "", ...rest }) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
