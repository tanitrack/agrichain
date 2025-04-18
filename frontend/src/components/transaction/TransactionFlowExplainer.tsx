
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  Truck,
  ShoppingBag,
  HandCoins,
} from "lucide-react";

interface TransactionFlowExplainerProps {
  currentStatus: string;
}

export const TransactionFlowExplainer = ({
  currentStatus,
}: TransactionFlowExplainerProps) => {
  const { t } = useLanguage();

  // Define the flow steps
  const flowSteps = [
    {
      id: "menunggu_konfirmasi",
      icon: <Clock className="h-8 w-8 text-earth-brown" />,
      title: t("flow.pending.title"),
      description: t("flow.pending.description"),
      badge: t("status.pending"),
      badgeClass: "bg-earth-wheat text-earth-brown",
    },
    {
      id: "dikonfirmasi",
      icon: <CheckCircle2 className="h-8 w-8 text-earth-brown" />,
      title: t("flow.confirmed.title"),
      description: t("flow.confirmed.description"),
      badge: t("status.confirmed"),
      badgeClass: "bg-earth-light-brown text-earth-brown",
    },
    {
      id: "negosiasi",
      icon: <HandCoins className="h-8 w-8 text-earth-brown" />,
      title: t("flow.negotiating.title"),
      description: t("flow.negotiating.description"),
      badge: t("status.negotiating"),
      badgeClass: "bg-earth-clay text-earth-brown",
    },
    {
      id: "dibayar",
      icon: <DollarSign className="h-8 w-8 text-earth-medium-green" />,
      title: t("flow.paid.title"),
      description: t("flow.paid.description"),
      badge: t("status.paid"),
      badgeClass: "bg-earth-light-green text-earth-dark-green",
    },
    {
      id: "persiapan_pengiriman",
      icon: <Package className="h-8 w-8 text-earth-medium-green" />,
      title: t("flow.processing.title"),
      description: t("flow.processing.description"),
      badge: t("status.processing"),
      badgeClass: "bg-earth-light-green/70 text-earth-dark-green",
    },
    {
      id: "sedang_dikirim",
      icon: <Truck className="h-8 w-8 text-earth-medium-green" />,
      title: t("flow.shipping.title"),
      description: t("flow.shipping.description"),
      badge: t("status.shipping"),
      badgeClass: "bg-earth-medium-green/30 text-earth-dark-green",
    },
    {
      id: "sudah_dikirim",
      icon: <Truck className="h-8 w-8 text-earth-medium-green" />,
      title: t("flow.shipped.title"),
      description: t("flow.shipped.description"),
      badge: t("status.shipped"),
      badgeClass: "bg-earth-medium-green/60 text-earth-dark-green",
    },
    {
      id: "diterima",
      icon: <Package className="h-8 w-8 text-earth-dark-green" />,
      title: t("flow.received.title"),
      description: t("flow.received.description"),
      badge: t("status.received"),
      badgeClass: "bg-earth-medium-green/90 text-white",
    },
    {
      id: "selesai",
      icon: <ShoppingBag className="h-8 w-8 text-earth-dark-green" />,
      title: t("flow.completed.title"),
      description: t("flow.completed.description"),
      badge: t("status.completed"),
      badgeClass: "bg-earth-dark-green text-white",
    },
  ];

  // Find the current step index
  const currentStepIndex = flowSteps.findIndex(
    (step) => step.id === currentStatus
  );

  return (
    <Card className="earth-card-moss overflow-hidden">
      <CardHeader className="earth-header-moss pb-3">
        <CardTitle className="text-white">{t("flow.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <p className="text-earth-medium-green">{t("flow.subtitle")}</p>

          <div className="space-y-6">
            {flowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex ${
                  currentStepIndex === index
                    ? "bg-earth-light-green/10 border-2 border-earth-light-green rounded-lg p-3"
                    : ""
                }`}
              >
                <div className="mr-4 flex flex-col items-center">
                  <div
                    className={`rounded-full p-2 flex items-center justify-center ${
                      index <= currentStepIndex
                        ? "bg-earth-pale-green"
                        : "bg-gray-100"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-6 my-1 ${
                        index < currentStepIndex
                          ? "bg-earth-medium-green"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3
                      className={`font-medium text-lg ${
                        index <= currentStepIndex
                          ? "text-earth-dark-green"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <Badge className={`ml-2 ${step.badgeClass}`}>
                      {step.badge}
                    </Badge>
                    {currentStepIndex === index && (
                      <Badge className="ml-2 bg-earth-wheat text-earth-brown">
                        {t("flow.current")}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`mt-1 ${
                      index <= currentStepIndex
                        ? "text-earth-medium-green"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-earth-light-green/10 p-4 rounded-lg">
            <h4 className="font-medium text-earth-dark-green mb-2">
              {t("flow.helpTitle")}
            </h4>
            <p className="text-earth-medium-green text-sm">
              {t("flow.helpText")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
