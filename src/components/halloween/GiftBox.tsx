"use client";

type Props = {
  opening: boolean;
};

/** Pixel present built from hard-edged divs — no border radius anywhere. */
export default function GiftBox({ opening }: Props) {
  return (
    <div className={`hw-gift ${opening ? "hw-gift--opening" : ""}`}>
      <div className="hw-gift-glow" aria-hidden="true" />
      <div className="hw-gift-lid">
        <span className="hw-gift-bow hw-gift-bow--l" />
        <span className="hw-gift-bow hw-gift-bow--r" />
        <span className="hw-gift-knot" />
      </div>
      <div className="hw-gift-body">
        <span className="hw-gift-ribbon" />
      </div>
    </div>
  );
}
