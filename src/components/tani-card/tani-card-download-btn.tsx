import React from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TaniCardDownloadBtnProps {
  cardRef: React.RefObject<HTMLElement | HTMLDivElement>;
  filename?: string;
}

export const TaniCardDownloadBtn: React.FC<TaniCardDownloadBtnProps> = ({
  cardRef,
  filename = 'tani-card.png',
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      alert('Failed to download card. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="default"
      onClick={handleDownload}
      disabled={loading}
      title="Download Card as Image"
      className="gap-2"
    >
      <Download className="h-5 w-5" />
      <span>Download Card</span>
    </Button>
  );
};
