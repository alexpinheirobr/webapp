/* global google */

/* setores para prospectar:
automativo, escritório corporativo, educação, lazer e recreação, finanças, alimentos e bebidas, governo, saúde e bem estar, habitação, hospedagem, advocacia, shopping, transporte, serviços.
*/
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

const SETORES = [
  'Automotivo',
  'Escritório Corporativo',
  'Educação',
  'Lazer e Recreação',
  'Finanças',
  'Alimentos e Bebidas',
  'Governo',
  'Saúde e Bem Estar',
  'Habitação',
  'Hospedagem',
  'Advocacia',
  'Shopping',
  'Transporte',
  'Serviços'
];

function getCenterOfPoints(points) {
  if (points.length === 0) return { lat: -3.7319, lng: -38.5267 };
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
}

function generateFilledCirclePoints(lat, lng, radiusMeters, numRings = 10, pointsPerRing = 36) {
  const points = [];
  const earthRadius = 6378137; // raio da Terra em metros

  for (let ring = 0; ring <= numRings; ring++) {
    const currentRadius = (radiusMeters * ring) / numRings;
    const dLat = currentRadius / earthRadius;
    const dLng = currentRadius / (earthRadius * Math.cos(Math.PI * lat / 180));
    const numPoints = ring === 0 ? 1 : pointsPerRing * ring;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const latOffset = dLat * Math.sin(angle);
      const lngOffset = dLng * Math.cos(angle);
      points.push({
        lat: lat + (latOffset * 180 / Math.PI),
        lng: lng + (lngOffset * 180 / Math.PI),
        weight: 1
      });
    }
  }
  return points;
}

