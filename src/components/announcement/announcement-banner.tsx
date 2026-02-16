"use client";
import { useGetActiveAnnouncement } from "@/api/announcement.service";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import Marquee from "react-fast-marquee";
import { isCurrentTimeInRange } from "@/lib/date-utils";

const AnnouncementBanner = () => {
  const { data: announcement, isLoading } = useGetActiveAnnouncement();

  // Don't render if loading, no announcement, or dismissed
  if (isLoading || !announcement) {
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
          bgGradient: "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500",
          textColor: "text-white",
          buttonColor: "text-white/90 hover:text-white",
          icon: <AlertTriangle className="h-4 w-4 text-white" />,
        };
      case "warning":
        return {
          bgGradient: "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400",
          textColor: "text-gray-900",
          buttonColor: "text-gray-800/80 hover:text-gray-900",
          icon: <AlertOctagon className="h-4 w-4 text-gray-900" />,
        };
      case "info":
      default:
        return {
          bgGradient: "bg-gradient-to-r from-purple-500 via-indigo-700 to-purple-500",
          textColor: "text-white",
          buttonColor: "text-white/90 hover:text-white",
          icon: <Info className="h-4 w-4 text-white" />,
        };
    }
  };

  const variant = getVariantStyles(announcement.type);
  return (
    <div className={`w-full ${variant.bgGradient} py-2.5 shadow-sm`}>
      <div className="w-full px-4 lg:px-6">
        <div className={`flex items-center justify-between ${variant.textColor} text-sm font-medium`}>
          <div className="flex-1 text-center font-semibold">
            {announcement.is_scrolling ? (
              <Marquee
                speed={50}
                gradient={false}
                pauseOnHover={true}
                className="font-semibold"
              >
                {announcement.headline}
              </Marquee>
            ) : (
              announcement.headline
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
