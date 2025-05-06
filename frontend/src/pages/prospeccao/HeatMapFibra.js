import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const HeatMapFibra = () => {
  const [fibras, setFibras] = useState([]);
  const [selectedFibras, setSelectedFibras] = useState([]);
  const [larguraMetros, setLarguraMetros] = useState(100);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [mapGerado, setMapGerado] = useState(false);

  useEffect(() => {
    fetchFibras();
  }, []);

  const fetchFibras = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API - será substituída pela chamada real
      setTimeout(() => {
        const mockFibras = [
          { _id: '1', nome: 'Fibra Centro', quantidadeFo: 24 },
          { _id: '2', nome: 'Fibra Norte', quantidadeFo: 12 },
          { _id: '3', nome: 'Fibra Sul', quantidadeFo: 36 },
          { _id: '4', nome: 'Fibra Leste', quantidadeFo: 48 },
          { _id: '5', nome: 'Fibra Oeste', quantidadeFo: 24 }
        ];
        setFibras(mockFibras);
        setLoading(false);
      }, 500);
      
      // Código para chamada real à API (comentado)
      // const response = await axios.get('/api/fibras');
      // setFibras(response.data);
    } catch (error) {
      console.error('Erro ao buscar fibras:', error);
      showAlert('danger', 'Erro ao carregar dados de fibras.');
      setLoading(false);
    }
  };

  const handleFibraSelection = (fibraId) => {
    setSelectedFibras(prev => {
      if (prev.includes(fibraId)) {
        return prev.filter(id => id !== fibraId);
      } else {
        return [...prev, fibraId];
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
      
      // Simulação de geração de mapa de calor - será substituída pela chamada real à API
      setTimeout(() => {
        setMapGerado(true);
        setMapLoading(false);
        showAlert('success', 'Mapa de calor gerado com sucesso!');
      }, 1500);
      
      // Código para chamada real à API (comentado)
      // const response = await axios.post('/api/heatmap/fibra', {
      //   fibraIds: selectedFibras,
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
    <Container className="cadastro-root">
      <h2 className="mb-4">Gerar HeatMap por Fibra</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Selecione as Fibras</Card.Title>
              
              {loading ? (
                <p className="text-center">Carregando fibras...</p>
              ) : fibras.length === 0 ? (
                <p className="text-center">Nenhuma fibra cadastrada</p>
              ) : (
                <ListGroup className="mb-3">
                  {fibras.map(fibra => (
                    <ListGroup.Item 
                      key={fibra._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <Form.Check
                        type="checkbox"
                        id={`fibra-${fibra._id}`}
                        label={`${fibra.nome} (${fibra.quantidadeFo} FO)`}
                        checked={selectedFibras.includes(fibra._id)}
                        onChange={() => handleFibraSelection(fibra._id)}
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
                    Define a largura do mapa de calor ao redor das fibras selecionadas.
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || mapLoading || selectedFibras.length === 0}
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
                  <p>Selecione as fibras e clique em "Gerar Mapa de Calor" para visualizar o resultado.</p>
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

export default HeatMapFibra;
