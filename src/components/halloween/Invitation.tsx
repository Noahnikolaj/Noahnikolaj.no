"use client";

type Activity = { icon: string; label: string };

type Props = {
  guest: string;
  date: string;
  time: string;
  place: string;
  activities: Activity[];
  accepted: boolean;
  onAccept: () => void;
};

export default function Invitation({
  guest,
  date,
  time,
  place,
  activities,
  accepted,
  onAccept,
}: Props) {
  return (
    <div className="hw-card">
      <p className="hw-pixel hw-flicker text-center text-[11px] leading-relaxed tracking-widest text-[#ff7518]">
        DU ER INVITERT
      </p>

      <div className="hw-rule" />

      <p className="hw-mono text-center text-2xl text-[#f6e9d8]">
        Kjære <span className="text-[#ff7518]">{guest}</span>,
      </p>
      <p className="hw-mono text-center text-xl leading-snug text-[#cbbcd6]">
        Denji fant deg først. Nå spør jeg: blir du med på en halloweenkveld?
      </p>

      <dl className="hw-details">
        <div>
          <dt>WHEN</dt>
          <dd>
            {date} · {time}
          </dd>
        </div>
        <div>
          <dt>WHERE</dt>
          <dd>{place}</dd>
        </div>
      </dl>

      <p className="hw-pixel text-[9px] tracking-widest text-[#39ff14]">ON THE MENU</p>
      <ul className="hw-activities">
        {activities.map((a) => (
          <li key={a.label}>
            <span aria-hidden="true">{a.icon}</span>
            <span>{a.label}</span>
          </li>
        ))}
      </ul>

      {accepted ? (
        <div className="hw-accepted">
          <p className="hw-pixel text-[11px] leading-relaxed tracking-widest text-[#39ff14]">
            VI SES! 🎃
          </p>
          <p className="hw-mono text-xl text-[#cbbcd6]">
            Denji gleder seg. Det gjør jeg også.
          </p>
        </div>
      ) : (
        <button type="button" className="hw-btn hw-btn--yes w-full" onClick={onAccept}>
          JA, JEG ER MED
        </button>
      )}

      <a className="hw-btn hw-btn--cal w-full text-center" href="/halloween/invite.ics">
        LEGG TIL I KALENDER
      </a>
    </div>
  );
}
