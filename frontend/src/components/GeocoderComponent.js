import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Form, Button } from 'react-bootstrap';

const GeocoderComponent = ({
  onPlaceSelected,
  buttonText = 'Buscar',
  placeholder = 'Digite um endereço',
  isLoading = false
}) => {
  const [autocomplete, setAutocomplete] = React.useState(null);
  const [address, setAddress] = React.useState('');

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || address
        };
        
        onPlaceSelected(location);
      }
    }
  };

  return (
    <div className="d-flex">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={handlePlaceSelect}
        restrictions={{ country: 'br' }}
      >
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Autocomplete>
      <Button 
        variant="primary" 
        onClick={handlePlaceSelect} 
        disabled={isLoading} 
        className="ms-2"
      >
        {isLoading ? 'Buscando...' : buttonText}
      </Button>
    </div>
  );
};

export default GeocoderComponent;
