import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const HeatMapCliente = () => {
  const [bairros, setBairros] = useState([]);
  const [selectedBairros, setSelectedBairros] = useState([]);
  const [larguraMetros, setLarguraMetros] = useState(100);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [mapGerado, setMapGerado] = useState(false);

  useEffect(() => {
    fetchBairros();
  }, []);

  const fetchBairros = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API - será substituída pela chamada real
      setTimeout(() => {
        const mockBairros = [
          'Centro',
          'Bela Vista',
          'Jardim Paulista',
          'Consolação',
          'Pinheiros',
          'Vila Mariana',
          'Moema'
        ];
        setBairros(mockBairros);
        setLoading(false);
      }, 500);
      
      // Código para chamada real à API (comentado)
      // const response = await axios.get('/api/clientes/bairros');
      // setBairros(response.data);
    } catch (error) {
      console.error('Erro ao buscar bairros:', error);
      showAlert('danger', 'Erro ao carregar dados de bairros.');
      setLoading(false);
    }
  };

  const handleBairroSelection = (bairro) => {
    setSelectedBairros(prev => {
      if (prev.includes(bairro)) {
        return prev.filter(b => b !== bairro);
      } else {
        return [...prev, bairro];
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
    
    if (selectedBairros.length === 0) {
      showAlert('warning', 'Por favor, selecione pelo menos um bairro.');
      return;
    }
    
    try {
      setMapLoading(true);
      
      // Simulação de geração de mapa de calor - será substituída pela chamada real à API
      setTimeout(() => {
        setMapGerado(true);
        setMapLoading(false);
        showAlert('success', 'Mapa de calor gerado com sucesso!');
      }, 1500);
      
      // Código para chamada real à API (comentado)
      // const response = await axios.post('/api/heatmap/cliente', {
      //   bairros: selectedBairros,
      //   larguraMetros
      // });
      // 
      // // Aqui você processaria a resposta para exibir o mapa
      // setMapGerado(true);
    } catch (error) {
      console.error('Erro ao gerar mapa de calor:', error);
      showAlert('danger', 'Erro ao gerar mapa de calor.');
      setMapLoading(false);
    }
  };

  const handleIdentificarProspects = () => {
    showAlert('info', 'Identificando prospects no mapa de calor...');
    // Esta funcionalidade será implementada quando tivermos a integração com o Google Maps
  };

  const handleSalvarProspects = () => {
    showAlert('info', 'Salvando prospects identificados...');
    // Esta funcionalidade será implementada quando tivermos a integração com o Google Maps
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 3000);
  };

  return (
    <Container>
      <h2 className="mb-4">Gerar HeatMap por Cliente</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Selecione os Bairros</Card.Title>
              
              {loading ? (
                <p className="text-center">Carregando bairros...</p>
              ) : bairros.length === 0 ? (
                <p className="text-center">Nenhum bairro encontrado</p>
              ) : (
                <ListGroup className="mb-3">
                  {bairros.map(bairro => (
                    <ListGroup.Item 
                      key={bairro}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <Form.Check
                        type="checkbox"
                        id={`bairro-${bairro}`}
                        label={bairro}
                        checked={selectedBairros.includes(bairro)}
                        onChange={() => handleBairroSelection(bairro)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Largura em metros</Form.Label>
                  <Form.Control
                    type="number"
                    value={larguraMetros}
                    onChange={handleLarguraChange}
                    min="1"
                    required
                  />
                  <Form.Text className="text-muted">
                    Define a largura do mapa de calor ao redor dos clientes nos bairros selecionados.
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || mapLoading || selectedBairros.length === 0}
                  className="w-100"
                >
                  {mapLoading ? 'Gerando Mapa...' : 'Gerar Mapa de Calor'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Mapa de Calor</Card.Title>
              
              <div 
                className="map-container bg-light d-flex justify-content-center align-items-center"
                style={{ border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {mapLoading ? (
                  <p>Gerando mapa de calor...</p>
                ) : !mapGerado ? (
                  <p>Selecione os bairros e clique em "Gerar Mapa de Calor" para visualizar o resultado.</p>
                ) : (
                  <div className="text-center">
                    <p>Mapa de calor gerado com sucesso!</p>
                    <p className="text-muted">
                      (A visualização do mapa será implementada quando a integração com o Google Maps estiver disponível)
                    </p>
                  </div>
                )}
              </div>
              
              {mapGerado && (
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="success" 
                    className="me-2"
                    onClick={handleIdentificarProspects}
                  >
                    Identificar Prospects
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleSalvarProspects}
                  >
                    Salvar Prospects
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HeatMapCliente;
