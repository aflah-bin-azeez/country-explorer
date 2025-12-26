import React from "react";

const Filters = ({ region, population, onRegionChange, onPopulationChange }) => {
  return (
    <div className="filters">
      <select value={region} onChange={(e) => onRegionChange(e.target.value)}>
        <option value="">All Regions</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Oceania">Oceania</option>
      </select>

      <select
        value={population}
        onChange={(e) => onPopulationChange(e.target.value)}
      >
        <option value="">All Population</option>
        <option value="lt10">Less than 10M</option>
        <option value="10to50">10M – 50M</option>
        <option value="gt50">More than 50M</option>
      </select>
    </div>
  );
};

export default Filters;
