import { NextResponse } from "next/server";

// ReliefWeb API endpoint
const RELIEFWEB_API = "https://api.reliefweb.int/v1/disasters";

interface ReliefWebDisaster {
  id: string;
  fields: {
    name: string;
    type: string[];
    status: string;
    date: {
      created: string;
    };
    country: {
      name: string;
    }[];
    description: string;
    location: {
      coordinates: number[];
    }[];
  };
}

export async function GET() {
  try {
    console.log("Fetching disasters from ReliefWeb API...");

    // Fetch recent disasters from ReliefWeb API
    const response = await fetch(
      `${RELIEFWEB_API}?appname=discentra&profile=list&preset=latest&limit=20`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Discentra/1.0",
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ReliefWeb API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `ReliefWeb API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid data format from ReliefWeb API");
    }

    // Transform ReliefWeb data to our format
    const disasters = data.data.map((item: ReliefWebDisaster) => {
      // Log each item for debugging
      console.log("Processing disaster item:", JSON.stringify(item, null, 2));

      const coordinates = item.fields.location?.[0]?.coordinates || [
        Math.random() * 180 - 90,
        Math.random() * 360 - 180,
      ];

      const transformedDisaster = {
        id: item.id,
        name: item.fields.name,
        type: item.fields.type[0] || "Unknown",
        status: item.fields.status || "Ongoing",
        date: item.fields.date.created,
        countries: item.fields.country.map((c) => c.name),
        description: item.fields.description || "No description available",
        coordinates: {
          lat: coordinates[1], // ReliefWeb uses [longitude, latitude]
          lng: coordinates[0],
        },
      };

      // Log the transformed disaster
      console.log(
        "Transformed disaster:",
        JSON.stringify(transformedDisaster, null, 2)
      );

      return transformedDisaster;
    });

    return NextResponse.json({
      success: true,
      data: disasters,
    });
  } catch (error) {
    console.error("Error in disasters API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch disaster data",
      },
      { status: 500 }
    );
  }
}
