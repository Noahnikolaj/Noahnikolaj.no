import { RoomTransition } from "@/components/pixel/RoomTransition";

/*
 * A template remounts on every navigation where a layout does not, which is
 * what makes the room transition replay between pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoomTransition />
      {children}
    </>
  );
}
