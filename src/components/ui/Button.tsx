type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-4';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    primary: 'bg-[#2d3192] text-white hover:bg-[#253085] hover:opacity-90 focus:ring-blue-100 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-50 cursor-pointer',
    outline: 'border-2 border-[#2d3192] text-[#2d3192] hover:bg-[#2d3192] hover:text-white hover:opacity-90 focus:ring-blue-100 cursor-pointer transition-all duration-200'
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}