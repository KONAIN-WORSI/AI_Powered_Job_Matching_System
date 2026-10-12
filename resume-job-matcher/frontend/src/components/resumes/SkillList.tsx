interface SkillListProps {
  skills: string[]
}

export function SkillList({ skills }: SkillListProps) {
  return (
    <ul>
      {skills.map((skill) => <li key={skill}>{skill}</li>)}
    </ul>
  )
}
