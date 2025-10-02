interface BadgeProps {
  icon?: string;
  label: string;
  highlight?: boolean;
}

export const Badge = ({ icon, label, highlight = false }: BadgeProps) => (
  <div className={`badge ${highlight ? 'badge--highlight' : ''}`}>
    {icon ? <img src={icon} alt="" aria-hidden /> : null}
    <span>{label}</span>
  </div>
);
