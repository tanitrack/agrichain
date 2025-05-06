import TaniTrackCard from '@/components/tani-card/tani-card';

export function AuthCardDisplay() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="relative mx-auto h-60 w-72">
        {/* Front card (Farmer card) */}
        <div className="absolute -left-32 rotate-6">
          <TaniTrackCard userType="consumer" />
        </div>
        <div className="absolute -rotate-6">
          <TaniTrackCard userType="farmer" />
        </div>
      </div>
    </div>
  );
}
