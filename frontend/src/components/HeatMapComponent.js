import React from 'react';
import { HeatmapLayer } from '@react-google-maps/api';
import MapComponent from './MapComponent';

const HeatMapComponent = ({
  center,
  zoom,
  heatmapData,
  radius = 20,
  opacity = 0.7
}) => {
  const data = {
    positions: heatmapData.map(point => ({ lat: point.lat, lng: point.lng })),
    options: {
      radius,
      opacity,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    }
  };

  return (
    <MapComponent center={center} zoom={zoom}>
      <HeatmapLayer data={data.positions} options={data.options} />
    </MapComponent>
  );
};

export default HeatMapComponent;
