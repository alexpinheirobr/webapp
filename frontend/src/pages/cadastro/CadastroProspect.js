import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function CadastroProspect() {
  const [prospects, setProspects] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    segmento: '',
    executivo: '',
    servico: '',
    dataProspeccao: '',
    latitude: '',
    longitude: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API - será substituída pela chamada real
      setTimeout(() => {
        const mockProspects = [
          { 
            _id: '1', 
            nome: 'Empresa Potencial 1', 
            endereco: 'Rua Augusta, 500', 
            complemento: 'Sala 50', 
            bairro: 'Consolação', 
            cidade: 'São Paulo', 
            uf: 'SP', 
            cep: '01304', 
            segmento: 'Educação', 
            executivo: 'Carlos Mendes', 
            servico: 'Link Dedicado 50Mbps', 
            dataProspeccao: '2023-04-10', 
            latitude: '-23.553140', 
            longitude: '-46.642710' 
          },
          { 
            _id: '2', 
            nome: 'Empresa Potencial 2', 
            endereco: 'Av. Brigadeiro Faria Lima, 2000', 
            complemento: 'Andar 15', 
            bairro: 'Jardim Paulistano', 
            cidade: 'São Paulo', 
            uf: 'SP', 
            cep: '01451', 
            segmento: 'Financeiro', 
            executivo: 'Ana Oliveira', 
            servico: 'Link Dedicado 100Mbps', 
            dataProspeccao: '2023-04-15', 
            latitude: '-23.567250', 
            longitude: '-46.693080' 
          }
        ];
        setProspects(mockProspects);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar prospects:', error);
      showAlert('danger', 'Erro ao carregar dados de prospects.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      segmento: '',
      executivo: '',
      servico: '',
      dataProspeccao: '',
      latitude: '',
      longitude: ''
    });
    setEditMode(false);
    setCurrentId('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editMode) {
        setTimeout(() => {
          const updatedProspects = prospects.map(prospect => 
            prospect._id === currentId ? { ...prospect, ...formData } : prospect
          );
          setProspects(updatedProspects);
          resetForm();
          showAlert('success', 'Prospect atualizado com sucesso!');
          setLoading(false);
        }, 500);
      } else {
        setTimeout(() => {
          const newProspect = {
            _id: Date.now().toString(),
            ...formData
          };
          setProspects([...prospects, newProspect]);
          resetForm();
          showAlert('success', 'Prospect cadastrado com sucesso!');
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao salvar prospect:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} prospect.`);
      setLoading(false);
    }
  };

  const handleEdit = (prospect) => {
    setFormData({
      nome: prospect.nome,
      endereco: prospect.endereco,
      complemento: prospect.complemento,
      bairro: prospect.bairro,
      cidade: prospect.cidade,
      uf: prospect.uf,
      cep: prospect.cep,
      segmento: prospect.segmento,
      executivo: prospect.executivo,
      servico: prospect.servico,
      dataProspeccao: prospect.dataProspeccao,
      latitude: prospect.latitude,
      longitude: prospect.longitude
    });
    setEditMode(true);
    setCurrentId(prospect._id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      setTimeout(() => {
        const updatedProspects = prospects.filter(prospect => prospect._id !== deleteId);
        setProspects(updatedProspects);
        setShowModal(false);
        showAlert('success', 'Prospect removido com sucesso!');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao excluir prospect:', error);
      showAlert('danger', 'Erro ao remover prospect.');
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 3000);
  };

  const getCoordinates = async () => {
    try {
      setGeoLoading(true);
      
      // Verificar se os campos de endereço estão preenchidos
      if (!formData.endereco || !formData.bairro || !formData.cidade || !formData.uf) {
        showAlert('warning', 'Preencha os campos de endereço para obter as coordenadas.');
        setGeoLoading(false);
        return;
      }
      
      // Simulação de geocodificação - será substituída pela chamada real à API
      setTimeout(() => {
        // Coordenadas simuladas para São Paulo
        setFormData(prev => ({
          ...prev,
          latitude: '-23.550520',
          longitude: '-46.633308'
        }));
        showAlert('success', 'Coordenadas obtidas com sucesso!');
        setGeoLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      showAlert('danger', 'Erro ao obter coordenadas. Verifique o endereço.');
      setGeoLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Cadastro de Prospects</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                placeholder="Digite o nome do prospect"
                value={formData.nome}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="endereco"
                placeholder="Digite o endereço"
                value={formData.endereco}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Complemento</Form.Label>
              <Form.Control
                type="text"
                name="complemento"
                placeholder="Digite o complemento"
                value={formData.complemento}
                onChange={handleChange}
                maxLength={40}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                placeholder="Digite o bairro"
                value={formData.bairro}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                placeholder="Digite a cidade"
                value={formData.cidade}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>UF</Form.Label>
                  <Form.Control
                    type="text"
                    name="uf"
                    placeholder="UF"
                    value={formData.uf}
                    onChange={handleChange}
                    maxLength={2}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    onChange={handleChange}
                    maxLength={8}
                    required
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Segmento</Form.Label>
              <Form.Control
                type="text"
                name="segmento"
                placeholder="Digite o segmento"
                value={formData.segmento}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Executivo</Form.Label>
              <Form.Control
                type="text"
                name="executivo"
                placeholder="Digite o executivo responsável"
                value={formData.executivo}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Serviço</Form.Label>
              <Form.Control
                type="text"
                name="servico"
                placeholder="Digite o serviço potencial"
                value={formData.servico}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data da Prospecção</Form.Label>
              <Form.Control
                type="date"
                name="dataProspeccao"
                value={formData.dataProspeccao}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Row>
                <Col md={5}>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="latitude"
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </Col>
                <Col md={5}>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="longitude"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="secondary" 
                    className="mb-3 w-100"
                    onClick={getCoordinates}
                    disabled={geoLoading}
                  >
                    {geoLoading ? 'Buscando...' : 'Pegar Coordenadas'}
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex mb-4">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : (editMode ? 'Atualizar' : 'Cadastrar')}
          </Button>
          {editMode && (
            <Button variant="secondary" className="ms-2" onClick={resetForm} disabled={loading}>
              Cancelar
            </Button>
          )}
        </div>
      </Form>
      
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Bairro</th>
              <th>Cidade/UF</th>
              <th>Segmento</th>
              <th>Serviço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && prospects.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Carregando...</td>
              </tr>
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Nenhum prospect cadastrado</td>
              </tr>
            ) : (
              prospects.map((prospect) => (
                <tr key={prospect._id}>
                  <td>{prospect.nome}</td>
                  <td>{prospect.endereco}</td>
                  <td>{prospect.bairro}</td>
                  <td>{`${prospect.cidade}/${prospect.uf}`}</td>
                  <td>{prospect.segmento}</td>
                  <td>{prospect.servico}</td>
                  <td>
                    <Button variant="secondary" onClick={() => handleEdit(prospect)}>Editar</Button>
                    <Button variant="danger" onClick={() => confirmDelete(prospect._id)}>Excluir</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default CadastroProspect;