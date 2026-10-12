interface SkillGapChartProps {
  skills: string[]
}

export function SkillGapChart({ skills }: SkillGapChartProps) {
  return (
    <section aria-label="Skills to develop">
      <h2>Skills to develop</h2>
      <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
    </section>
  )
}
