import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup, Modal } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import googleMapsConfig from '../../config/googleMapsConfig';
import MapComponent from '../../components/MapComponent';
import ProspectMapComponent from '../../components/ProspectMapComponent';
import heatmapService from '../../services/heatmapService';
import prospectService from '../../services/prospectService';
import clientService from '../../services/clienteService';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const libraries = ['places', 'visualization', 'drawing', 'geometry'];

function HeatMapClienteIntegrado() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);
  const [bairros, setBairros] = useState([]);
  const [selectedBairros, setSelectedBairros] = useState([]);
  const [larguraMetros, setLarguraMetros] = useState(100);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [mapGerado, setMapGerado] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [showProspects, setShowProspects] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [segmentos, setSegmentos] = useState([]);
  const [selectedSegmentos, setSelectedSegmentos] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [center] = useState({
    lat: -3.7319,
    lng: -38.5267
  });
  const [clientes, setClientes] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      data.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      showAlert('danger', 'Erro ao carregar dados de clientes.');
      setLoading(false);
    }
  };

  const handleClienteSelection = (clienteId) => {
    setSelectedClientes(prev => {
      if (prev.includes(clienteId)) {
        return prev.filter(id => id !== clienteId);
      } else {
        return [...prev, clienteId];
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
    
    if (selectedClientes.length === 0) {
      showAlert('warning', 'Por favor, selecione pelo menos um cliente.');
      return;
    }
    
    try {
      setMapLoading(true);
      
      // Chamada real para gerar o heatmap com os clientes selecionados
      const selectedClientObjects = clientes.filter(c => selectedClientes.includes(String(c.id)));
      // Exemplo: supondo que cada cliente tem latitude/longitude
      const realHeatmapData = selectedClientObjects
        .filter(c => c.latitude && c.longitude)
        .map(c => ({
          lat: parseFloat(c.latitude),
          lng: parseFloat(c.longitude),
          weight: 1
        }));
        
      setHeatmapData(realHeatmapData);
      setMapGerado(true);
      setMapLoading(false);
      showAlert('success', 'Mapa de calor gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar mapa de calor:', error);
      showAlert('danger', 'Erro ao gerar mapa de calor.');
      setMapLoading(false);
    }
  };

  const handleIdentificarProspects = async () => {
    try {
      setMapLoading(true);
      showAlert('info', 'Identificando prospects no mapa de calor...');
      
      // Simulação de identificação de prospects - será substituída pela chamada real à API
      setTimeout(() => {
        // Dados simulados de prospects identificados
        const mockProspects = [
          {
            id: '1',
            nome: 'Empresa Potencial A',
            segmento: 'Tecnologia',
            lat: -23.553140,
            lng: -46.642710
          },
          {
            id: '2',
            nome: 'Empresa Potencial B',
            segmento: 'Saúde',
            lat: -23.557250,
            lng: -46.643080
          },
          {
            id: '3',
            nome: 'Empresa Potencial C',
            segmento: 'Educação',
            lat: -23.550520,
            lng: -46.633308
          }
        ];
        
        // Extrair segmentos únicos
        const uniqueSegmentos = [...new Set(mockProspects.map(p => p.segmento))];
        
        setProspects(mockProspects);
        setSegmentos(uniqueSegmentos);
        setSelectedSegmentos(uniqueSegmentos); // Selecionar todos por padrão
        setShowProspects(true);
        setMapLoading(false);
        showAlert('success', `${mockProspects.length} prospects identificados!`);
      }, 1500);
    } catch (error) {
      console.error('Erro ao identificar prospects:', error);
      showAlert('danger', 'Erro ao identificar prospects.');
      setMapLoading(false);
    }
  };

  const handleSalvarProspects = () => {
    setShowSaveModal(true);
  };

  const handleSegmentoSelection = (segmento) => {
    setSelectedSegmentos(prev => {
      if (prev.includes(segmento)) {
        return prev.filter(s => s !== segmento);
      } else {
        return [...prev, segmento];
      }
    });
  };

  const confirmSaveProspects = async () => {
    try {
      setSaveLoading(true);
      
      // Simulação de salvamento - será substituída pela chamada real à API
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveLoading(false);
        showAlert('success', 'Prospects salvos com sucesso!');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar prospects:', error);
      showAlert('danger', 'Erro ao salvar prospects.');
      setSaveLoading(false);
    }
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 5000);
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

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
      <h2 className="mb-4">Gerar HeatMap Integrado por Cliente</h2>
      
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
                  <Form.Label>Clientes</Form.Label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {clientes.map((cliente) => (
                      <Form.Check
                        key={cliente.id}
                        type="checkbox"
                        label={cliente.nome}
                        checked={selectedClientes.includes(cliente.id)}
                        onChange={() => handleClienteSelection(cliente.id)}
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

      {mapGerado && (
        <div className="d-flex justify-content-end mt-3">
          <Button 
            variant="success" 
            className="me-2"
            onClick={handleIdentificarProspects}
            disabled={mapLoading}
          >
            {showProspects ? 'Atualizar Prospects' : 'Identificar Prospects'}
          </Button>
          {showProspects && (
            <Button 
              variant="primary"
              onClick={handleSalvarProspects}
              disabled={mapLoading}
            >
              Salvar Prospects
            </Button>
          )}
        </div>
      )}

      {/* Modal para salvar prospects */}
      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Salvar Prospects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecione os segmentos de prospects que deseja salvar:</p>
          <ListGroup>
            {segmentos.map(segmento => (
              <ListGroup.Item key={segmento}>
                <Form.Check
                  type="checkbox"
                  id={`segmento-${segmento}`}
                  label={segmento}
                  checked={selectedSegmentos.includes(segmento)}
                  onChange={() => handleSegmentoSelection(segmento)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)} disabled={saveLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmSaveProspects} disabled={saveLoading || selectedSegmentos.length === 0}>
            {saveLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HeatMapClienteIntegrado;
