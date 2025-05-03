import React from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import MapComponent from './MapComponent';

function ProspectMapComponent({
  center,
  zoom,
  prospects,
  onProspectClick
}) {
  const [selectedProspect, setSelectedProspect] = React.useState(null);

  const handleMarkerClick = (prospect) => {
    setSelectedProspect(prospect);
    if (onProspectClick) {
      onProspectClick(prospect);
    }
  };

  return (
    <MapComponent center={center} zoom={zoom}>
      {prospects.map((prospect) => (
        <Marker
          key={prospect.id}
          position={{ lat: prospect.lat, lng: prospect.lng }}
          title={prospect.nome}
          onClick={() => handleMarkerClick(prospect)}
        />
      ))}
      
      {selectedProspect && (
        <InfoWindow
          position={{ lat: selectedProspect.lat, lng: selectedProspect.lng }}
          onCloseClick={() => setSelectedProspect(null)}
        >
          <div className="prospect-info-window">
            <h5>{selectedProspect.nome}</h5>
            <p><strong>Segmento:</strong> {selectedProspect.segmento}</p>
          </div>
        </InfoWindow>
      )}
    </MapComponent>
  );
}

export default ProspectMapComponent;
