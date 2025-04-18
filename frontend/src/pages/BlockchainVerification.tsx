
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { BlockchainCard, BlockchainCardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, Blocks, FileText, Package, Clock, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";

// This would be replaced with actual blockchain verification API call
const mockBlockchainData = {
  transactionHash: "0x8e23c90e34d6b3f51cb9806dbf147131436590f8661f98f6f9bdaf4c0f8d35b8",
  blockNumber: 15784321,
  timestamp: "2025-04-05T14:30:00Z",
  confirmations: 432,
  status: "success",
  from: "0x1Ff7F7a359b3a8C266fD5A377eB9F2680ea5BB41",
  to: "0x7C3591D5e85977594eB297ef71628D13c6aB5983",
  gasUsed: 21000,
  gasPrice: "20 Gwei",
  events: [
    {
      event: "Transfer",
      timestamp: "2025-04-05T14:30:00Z",
      details: "Commodity ownership transferred from Farm to Distributor"
    },
    {
      event: "QualityCheck",
      timestamp: "2025-04-04T10:15:00Z",
      details: "Quality check passed with grade: Premium"
    },
    {
      event: "Harvest",
      timestamp: "2025-04-03T08:45:00Z",
      details: "Product harvested at Farm location"
    }
  ]
};

const getItemIcon = (type: string) => {
  switch (type) {
    case "komoditas":
      return <Package className="h-5 w-5" />;
    case "transaksi":
      return <ShoppingCart className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const BlockchainVerification = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBlockchainData(mockBlockchainData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [type, id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-earth-medium-green animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-earth-pale-green flex items-center justify-center">
              <Blocks className="h-6 w-6 text-earth-medium-green" />
            </div>
          </div>
          <p className="mt-4 text-earth-medium-green">
            {t("language") === "id" ? "Memverifikasi di blockchain..." : "Verifying on blockchain..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("action.back")}
        </Button>
        <h1 className="text-2xl font-bold text-earth-dark-green">
          {t("language") === "id" ? "Verifikasi Blockchain" : "Blockchain Verification"}
        </h1>
        <p className="text-earth-medium-green">
          {t("language") === "id" ? `Detail transaksi ${type} dengan ID ${id}` : `Blockchain details for ${type} with ID ${id}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BlockchainCard>
            <BlockchainCardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Blocks className="h-5 w-5" />
                {t("language") === "id" ? "Detail Blockchain" : "Blockchain Details"}
              </CardTitle>
            </BlockchainCardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-earth-pale-green/50 p-3 rounded-lg">
                  <p className="text-sm text-earth-medium-green font-medium">
                    {t("language") === "id" ? "ID Transaksi" : "Transaction ID"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-earth-dark-green text-sm truncate">
                      {blockchainData.transactionHash.slice(0, 16)}...{blockchainData.transactionHash.slice(-8)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(blockchainData.transactionHash);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="bg-earth-pale-green/50 p-3 rounded-lg">
                  <p className="text-sm text-earth-medium-green font-medium">
                    {t("language") === "id" ? "Nomor Blok" : "Block Number"}
                  </p>
                  <p className="font-mono text-earth-dark-green">{blockchainData.blockNumber.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-earth-light-green/10 p-3 rounded-lg">
                  <p className="text-sm text-earth-medium-green font-medium">
                    {t("language") === "id" ? "Tanggal & Waktu" : "Timestamp"}
                  </p>
                  <p className="text-earth-dark-green">{formatDate(new Date(blockchainData.timestamp))}</p>
                </div>
                <div className="bg-earth-light-green/10 p-3 rounded-lg">
                  <p className="text-sm text-earth-medium-green font-medium">
                    {t("language") === "id" ? "Status" : "Status"}
                  </p>
                  <p className="text-green-600 font-medium capitalize">{blockchainData.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-earth-wheat/20 p-3 rounded-lg">
                  <p className="text-sm text-earth-brown font-medium">
                    {t("language") === "id" ? "Dari" : "From"}
                  </p>
                  <p className="font-mono text-earth-dark-green text-sm truncate">{blockchainData.from}</p>
                </div>
                <div className="bg-earth-wheat/20 p-3 rounded-lg">
                  <p className="text-sm text-earth-brown font-medium">
                    {t("language") === "id" ? "Ke" : "To"}
                  </p>
                  <p className="font-mono text-earth-dark-green text-sm truncate">{blockchainData.to}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-earth-wheat/10 p-3 rounded-lg">
                  <p className="text-sm text-earth-brown font-medium">
                    {t("language") === "id" ? "Gas Digunakan" : "Gas Used"}
                  </p>
                  <p className="text-earth-dark-green">{blockchainData.gasUsed.toLocaleString()}</p>
                </div>
                <div className="bg-earth-wheat/10 p-3 rounded-lg">
                  <p className="text-sm text-earth-brown font-medium">
                    {t("language") === "id" ? "Harga Gas" : "Gas Price"}
                  </p>
                  <p className="text-earth-dark-green">{blockchainData.gasPrice}</p>
                </div>
              </div>

              <Button variant="tracking" className="w-full gap-2">
                <LinkIcon className="h-4 w-4" />
                {t("language") === "id" ? "Lihat di Blockchain Explorer" : "View on Blockchain Explorer"}
              </Button>
            </CardContent>
          </BlockchainCard>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-earth-dark-green mb-4">
              {t("language") === "id" ? "Jejak Rantai Pasok" : "Supply Chain Trail"}
            </h2>
            <div className="space-y-4">
              {blockchainData.events.map((event: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start bg-white rounded-lg border-2 border-earth-light-green/40 p-4 transition-all hover:shadow-md"
                >
                  <div className="mr-4 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-earth-pale-green flex items-center justify-center">
                      {index === 0 ? (
                        <LinkIcon className="h-5 w-5 text-earth-dark-green" />
                      ) : index === 1 ? (
                        <FileText className="h-5 w-5 text-earth-dark-green" />
                      ) : (
                        <Package className="h-5 w-5 text-earth-dark-green" />
                      )}
                    </div>
                    {index < blockchainData.events.length - 1 && (
                      <div className="w-0.5 bg-earth-light-green h-full mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-earth-dark-green">{event.event}</h3>
                      <div className="flex items-center gap-1 text-earth-medium-green text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(new Date(event.timestamp))}</span>
                      </div>
                    </div>
                    <p className="text-earth-medium-green mt-1">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BlockchainCard>
            <BlockchainCardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getItemIcon(type || "")}
                {t("language") === "id" ? "Detail Item" : "Item Details"}
              </CardTitle>
            </BlockchainCardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="bg-earth-pale-green/50 p-3 rounded-lg">
                <p className="text-sm text-earth-medium-green font-medium">
                  {t("language") === "id" ? "Tipe" : "Type"}
                </p>
                <p className="text-earth-dark-green capitalize">{type}</p>
              </div>
              <div className="bg-earth-pale-green/50 p-3 rounded-lg">
                <p className="text-sm text-earth-medium-green font-medium">
                  {t("language") === "id" ? "ID" : "ID"}
                </p>
                <p className="font-mono text-earth-dark-green">{id}</p>
              </div>
              <div className="bg-earth-light-green/20 p-3 rounded-lg">
                <p className="text-sm text-earth-medium-green font-medium">
                  {t("language") === "id" ? "Konfirmasi" : "Confirmations"}
                </p>
                <p className="text-earth-dark-green">{blockchainData.confirmations} {t("language") === "id" ? "blok" : "blocks"}</p>
              </div>

              <Button 
                variant="outline"
                className="w-full border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20"
                onClick={() => navigate(`/${type}/${id}`)}
              >
                {getItemIcon(type || "")}
                {t("language") === "id" ? `Lihat Detail ${type}` : `View ${type} Details`}
              </Button>
            </CardContent>
          </BlockchainCard>

          <BlockchainCard>
            <BlockchainCardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {t("language") === "id" ? "Verifikasi QR" : "QR Verification"}
              </CardTitle>
            </BlockchainCardHeader>
            <CardContent className="p-5 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4 w-48 h-48 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-earth-dark-green"
                  fill="currentColor"
                >
                  <path d="M0,0 L40,0 L40,40 L0,40 Z M10,10 L10,30 L30,30 L30,10 Z M15,15 L25,15 L25,25 L15,25 Z" />
                  <path d="M60,0 L100,0 L100,40 L60,40 Z M70,10 L70,30 L90,30 L90,10 Z M75,15 L85,15 L85,25 L75,25 Z" />
                  <path d="M0,60 L40,60 L40,100 L0,100 Z M10,70 L10,90 L30,90 L30,70 Z M15,75 L25,75 L25,85 L15,85 Z" />
                  <path d="M60,60 L70,60 L70,70 L60,70 Z" />
                  <path d="M90,60 L100,60 L100,70 L90,70 Z" />
                  <path d="M80,70 L90,70 L90,80 L80,80 Z" />
                  <path d="M60,80 L70,80 L70,90 L60,90 Z" />
                  <path d="M70,90 L90,90 L90,100 L70,100 Z" />
                  <path d="M50,0 L50,20 L40,20 L40,50 L50,50 L50,60 L40,60 L40,50 L0,50 L0,40 L50,40 L50,30 L60,30 L60,50 L100,50 L100,60 L60,60 L60,50 L50,50 L50,100 L40,100 L40,90 L50,90 L50,70 L60,70 L60,60 L50,60 Z" />
                </svg>
              </div>
              <Button variant="tracking" className="w-full gap-2" size="sm">
                {t("language") === "id" ? "Unduh Kode QR" : "Download QR Code"}
              </Button>
              <p className="text-xs text-center mt-4 text-earth-medium-green">
                {t("language") === "id" 
                  ? "Pindai kode QR untuk memverifikasi keaslian item ini pada blockchain" 
                  : "Scan the QR code to verify this item's authenticity on the blockchain"}
              </p>
            </CardContent>
          </BlockchainCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlockchainVerification;
