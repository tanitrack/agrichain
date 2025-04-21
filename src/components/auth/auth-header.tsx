import { useLanguage } from '@/contexts/language-context';

interface AuthHeaderProps {
  userType: string;
}

export function AuthHeader({ userType }: AuthHeaderProps) {
  const { language } = useLanguage();

  return (
    <div className="mb-6 flex items-center">
      <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white/90">
        <img
          src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
          alt="TaniTrack Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <h1 className="text-earth-dark-green text-4xl font-bold">TaniTrack</h1>
    </div>
  );
}
