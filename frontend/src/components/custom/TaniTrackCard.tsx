
import React from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Leaf } from "lucide-react";

interface TaniTrackCardProps {
  type: "farmer" | "buyer";
  name: string;
  id: string;
  location?: string;
  expiryDate?: string;
  className?: string;
  isStacked?: boolean;
  stackPosition?: "front" | "back";
}

export function TaniTrackCard({
  type,
  name,
  id,
  location,
  expiryDate,
  className,
  isStacked = false,
  stackPosition = "front",
}: TaniTrackCardProps) {
  return (
    <div 
      className={cn(
        "relative", 
        isStacked && stackPosition === "back" && "absolute top-0 left-0 transform rotate-6 translate-y-4 translate-x-6 z-0",
        className
      )}
    >
      <div
        className={cn(
          "w-72 h-44 rounded-xl shadow-lg p-5 relative overflow-hidden transform transition-all duration-300",
          !isStacked && "hover:scale-105",
          type === "farmer" 
            ? "bg-earth-dark-green text-white" 
            : "bg-yellow-600 text-white"
        )}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-medium uppercase opacity-80">
              {type === "farmer" ? "FARMER ID" : "BUYER ID"}
            </p>
            <h2 className="text-lg font-bold mt-1">TANITRACK</h2>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            type === "farmer" ? "bg-white/20" : "bg-yellow-500/50"
          )}>
            {type === "farmer" ? (
              <Leaf className="w-5 h-5 text-white" />
            ) : (
              <CreditCard className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Card Chip/Stripe (visual element) */}
        <div
          className={cn(
            "w-full h-10 rounded-md bg-opacity-20 mb-3",
            type === "farmer" ? "bg-white/10" : "bg-black/10"
          )}
        ></div>

        {/* Card Info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase opacity-80">NAMA</p>
            <p className="text-sm font-bold mt-0.5">{name}</p>
          </div>

          {location && (
            <div className="absolute right-5 top-[107px]">
              <p className="text-xs font-medium uppercase opacity-80">LOKASI</p>
              <p className="text-sm font-bold mt-0.5">{location}</p>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase opacity-80">ID</p>
              <p className="text-sm font-bold mt-0.5">{id}</p>
            </div>

            {expiryDate && (
              <div>
                <p className="text-xs font-medium uppercase opacity-80">AKTIF HINGGA</p>
                <p className="text-sm font-bold mt-0.5">{expiryDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Background pattern for visual effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white rounded-full" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
