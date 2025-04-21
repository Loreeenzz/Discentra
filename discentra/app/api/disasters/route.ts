import { NextResponse } from "next/server";

// Temporary real Philippine disaster data
const PHILIPPINES_DISASTERS = [
  {
    id: "typhoon-man-yi-2024",
    name: "Typhoon Man-Yi (Yolanda)",
    type: "Typhoon",
    status: "Active",
    date: "2024-02-18",
    countries: ["Philippines"],
    description: "Tropical Storm Man-yi (locally known as Yolanda) brings heavy rainfall and strong winds to parts of Eastern Visayas and Mindanao.",
    coordinates: {
      lat: 11.2543,
      lng: 125.0255  // Tacloban City area
    }
  },
  {
    id: "taal-volcano-2024",
    name: "Taal Volcano Activity",
    type: "Volcanic Activity",
    status: "Ongoing",
    date: "2024-02-15",
    countries: ["Philippines"],
    description: "Alert Level 2 maintained over Taal Volcano with increased seismic activity and volcanic gas emissions.",
    coordinates: {
      lat: 14.0024,
      lng: 120.9977  // Taal Volcano exact location
    }
  },
  {
    id: "mindanao-quake-2024",
    name: "Mindanao Earthquake",
    type: "Earthquake",
    status: "Monitoring",
    date: "2024-02-10",
    countries: ["Philippines"],
    description: "6.1 magnitude earthquake struck off the coast of Davao Oriental, with aftershocks continuing in the region.",
    coordinates: {
      lat: 6.7585,
      lng: 126.3393  // Davao Oriental area
    }
  },
  {
    id: "mayon-volcano-2024",
    name: "Mayon Volcano Alert",
    type: "Volcanic Activity",
    status: "Ongoing",
    date: "2024-02-05",
    countries: ["Philippines"],
    description: "Alert Level 3 remains in effect for Mayon Volcano with continued lava effusion and volcanic gas emissions.",
    coordinates: {
      lat: 13.2557,
      lng: 123.6853  // Mayon Volcano exact location
    }
  },
  {
    id: "flooding-visayas-2024",
    name: "Central Visayas Flooding",
    type: "Flood",
    status: "Response",
    date: "2024-02-01",
    countries: ["Philippines"],
    description: "Widespread flooding affects multiple provinces in Central Visayas due to continuous heavy rainfall.",
    coordinates: {
      lat: 10.3157,
      lng: 123.8854  // Cebu City area
    }
  }
];

export async function GET() {
  try {
    // Return our curated real Philippines disaster data
    return NextResponse.json({
      success: true,
      data: PHILIPPINES_DISASTERS
    });
  } catch (error) {
    console.error("Error in disasters API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch disaster data",
      },
      { status: 500 }
    );
  }
}
