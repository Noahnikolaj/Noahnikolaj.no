import { skillGroups, skillIcons } from "@/content/cv";

export function SkillsSection() {
  return (
    <section aria-labelledby="kompetanse">
      <h2 id="kompetanse" className="font-display text-2xl sm:text-3xl">
        Verktøy jeg bruker
      </h2>

      <div className="mt-8 space-y-7">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-bold">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const Icon = skillIcons[skill];
                return (
                  <li
                    key={skill}
                    className="flex items-center gap-2 border-4 border-foreground bg-card px-3 py-1 text-sm font-bold"
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
