interface MatchScoreBadgeProps {
  score: number
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  return <span aria-label={`Match score ${score}%`}>{score}% match</span>
}
