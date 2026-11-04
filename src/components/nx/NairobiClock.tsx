import { useEffect, useState } from 'react';

const fmt = () =>
  new Intl.DateTimeFormat('en-KE', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi', hour12: false }).format(new Date());

/** Live local time in Nairobi (EAT), refreshed every 15s. */
export default function NairobiClock() {
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t} EAT</span>;
}
