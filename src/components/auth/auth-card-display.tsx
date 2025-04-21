import { TaniTrackCard } from '@/components/custom/tani-track-card';

interface AuthCardDisplayProps {
  userType: string;
}

export function AuthCardDisplay({ userType }: AuthCardDisplayProps) {
  return (
    <div className="mt-8 flex justify-center">
      {userType === 'petani' ? (
        <TaniTrackCard type="farmer" name="AGUS SURYANA" id="F-230599-JB" />
      ) : (
        <TaniTrackCard
          type="buyer"
          name="PT PANGAN SEJAHTERA"
          id="B-451022-JK"
          location="JAKARTA"
          expiryDate="09/2025"
        />
      )}
    </div>
  );
}
