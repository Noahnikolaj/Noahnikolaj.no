import { skillGroups, skillIcons } from "@/content/cv";

export function SkillsSection() {
  return (
    <section aria-labelledby="kompetanse">
      <h2 id="kompetanse" className="font-display text-2xl sm:text-3xl">
        Verktøy jeg bruker
      </h2>

      {/* An inventory: each group is a slot with what is in it. */}
      <div className="skill-grid mt-8">
        {skillGroups.map((group) => (
          <div key={group.title} className="skill-slot ps-well">
            <h3 className="skill-slot-title">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const Icon = skillIcons[skill];
                return (
                  <li
                    key={skill}
                    className="ps-chip"
                  >
                    {Icon ? (
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : null}
                    {skill}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