function HeatMapClienteIntegrado() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBjPUWZRGVXyAGqG5Bv7NtkhziOf55C_ms',
    libraries: ['places', 'visualization'],
    language: 'pt-BR',
    region: 'BR'
  });

  // Adicione um log para verificar o estado de carregamento
  console.log('Estado de carregamento do mapa:', { isLoaded, loadError });

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
  const [center, setCenter] = useState({
    lat: -3.7319,
    lng: -38.5267
  });
  const [clientes, setClientes] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [selectedSetores, setSelectedSetores] = useState([]);
  const [quantidadeProspects, setQuantidadeProspects] = useState(10);
  const [prospectsEncontrados, setProspectsEncontrados] = useState([]);
  const [identificandoProspects, setIdentificandoProspects] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log('Google Maps API carregada');
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

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

    setMapLoading(true);

    // Filtra os clientes selecionados
    const selectedClientObjects = clientes.filter(c => selectedClientes.includes(c.id));

    // Verifica se algum cliente tem coordenadas
    const clientesComCoordenadas = selectedClientObjects.filter(c => c.latitude && c.longitude);
    
    if (clientesComCoordenadas.length === 0) {
      showAlert('warning', 'Não é possível gerar mapa de calor sem coordenadas geográficas.');
      setMapLoading(false);
      return;
    }

    // Gera os pontos do heatmap para cada cliente selecionado
    let realHeatmapData = [];
    clientesComCoordenadas.forEach(c => {
      const circlePoints = generateFilledCirclePoints(
        parseFloat(c.latitude),
        parseFloat(c.longitude),
        larguraMetros
      );
      realHeatmapData = realHeatmapData.concat(circlePoints);
    });

    // Centraliza o mapa no centro dos clientes selecionados
    let newCenter = { lat: -3.7319, lng: -38.5267 };
    if (clientesComCoordenadas.length === 1) {
      newCenter = {
        lat: parseFloat(clientesComCoordenadas[0].latitude),
        lng: parseFloat(clientesComCoordenadas[0].longitude)
      };
    } else if (clientesComCoordenadas.length > 1) {
      // Calcula o centro médio dos clientes selecionados
      const lat = clientesComCoordenadas.reduce((sum, c) => sum + parseFloat(c.latitude), 0) / clientesComCoordenadas.length;
      const lng = clientesComCoordenadas.reduce((sum, c) => sum + parseFloat(c.longitude), 0) / clientesComCoordenadas.length;
      newCenter = { lat, lng };
    }

    setHeatmapData(realHeatmapData);
    setCenter(newCenter);
    setMapGerado(true);
    setMapLoading(false);
    showAlert('success', 'Mapa de calor gerado com sucesso!');
  };

  const handleIdentificarProspects = async () => {
    try {
      setIdentificandoProspects(true);
      showAlert('info', 'Identificando prospects no mapa de calor...');

      // Verificando se o mapa está realmente disponível
      if (!isLoaded || !window.google || !window.google.maps) {
        console.log('Erro: API do Google Maps não está carregada');
        showAlert('warning', 'A API do Google Maps não está carregada. Por favor, aguarde.');
        return;
      }

      if (!mapGerado) {
        console.log('Erro: Mapa de calor não foi gerado');
        showAlert('warning', 'Por favor, gere o mapa de calor primeiro.');
        return;
      }

      if (!selectedSetores.length) {
        console.log('Erro: Nenhum setor selecionado');
        showAlert('warning', 'Por favor, selecione pelo menos um setor para prospectar.');
        return;
      }

      // Criando o serviço do Places com um elemento HTML
      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

      const prospects = [];
      const promises = [];

      // Para cada setor selecionado, buscar lugares próximos
      for (const setor of selectedSetores) {
        const request = {
          location: new window.google.maps.LatLng(center.lat, center.lng),
          radius: larguraMetros,
          type: getGooglePlaceType(setor),
          language: 'pt-BR'
        };

        console.log(`Buscando lugares para o setor ${setor}:`, request);

        const promise = new Promise((resolve, reject) => {
          placesService.nearbySearch(request, (results, status) => {
            console.log(`Resultado da busca para ${setor}:`, { status, resultsCount: results?.length });
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              const placePromises = results.slice(0, quantidadeProspects).map(place => {
                return new Promise((resolvePlace) => {
                  placesService.getDetails({
                    placeId: place.place_id,
                    fields: ['name', 'formatted_address', 'formatted_phone_number', 'geometry']
                  }, (placeDetails, detailsStatus) => {
                    console.log(`Detalhes do lugar ${place.place_id}:`, { detailsStatus });
                    
                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                      resolvePlace({
                        id: place.place_id,
                        nome: placeDetails.name,
                        endereco: placeDetails.formatted_address || 'Endereço não disponível',
                        segmento: setor,
                        telefone: placeDetails.formatted_phone_number || 'Não disponível',
                        lat: placeDetails.geometry.location.lat(),
                        lng: placeDetails.geometry.location.lng()
                      });
                    } else {
                      resolvePlace(null);
                    }
                  });
                });
              });

              Promise.all(placePromises).then(placeResults => {
                resolve(placeResults.filter(Boolean));
              });
            } else {
              console.log(`Erro na busca para ${setor}:`, status);
              resolve([]);
            }
          });
        });

        promises.push(promise);
      }

      const results = await Promise.all(promises);
      const allProspects = results.flat().slice(0, quantidadeProspects);

      console.log('Prospects encontrados:', allProspects);

      setProspectsEncontrados(allProspects);
      setShowProspects(true);
      showAlert('success', `${allProspects.length} prospects identificados!`);

    } catch (error) {
      console.error('Erro ao identificar prospects:', error);
      showAlert('danger', 'Erro ao identificar prospects.');
    } finally {
      setIdentificandoProspects(false);
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
    console.log('Mapa carregado:', map);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    if (map && typeof map.setMap === 'function') {
      map.setMap(null);
    }
    setMap(null);
  }, [map]);

  const handleSetorSelection = (setor) => {
    setSelectedSetores(prev => {
      if (prev.includes(setor)) {
        return prev.filter(s => s !== setor);
      } else {
        return [...prev, setor];
      }
    });
  };

  // Função auxiliar para converter setores em tipos do Google Places
  const getGooglePlaceType = (setor) => {
    const typeMap = {
      'Automotivo': 'car_dealer',
      'Escritório Corporativo': 'office',
      'Educação': 'school',
      'Lazer e Recreação': 'amusement_park',
      'Finanças': 'bank',
      'Alimentos e Bebidas': 'restaurant',
      'Governo': 'local_government_office',
      'Saúde e Bem Estar': 'health',
      'Habitação': 'lodging',
      'Hospedagem': 'lodging',
      'Advocacia': 'lawyer',
      'Shopping': 'shopping_mall',
      'Transporte': 'transit_station',
      'Serviços': 'point_of_interest'
    };
    return typeMap[setor] || 'point_of_interest';
  };

  // Função para excluir um prospect
  const handleExcluirProspect = (prospectId) => {
    setProspectsEncontrados(prev => prev.filter(p => p.id !== prospectId));
  };

  useEffect(() => {
    return () => {
      // Limpar o estado quando o componente for desmontado
      if (map && typeof map.setMap === 'function') {
        map.setMap(null);
      }
      setMap(null);
      setHeatmapData([]);
      setProspectsEncontrados([]);
      setShowProspects(false);
    };
  }, [map]);

  // Renderização condicional do mapa
  const renderMap = () => {
    if (!isLoaded || !isReady) {
      return (
        <div className="text-center p-5">
          Carregando mapa...
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {mapGerado && heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData.map(point => new window.google.maps.LatLng(point.lat, point.lng))}
            options={{
              radius: 40,
              opacity: 0.5,
              gradient: [
                'rgba(255, 100, 100, 0)',
                'rgba(255, 100, 100, 0.3)',
                'rgba(255, 100, 100, 0.5)',
                'rgba(255, 100, 100, 0.7)',
                'rgba(255, 100, 100, 0.9)'
              ]
            }}
          />
        )}
      </GoogleMap>
    );
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
            {renderMap()}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>Setores para Prospectar</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    {Array.from({ length: 7 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            id={`setor-${SETORES[rowIndex]}`}
                            label={SETORES[rowIndex]}
                            checked={selectedSetores.includes(SETORES[rowIndex])}
                            onChange={() => handleSetorSelection(SETORES[rowIndex])}
                          />
                        </td>
                        <td>
                          {SETORES[rowIndex + 7] && (
                            <Form.Check
                              type="checkbox"
                              id={`setor-${SETORES[rowIndex + 7]}`}
                              label={SETORES[rowIndex + 7]}
                              checked={selectedSetores.includes(SETORES[rowIndex + 7])}
                              onChange={() => handleSetorSelection(SETORES[rowIndex + 7])}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Form.Group className="me-3" style={{ width: '200px' }}>
                  <Form.Label>Quantidade de Prospects</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    value={quantidadeProspects}
                    onChange={(e) => setQuantidadeProspects(parseInt(e.target.value) || 1)}
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  onClick={handleIdentificarProspects}
                  disabled={mapLoading || !mapGerado || selectedSetores.length === 0 || identificandoProspects}
                >
                  {identificandoProspects ? 'Identificando...' : (showProspects ? 'Atualizar Prospects' : 'Identificar Prospects')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showProspects && prospectsEncontrados.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>Prospects Identificados</Card.Header>
              <Card.Body>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Segmento</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prospectsEncontrados.map((prospect) => (
                        <tr key={prospect.id}>
                          <td>{prospect.nome}</td>
                          <td>{prospect.endereco}</td>
                          <td>{prospect.segmento}</td>
                          <td>{prospect.telefone}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleExcluirProspect(prospect.id)}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
