function MaskText({ children, className = "", delay = 0 }) {
  return (
    <span className={`mask-text ${className}`}>
      <span
        className="mask-text__inner"
        style={{ "--reveal-delay": `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

export default MaskText;