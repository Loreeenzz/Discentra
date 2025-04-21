"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface MapProps {
  disasters: Disaster[];
  onDisasterSelect: (disaster: Disaster) => void;
}

// Create a custom icon for disaster markers
const disasterIcon = L.divIcon({
  className: "disaster-marker",
  html: `
    <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
      !
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function Map({ disasters, onDisasterSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
    });

    // Add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Add zoom control
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map.current);

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for each disaster
    disasters.forEach((disaster) => {
      const marker = L.marker(
        [disaster.coordinates.lat, disaster.coordinates.lng],
        { icon: disasterIcon }
      );

      marker.on("click", () => onDisasterSelect(disaster));

      // Add popup
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${disaster.name}</h3>
          <p class="text-sm text-gray-600">${disaster.type}</p>
        </div>
      `);

      marker.addTo(map.current!);
      markers.current.push(marker);
    });
  }, [disasters, onDisasterSelect]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ position: "relative" }}
    />
  );
}
