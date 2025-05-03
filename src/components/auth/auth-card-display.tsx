import TaniTrackCard from '@/components/tani-card/tani-card';

interface AuthCardDisplayProps {
  userType: string;
}

export function AuthCardDisplay({ userType }: AuthCardDisplayProps) {
  return (
    <div className="mt-8 flex justify-center">
      {userType === 'petani' ? (
        <TaniTrackCard name="AGUS SURYANA" taniId={230599} />
      ) : (
        <TaniTrackCard name="PT PANGAN SEJAHTERA" taniId={451022} />
      )}
    </div>
  );
}
