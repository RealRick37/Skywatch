function RevealText({ children, className = "", delay = 0 }) {
  return (
    <span
      className={`reveal-text ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </span>
  );
}

export default RevealText;