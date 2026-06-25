import { useEffect, useRef, useState } from 'react';

// Parses a display value like "1,248", "87.4%", "₱902,800.00", "42 Students",
// "₱2.1M" or "14:1" into { prefix, num, suffix, decimals, group } so the numeric
// part can be animated while preserving formatting.
const parse = (val) => {
  if (typeof val === 'number') return { prefix: '', num: val, suffix: '', decimals: 0, group: false };
  const m = String(val).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const numStr = m[2];
  return {
    prefix: m[1],
    suffix: m[3],
    num: parseFloat(numStr.replace(/,/g, '')),
    decimals: numStr.includes('.') ? numStr.split('.')[1].length : 0,
    group: numStr.includes(','),
  };
};

export const Counter = ({ value, duration = 1100, className = '' }) => {
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed ? parsed.prefix + '0' + parsed.suffix : value);
  const raf = useRef();

  useEffect(() => {
    if (!parsed) { setDisplay(value); return; }
    const { prefix, num, suffix, decimals, group } = parsed;
    const fmt = (n) =>
      prefix +
      n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: group }) +
      suffix;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(fmt(num * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(fmt(num));
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span className={className}>{display}</span>;
};

export default Counter;
