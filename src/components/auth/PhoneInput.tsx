interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    let formatted = '';
    
    // Format: XXX XXXX XXX
    if (input.length <= 3) {
      formatted = input;
    } else if (input.length <= 7) {
      formatted = `${input.slice(0, 3)} ${input.slice(3)}`;
    } else {
      formatted = `${input.slice(0, 3)} ${input.slice(3, 7)} ${input.slice(7, 10)}`;
    }
    
    onChange(formatted);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <img
          src="https://flagcdn.com/gh.svg"
          alt="Ghana flag"
          className="w-6 h-4 rounded"
        />
      </div>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-14 pr-4 py-3.5 rounded-lg border border-gray-200 
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                 transition-all text-lg font-medium"
        maxLength={12}
      />
    </div>
  );
}