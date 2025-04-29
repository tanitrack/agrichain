import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import {
  ClipboardList,
  CheckCircle,
  DollarSign,
  MessageCircle,
  FileCheck,
  FileSignature,
  History,
  UserCircle,
} from 'lucide-react';

interface TransactionFlowGuideProps {
  currentStep: string;
}

export const TransactionFlowGuide = ({ currentStep }: TransactionFlowGuideProps) => {
  const { t, language } = useLanguage();

  // Define the flow steps for regular transactions
  const flowSteps = [
    {
      id: 'login',
      icon: <UserCircle className="h-8 w-8 text-earth-brown" />,
      title: language === 'id' ? '1. Login' : '1. Login',
      description:
        language === 'id'
          ? 'Masuk ke akun petani Anda untuk mengakses transaksi.'
          : 'Sign in to your farmer account to access transactions.',
    },
    {
      id: 'review',
      icon: <ClipboardList className="h-8 w-8 text-earth-brown" />,
      title: language === 'id' ? '1. Peninjauan Pesanan' : '2. Order Review',
      description:
        language === 'id'
          ? 'Tinjau pesanan dari pembeli, termasuk jenis komoditas, kuantitas, dan detail lainnya.'
          : 'Review orders from buyers, including commodity type, quantity, and other details.',
    },
    {
      id: 'approve',
      icon: <CheckCircle className="h-8 w-8 text-earth-brown" />,
      title: language === 'id' ? '2. Setujui Transaksi' : '3. Approve Transaction',
      description:
        language === 'id'
          ? "Klik tombol 'Konfirmasi Transaksi' untuk menyetujui pesanan dari pembeli."
          : "Click the 'Confirm Transaction' button to approve the order from the buyer.",
    },
    {
      id: 'price_setting',
      icon: <DollarSign className="h-8 w-8 text-earth-medium-green" />,
      title: language === 'id' ? '3. Pengaturan Harga' : '4. Price Setting',
      description:
        language === 'id'
          ? 'Setelah disetujui, Anda akan diarahkan ke halaman transaksi untuk mengatur harga.'
          : "After approval, you'll be redirected to the transaction page to set the price.",
    },
    {
      id: 'negotiation',
      icon: <MessageCircle className="h-8 w-8 text-earth-medium-green" />,
      title: language === 'id' ? '4. Negosiasi Harga' : '5. Price Negotiation',
      description:
        language === 'id'
          ? 'Diskusikan dan negosiasikan harga dengan pembeli melalui WhatsApp.'
          : 'Discuss and negotiate the price with the buyer through WhatsApp.',
    },
    {
      id: 'price_input',
      icon: <FileCheck className="h-8 w-8 text-earth-medium-green" />,
      title: language === 'id' ? '5. Input Harga Final' : '6. Final Price Input',
      description:
        language === 'id'
          ? 'Setelah negosiasi, masukkan harga yang disepakati dalam formulir di halaman detail transaksi.'
          : 'After negotiation, input the agreed price in the form on the transaction detail page.',
    },
    {
      id: 'agreement',
      icon: <FileSignature className="h-8 w-8 text-earth-dark-green" />,
      title: language === 'id' ? '6. Persetujuan & Tanda Tangan' : '7. Agreement & Signature',
      description:
        language === 'id'
          ? 'Setelah pembeli menyetujui Terms & Conditions, Anda perlu mengupload tanda tangan untuk finalisasi.'
          : 'After the buyer approves Terms & Conditions, you need to upload your signature for finalization.',
    },
    {
      id: 'complete',
      icon: <History className="h-8 w-8 text-earth-dark-green" />,
      title: language === 'id' ? '7. Riwayat Transaksi' : '8. Transaction History',
      description:
        language === 'id'
          ? 'Transaksi yang diselesaikan akan muncul di riwayat transaksi Anda.'
          : 'Completed transactions will appear in your transaction history.',
    },
  ];

  // Map from transaction status to step ID
  const statusToStepMap: Record<string, string> = {
    menunggu_konfirmasi: 'review',
    dikonfirmasi: 'price_setting',
    negosiasi: 'negotiation',
    dibayar: 'agreement',
    persiapan_pengiriman: 'complete',
    sedang_dikirim: 'complete',
    sudah_dikirim: 'complete',
    diterima: 'complete',
    selesai: 'complete',
  };

  // Get current step index based on current status
  const currentStepId = statusToStepMap[currentStep] || currentStep || 'login';
  const currentStepIndex = flowSteps.findIndex((step) => step.id === currentStepId);

  return (
    <Card className=" overflow-hidden">
      <CardHeader className="earth-header-moss pb-3">
        <CardTitle className="text-white">
          {language === 'id' ? 'Panduan Alur Transaksi' : 'Transaction Flow Guide'}
        </CardTitle>
        <p className="text-sm text-gray-300">
          {language === 'id'
            ? 'Berikut adalah langkah-langkah dalam proses transaksi reguler:'
            : 'Here are the steps in the regular transaction process:'}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-6">
            {flowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex ${
                  currentStepIndex === index
                    ? 'rounded-lg border-2 border-earth-light-green bg-earth-light-green/10 p-3'
                    : ''
                }`}
              >
                <div className="mr-4 flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center rounded-full p-2 ${
                      index <= currentStepIndex ? 'bg-earth-pale-green' : 'bg-gray-100'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div
                      className={`my-1 h-6 w-0.5 ${
                        index < currentStepIndex ? 'bg-earth-medium-green' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3
                      className={`text-lg font-medium ${
                        index <= currentStepIndex ? 'text-earth-dark-green' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {currentStepIndex === index && (
                      <span className="ml-2 rounded-full bg-earth-wheat px-2 py-1 text-xs text-earth-brown">
                        {language === 'id' ? 'Langkah Saat Ini' : 'Current Step'}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 ${
                      index <= currentStepIndex ? 'text-earth-medium-green' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-earth-light-green/10 p-4">
            <h4 className="mb-2 font-medium text-earth-dark-green">
              {language === 'id' ? 'Butuh bantuan?' : 'Need help?'}
            </h4>
            <p className="text-sm text-earth-medium-green">
              {language === 'id'
                ? 'Jika Anda memerlukan bantuan dengan transaksi Anda, silakan hubungi tim dukungan kami melalui WhatsApp atau telepon.'
                : 'If you need assistance with your transaction, please contact our support team via WhatsApp or phone.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFlowGuide;
