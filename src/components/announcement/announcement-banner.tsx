"use client";

import { useGetActiveAnnouncement } from "@/api/announcement.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertOctagon, AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { isCurrentTimeInRange } from "@/lib/date-utils";

const AnnouncementBanner = () => {
  const { data: announcement, isLoading } = useGetActiveAnnouncement();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't render if loading, no announcement, or dismissed
  if (isLoading || !announcement || isDismissed) {
    return null;
  }

  // Check if announcement is currently active based on dates (using IST)
  if (!announcement.is_active || !isCurrentTimeInRange(announcement.start_date, announcement.end_date)) {
    return null;
  }

  const getVariantStyles = (type: string) => {
    switch (type) {
      case "danger":
        return {
          className: "border-[#ff0000] bg-[#ff0000]/5 text-[#ff0000]",
          textColor: "text-[#ff0000]",
          icon: <AlertTriangle className="h-4 w-4 text-[#ff0000]" />,
        };
      case "warning":
        return {
          className: "border-yellow-600 bg-yellow-50 text-yellow-600",
          textColor: "text-yellow-800",
          icon: <AlertOctagon className="h-4 w-4 text-yellow-800" />,
        };
      case "info":
      default:
        return {
          className: "border-indigo-600 bg-indigo-50 text-indigo-700",
          textColor: "text-indigo-800",
          icon: <Info className="h-4 w-4 text-indigo-700" />,
        };
    }
  };

  const variant = getVariantStyles(announcement.type);
  return (
    <div className="w-full">
      <Alert className={cn("rounded-none border-x-0 relative", variant.className)}>
        {variant.icon}
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex-1">
            {announcement.is_scrolling ? (
              <Marquee
                speed={50}
                gradient={false}
                pauseOnHover={true}
                className={cn("font-medium", variant.textColor)}
              >
                {announcement.headline}
              </Marquee>
            ) : (
              <div className={cn("text-center font-medium", variant.textColor)}>
                {announcement.headline}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-4 hover:opacity-70 transition-opacity flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AnnouncementBanner;
