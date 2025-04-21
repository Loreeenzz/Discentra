"use client";

import { useState, useEffect } from "react";
import { Thermometer, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Forecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export default function WeatherInfo() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [location, setLocation] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Fetch location name using reverse geocoding
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationResponse.json();
            setLocation(locationData.display_name.split(",")[0]);

            // Fetch current weather data
            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_API_KEY`
            );
            const weatherData = await weatherResponse.json();
            setTemperature(Math.round(weatherData.main.temp));

            // Fetch 5-day forecast
            const forecastResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_API_KEY`
            );
            const forecastData = await forecastResponse.json();
            
            // Process forecast data to get daily forecasts
            const dailyForecasts = forecastData.list.reduce((acc: Forecast[], item: any) => {
              const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
              if (!acc.find(f => f.date === date)) {
                acc.push({
                  date,
                  temp: Math.round(item.main.temp),
                  description: item.weather[0].description,
                  icon: item.weather[0].icon
                });
              }
              return acc;
            }, []);

            setForecast(dailyForecasts);
          } catch (err) {
            setError("Failed to fetch weather data");
            console.error("Error fetching weather data:", err);
          }
        },
        (error) => {
          setError("Location access denied");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setError("Geolocation is not supported");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="w-full max-w-sm cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="font-medium">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-500" />
                {temperature !== null ? (
                  <span className="font-medium">{temperature}°C</span>
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 pr-8">
            <Calendar className="h-5 w-5 text-blue-500" />
            Weekly Forecast for {location}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {forecast.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{day.date}</span>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                  alt={day.description}
                  className="w-8 h-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{day.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 