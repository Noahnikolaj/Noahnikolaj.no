/*
 * A template remounts on every navigation where a layout does not, so the
 * page arriving in a new room replays its entrance here. The travel itself
 * happens in the world behind it.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="room-enter">{children}</div>;
}
