import React, { useState, useEffect } from 'react';
import { getCountriesList, getStatesByCountry, getCitiesByCountry, getCountriesByRegion, getPopularCountries } from '../helper/geographicData';

const CountryStateSelector = ({ 
  selectedCountry, 
  selectedState, 
  selectedCity,
  onCountryChange, 
  onStateChange, 
  onCityChange,
  className = "",
  showCity = false,
  required = false 
}) => {
  const [countries] = useState(getCountriesList());
  const [popularCountries] = useState(getPopularCountries());
  const [countriesByRegion] = useState(getCountriesByRegion());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = getStatesByCountry(selectedCountry);
      setStates(countryStates);
      
      if (showCity) {
        const countryCities = getCitiesByCountry(selectedCountry);
        setCities(countryCities);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, showCity]);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    onCountryChange(country);
    
    // Reset state and city when country changes
    if (onStateChange) onStateChange('');
    if (onCityChange) onCityChange('');
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    onStateChange(state);
    
    // Reset city when state changes
    if (onCityChange) onCityChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Country Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedCountry || ""}
          onChange={handleCountryChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a country</option>
          
          {/* Popular Countries */}
          <optgroup label="Popular Countries">
            {popularCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </optgroup>
          
          {/* Countries by Region */}
          {Object.entries(countriesByRegion).map(([region, regionCountries]) => (
            <optgroup key={region} label={region}>
              {regionCountries
                .filter(country => !popularCountries.includes(country)) // Avoid duplicates
                .map(country => (
                  <option key={country} value={country}>{country}</option>
                ))
              }
            </optgroup>
          ))}
          
          {/* Other Countries */}
          <optgroup label="Other Countries">
            {countries
              .filter(country => 
                !popularCountries.includes(country) && 
                !Object.values(countriesByRegion).flat().includes(country)
              )
              .map(country => (
                <option key={country} value={country}>{country}</option>
              ))
            }
          </optgroup>
        </select>
      </div>

      {/* State Selector */}
      {selectedCountry && states.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a state/province</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      )}

      {/* City Selector (optional) */}
      {showCity && selectedCountry && cities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Major City {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}

      {/* Custom City Input */}
      {showCity && selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or enter your city
          </label>
          <input
            type="text"
            value={selectedCity && !cities.includes(selectedCity) ? selectedCity : ''}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Enter your city"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default CountryStateSelector;
