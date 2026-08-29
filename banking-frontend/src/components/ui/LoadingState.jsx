function LoadingState({ label = "Loading..." }) {
  return (
    <div className="state-box">
      <p>{label}</p>
    </div>
  );
}

export default LoadingState;
