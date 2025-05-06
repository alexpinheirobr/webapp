import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup, Modal } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import googleMapsConfig from '../../config/googleMapsConfig';
import fibraService from '../../services/fibraService';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const libraries = ['places', 'visualization', 'drawing', 'geometry'];

function HeatMapFibraIntegrado() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);
  const [fibras, setFibras] = useState([]);
  const [selectedFibras, setSelectedFibras] = useState([]);
  const [larguraMetros, setLarguraMetros] = useState(100);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [mapGerado, setMapGerado] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [center] = useState({
    lat: -3.7319,
    lng: -38.5267
  });

  useEffect(() => {
    fetchFibras();
  }, []);

  const fetchFibras = async () => {
    try {
      setLoading(true);
      const response = await fibraService.getAllFibras();
      setFibras(response);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar fibras:', error);
      showAlert('danger', 'Erro ao carregar dados de fibras.');
      setLoading(false);
    }
  };

  const handleFibraSelection = (fibra) => {
    setSelectedFibras(prev => {
      if (prev.includes(fibra)) {
        return prev.filter(f => f !== fibra);
      } else {
        return [...prev, fibra];
      }
    });
  };

  const handleLarguraChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLarguraMetros(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFibras.length === 0) {
      showAlert('warning', 'Por favor, selecione pelo menos uma fibra.');
      return;
    }
    
    try {
      setMapLoading(true);
      
      // Aqui você pode implementar a lógica real de geração do heatmap
      // Por enquanto, vamos usar dados simulados baseados nas coordenadas das fibras
      const heatmapPoints = [];
      selectedFibras.forEach(fibra => {
        if (fibra.coordenadas) {
          fibra.coordenadas.forEach(coord => {
            heatmapPoints.push({
              lat: parseFloat(coord.lat),
              lng: parseFloat(coord.lng),
              weight: 1
            });
          });
        }
      });
      
      setHeatmapData(heatmapPoints);
      setMapGerado(true);
      setMapLoading(false);
      showAlert('success', 'Mapa de calor gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar mapa de calor:', error);
      showAlert('danger', 'Erro ao gerar mapa de calor.');
      setMapLoading(false);
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 5000);
  };

  if (loadError) {
    return (
      <Container>
        <div className="alert alert-danger">
          Erro ao carregar o mapa. Por favor, verifique a chave da API e tente novamente.
          <br />
          Detalhes: {loadError.message}
        </div>
      </Container>
    );
  }

  if (!isLoaded) {
    return (
      <Container>
        <div className="text-center p-5">
          Carregando mapa...
        </div>
      </Container>
    );
  }

  return (
    <Container className="cadastro-root">
      <h2 className="mb-4">Gerar HeatMap Integrado por Fibra</h2>
      
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Configurações</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Fibras</Form.Label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {fibras.map((fibra) => (
                      <Form.Check
                        key={fibra.id}
                        type="checkbox"
                        label={fibra.nome}
                        checked={selectedFibras.includes(fibra)}
                        onChange={() => handleFibraSelection(fibra)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Largura (metros)</Form.Label>
                  <Form.Control
                    type="number"
                    value={larguraMetros}
                    onChange={handleLarguraChange}
                    min="1"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || mapLoading}
                  className="w-100"
                >
                  {mapLoading ? 'Gerando...' : 'Gerar Mapa de Calor'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <div style={{ height: '500px', width: '100%' }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {mapGerado && heatmapData.length > 0 && (
                <HeatmapLayer
                  data={heatmapData.map(point => ({
                    location: new window.google.maps.LatLng(point.lat, point.lng),
                    weight: point.weight
                  }))}
                  options={{
                    radius: 20,
                    opacity: 0.7
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HeatMapFibraIntegrado;
