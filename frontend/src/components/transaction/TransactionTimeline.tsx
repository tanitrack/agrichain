
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { TransactionStatus } from "@/lib/data/types";

interface TimelineEvent {
  date: Date;
  status: TransactionStatus;
  description: string;
}

export interface TransactionTimelineProps {
  history: TimelineEvent[];
  currentStatus: TransactionStatus;
}

export const TransactionTimeline = ({ history, currentStatus }: TransactionTimelineProps) => {
  const { language } = useLanguage();
  
  // Ensure we have a valid history array to work with
  const timelineEvents = Array.isArray(history) && history.length > 0 
    ? history 
    : [];
  
  // The order of statuses for our timeline
  const statusOrder: TransactionStatus[] = [
    "menunggu_konfirmasi",
    "dikonfirmasi",
    "negosiasi",
    "dibayar",
    "persiapan_pengiriman",
    "sedang_dikirim",
    "sudah_dikirim",
    "diterima",
    "selesai"
  ];
  
  // Find the current step index
  const currentStepIndex = statusOrder.findIndex(
    (step) => step === currentStatus
  );

  console.log("Timeline props:", { history, currentStatus, currentStepIndex, timelineEvents });
  
  if (timelineEvents.length === 0) {
    return (
      <Card className="earth-card-clay overflow-hidden">
        <CardHeader className="earth-header-clay pb-3">
          <CardTitle className="text-white">
            {language === "id" ? "Linimasa Transaksi" : "Transaction Timeline"}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-center py-4">
            <p className="text-earth-brown">
              {language === "id" ? "Belum ada riwayat." : "No timeline events available."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="earth-card-clay overflow-hidden">
      <CardHeader className="earth-header-clay pb-3">
        <CardTitle className="text-white">
          {language === "id" ? "Linimasa Transaksi" : "Transaction Timeline"}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          {timelineEvents.map((event, index) => {
            // Check if this status is past, current, or future based on the current status
            const eventStatusIndex = statusOrder.findIndex(status => status === event.status);
            const isPast = eventStatusIndex < currentStepIndex;
            const isCurrent = event.status === currentStatus;
            const isFuture = eventStatusIndex > currentStepIndex;
            
            // Determine colors based on status
            const dotColorClass = isCurrent 
              ? "bg-earth-medium-green" 
              : isPast 
                ? "bg-earth-dark-green" 
                : "bg-gray-300";
            
            const lineColorClass = isPast 
              ? "bg-earth-medium-green" 
              : "bg-gray-200";
            
            const textColorClass = isFuture 
              ? "text-gray-400" 
              : "text-earth-dark-green";
            
            const dateColorClass = isFuture 
              ? "text-gray-400" 
              : "text-earth-brown";
              
            return (
              <div key={index} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className={`w-4 h-4 ${dotColorClass} rounded-full flex items-center justify-center`}>
                    {isCurrent && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className={`w-0.5 ${lineColorClass} h-full mt-1`}></div>
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className={`font-medium ${textColorClass}`}>
                        {event.description}
                      </p>
                      {isCurrent && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-earth-wheat text-earth-brown rounded-full">
                          {language === "id" ? "Saat ini" : "Current"}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${dateColorClass}`}>{formatDate(event.date)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTimeline;
