const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "10 Aug 26 \n 11:50 PM" style split used by the Important Dates grid.
export function formatDateParts(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return {
    datePart: `${day} ${month} ${year}`,
    timePart: `${hours}:${minutes} ${ampm}`,
  };
}

// Returns a fixed-width countdown like "01d : 06h : 28m : 32s", or null
// once the target has passed (caller decides what to render then).
export function getCountdownParts(targetIso, nowMs) {
  const diff = new Date(targetIso).getTime() - nowMs;
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');
  return { days, hours, minutes, seconds, label: `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s` };
}
