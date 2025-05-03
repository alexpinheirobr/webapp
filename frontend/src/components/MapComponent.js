import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import googleMapsConfig from '../config/googleMapsConfig';

const containerStyle = {
  width: '100%',
  height: '500px' // Altura fixa para evitar problemas de layout
};

const errorContainerStyle = {
  width: '100%',
  height: '500px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center'
};

function MapComponent({
  center = googleMapsConfig.defaultCenter,
  zoom = googleMapsConfig.defaultZoom,
  markers = [],
  onMapClick,
  children
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: googleMapsConfig.libraries
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  if (loadError) {
    console.error('Erro ao carregar o Google Maps:', loadError);
    return (
      <div style={errorContainerStyle}>
        <div>
          <h4>Erro ao carregar o mapa</h4>
          <p>Verifique se a chave da API do Google Maps está configurada corretamente.</p>
          <small>Detalhes técnicos no console do navegador.</small>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={errorContainerStyle}>
        <div>Carregando mapa...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={{
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
          />
        ))}
        {children}
      </GoogleMap>
    </div>
  );
}

export default React.memo(MapComponent);
