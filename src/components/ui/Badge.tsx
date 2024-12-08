interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info';
}

export default function Badge({ children, variant = 'info' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}