interface MarqueeProps {
  items: string[];
  className?: string;
}

const Marquee = ({ items, className }: MarqueeProps) => {
  const track = [...items, ...items];

  return (
    <div className={`marquee ${className ?? ''}`.trim()} aria-label={items.join(' • ')}>
      <div className="marquee-track">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
