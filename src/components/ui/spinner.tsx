import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
}

export function Spinner({
  size = "md",
  variant = "default",
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
    xl: "h-[5rem] w-[5rem] border-4",
  };

  const variantClasses = {
    default: "border-earth-medium-green/30 border-t-earth-medium-green",
    primary: "border-white/30 border-t-white",
    secondary: "border-earth-dark-green/30 border-t-earth-dark-green",
  };

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
