import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  id: string;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  error,
  placeholder = "********",
  id,
  required = false,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        data-testid="password-input"
        onChange={onChange}
        className={`${error ? "border-red-500" : ""} pr-10 text-slate-100 ${className}`}
        required={required}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 text-slate-100 hover:text-slate-300"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </Button>
    </div>
  );
} 