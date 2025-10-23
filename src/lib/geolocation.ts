export interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Fetches user's location using IP-based geolocation
 * NO PERMISSION REQUIRED - Works silently in the background
 * Uses ipapi.co free API (1000 requests/day, no API key needed)
 */
export async function fetchLocationByIP(): Promise<LocationData | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    return {
      city: data.city || "",
      state: data.region || "",
      country: data.country_name || "",
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error("Error fetching location by IP:", error);
    
    // Fallback to another IP geolocation service
    try {
      const fallbackResponse = await fetch('https://api.bigdatacloud.net/data/ip-geolocation?key=bdc_4d3b3e3e3e3e3e3e3e3e3e3e3e3e3e3e');
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return {
          city: fallbackData.location?.city || "",
          state: fallbackData.location?.principalSubdivision || "",
          country: fallbackData.country?.name || "",
          latitude: fallbackData.location?.latitude,
          longitude: fallbackData.location?.longitude,
        };
      }
    } catch (fallbackError) {
      console.error("Fallback location fetch failed:", fallbackError);
    }
    
    return null;
  }
}

/**
 * Automatically fetches location without asking for permission
 * Uses IP-based geolocation - completely silent, no user interaction needed
 */
export async function autoFetchLocation(): Promise<LocationData | null> {
  return fetchLocationByIP();
}
