import React, { useState } from 'react';

const SimpleCountryTest = () => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  
  const countries = [
    'United States',
    'Canada', 
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Nigeria',
    'South Africa'
  ];

  const handleChange = (e) => {
    console.log('Simple test - Country changed to:', e.target.value);
    setSelectedCountry(e.target.value);
  };

  return (
    <div className="p-4 border border-red-500 m-4">
      <h3 className="text-lg font-bold mb-2">Simple Country Test</h3>
      <p className="mb-2">Current: {selectedCountry}</p>
      <select 
        value={selectedCountry} 
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Select a country</option>
        {countries.map(country => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SimpleCountryTest;
