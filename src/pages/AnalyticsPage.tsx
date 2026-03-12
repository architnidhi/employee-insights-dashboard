import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Employee, CitySalary } from '../types';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [cityData, setCityData] = useState<CitySalary[]>([]);
  const [loading, setLoading] = useState(true);

  // City coordinates mapping (simplified)
  const cityCoordinates: Record<string, [number, number]> = {
    'New York': [40.7128, -74.0060],
    'Los Angeles': [34.0522, -118.2437],
    'Chicago': [41.8781, -87.6298],
    'Houston': [29.7604, -95.3698],
    'Phoenix': [33.4484, -112.0740],
    'Philadelphia': [39.9526, -75.1652],
    'San Antonio': [29.4241, -98.4936],
    'San Diego': [32.7157, -117.1611],
    'Dallas': [32.7767, -96.7970],
    'San Jose': [37.3382, -121.8863],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://backend.jotish.in/backend_dev/gettabledata.php',
          { username: 'test', password: '123456' }
        );
        
        // Aggregate salary by city
        const cityMap = new Map<string, { total: number; count: number }>();
        
        response.data.forEach((item: any) => {
          const city = item.city || 'Unknown';
          const salary = item.salary || 0;
          
          if (cityMap.has(city)) {
            const existing = cityMap.get(city)!;
            cityMap.set(city, {
              total: existing.total + salary,
              count: existing.count + 1
            });
          } else {
            cityMap.set(city, { total: salary, count: 1 });
          }
        });

        const aggregated: CitySalary[] = Array.from(cityMap.entries()).map(([city, data]) => ({
          city,
          totalSalary: data.total,
          count: data.count,
          coordinates: cityCoordinates[city] || [0, 0]
        }));

        setCityData(aggregated);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxSalary = Math.max(...cityData.map(d => d.totalSalary), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/list')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to List
        </button>

        <h1 className="text-3xl font-bold mb-8">Salary Analytics</h1>

        {/* SVG Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Salary Distribution by City (SVG)</h2>
          <svg width="100%" height="400" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Y-axis */}
            <line x1="50" y1="350" x2="50" y2="50" stroke="black" strokeWidth="2" />
            {/* X-axis */}
            <line x1="50" y1="350" x2="750" y2="350" stroke="black" strokeWidth="2" />

            {/* Bars */}
            {cityData.map((city, index) => {
              const barWidth = 40;
              const spacing = 60;
              const x = 70 + index * spacing;
              const barHeight = (city.totalSalary / maxSalary) * 250;
              const y = 350 - barHeight;

              return (
                <g key={city.city}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="rgba(59, 130, 246, 0.8)"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={370}
                    textAnchor="middle"
                    fontSize="12"
                    transform={`rotate(45, ${x + barWidth / 2}, 370)`}
                  >
                    {city.city}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="10"
                  >
                    ${(city.totalSalary / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Simple Map Representation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Geospatial Distribution</h2>
          <div className="relative h-96 bg-blue-50 rounded-lg overflow-hidden">
            {/* Simple grid background */}
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 40}
                  x2="800"
                  y2={i * 40}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 80}
                  y1="0"
                  x2={i * 80}
                  y2="400"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}

              {/* City markers */}
              {cityData.map((city, index) => {
                // Simple coordinate mapping for visualization
                const x = 100 + (index * 60);
                const y = 100 + (index % 3) * 80;
                const size = Math.sqrt(city.totalSalary / 1000) * 2;

                return (
                  <g key={city.city}>
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.min(size, 30)}
                      fill="rgba(239, 68, 68, 0.6)"
                      stroke="red"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {city.city}
                    </text>
                    <text
                      x={x}
                      y={y + 20}
                      textAnchor="middle"
                      fontSize="10"
                    >
                      ${(city.totalSalary / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}
            </svg>
            
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm">
              <p className="font-semibold">City Coordinates Mapping:</p>
              <p>Using hardcoded lat/lng for major US cities</p>
              <p>Circle size represents total salary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
