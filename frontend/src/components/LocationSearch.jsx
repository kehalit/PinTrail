import React, { useState, useEffect } from "react";
import { debounce } from "lodash";

const LocationSearch = ({ setMapCenter, setSearchedLocation, setLocationName, setMapZoom, searchQuery, setSearchQuery }) => {
  
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocations = async (query) => {
    if (!query) return [];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5`,
        {
          headers: {
            "User-Agent": "your-app-name/1.0 (your-email@example.com)",
          },
        }
      );
      const data = await res.json();
      return data.map((item) => ({
        id: item.place_id,
        name: item.display_name,
        position: [parseFloat(item.lat), parseFloat(item.lon)],
      }));
    } catch (err) {
      return [];
    }
  };

  const debouncedSearch = debounce(async (query) => {
    const results = await fetchLocations(query);
    setSuggestions(results);
  }, 300);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setMapCenter(suggestion.position);
    setSearchedLocation({ lat: suggestion.position[0], lng: suggestion.position[1] });
    setLocationName(suggestion.name);
    setMapZoom(15);
    setSuggestions([]); 
  };

  return (
    <div className="relative max-w-md mx-auto mt-4 z-50">
      <input
        type="text"
        className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for a location"
        value={searchQuery} 
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg max-h-60 overflow-y-auto mt-1 z-50">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 cursor-pointer hover:bg-blue-100"
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
