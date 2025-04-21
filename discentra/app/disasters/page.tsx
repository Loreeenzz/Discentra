"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, RefreshCw, AlertCircle } from "lucide-react";

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import("@/components/map"), { ssr: false });

interface Disaster {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
  countries: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function DisastersPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/disasters");
      const data = await response.json();

      console.log("API Response:", data);

      if (data.success) {
        // Validate the data structure
        const validatedDisasters = data.data.map((disaster: any) => {
          console.log("Processing disaster:", disaster);

          // Ensure all required fields are present and properly formatted
          return {
            id: String(disaster.id || "unknown"),
            name: String(disaster.name || "Unknown Disaster"),
            type: String(disaster.type || "Unknown"),
            status: String(disaster.status || "Ongoing"),
            date: String(disaster.date || new Date().toISOString()),
            countries: Array.isArray(disaster.countries)
              ? disaster.countries.map((c: any) =>
                  String(c || "Unknown Country")
                )
              : ["Unknown Location"],
            description: String(
              disaster.description || "No description available"
            ),
            coordinates: {
              lat: Number(disaster.coordinates?.lat) || 0,
              lng: Number(disaster.coordinates?.lng) || 0,
            },
          };
        });

        console.log("Validated disasters:", validatedDisasters);
        setDisasters(validatedDisasters);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error(data.error || "Failed to fetch disaster data");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching disaster data";
      setError(errorMessage);
      console.error("Error fetching disasters:", err);

      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchDisasters();
        }, 5000); // Retry after 5 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDisasters();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDisasters, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading && disasters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Loading disaster data...
          </p>
        </div>
      </div>
    );
  }

  if (error && disasters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Error Loading Data
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          {retryCount < 3 && (
            <p className="text-sm text-muted-foreground">
              Retrying in {5 - retryCount} seconds... (Attempt {retryCount + 1}
              /3)
            </p>
          )}
          <button
            onClick={fetchDisasters}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Global Disasters</h1>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          )}
          <button
            onClick={fetchDisasters}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              loading ? "animate-spin" : ""
            }`}
            title="Refresh data"
            disabled={loading}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
          <div>
            <p className="text-red-500 font-medium">Error: {error}</p>
            <p className="text-sm text-muted-foreground">
              Showing last known data. The map will update when the connection
              is restored.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Map disasters={disasters} onDisasterSelect={setSelectedDisaster} />
          </div>
        </div>

        {/* Disaster List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recent Disasters</h2>
          {disasters.map((disaster) => (
            <Card
              key={disaster.id}
              className={`cursor-pointer transition-all ${
                selectedDisaster?.id === disaster.id
                  ? "border-red-500"
                  : "hover:border-red-300"
              }`}
              onClick={() => setSelectedDisaster(disaster)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">{disaster.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {disaster.type} • {disaster.countries.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(disaster.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Disaster Details */}
      {selectedDisaster && (
        <div className="fixed bottom-4 right-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold">{selectedDisaster.name}</h3>
              <p className="text-sm text-muted-foreground">
                Type: {selectedDisaster.type}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {selectedDisaster.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Countries: {selectedDisaster.countries.join(", ")}
              </p>
              <p className="text-sm mt-2">{selectedDisaster.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
