import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import clienteService from '../../services/clienteService';

function CadastroCliente() {
  const [clientes, setClientes] = useState([]);
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
    dataContrato: '',
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
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API - será substituída pela chamada real
      setTimeout(() => {
        const mockClientes = [
          { 
            _id: '1', 
            nome: 'Empresa ABC', 
            endereco: 'Rua das Flores, 123', 
            complemento: 'Sala 101', 
            bairro: 'Centro', 
            cidade: 'São Paulo', 
            uf: 'SP', 
            cep: '01234', 
            segmento: 'Tecnologia', 
            executivo: 'João Silva', 
            servico: 'Link Dedicado 100Mbps', 
            dataContrato: '2023-01-15', 
            latitude: '-23.550520', 
            longitude: '-46.633308' 
          },
          { 
            _id: '2', 
            nome: 'Empresa XYZ', 
            endereco: 'Av. Paulista, 1000', 
            complemento: 'Andar 10', 
            bairro: 'Bela Vista', 
            cidade: 'São Paulo', 
            uf: 'SP', 
            cep: '01310', 
            segmento: 'Financeiro', 
            executivo: 'Maria Souza', 
            servico: 'Link Dedicado 200Mbps', 
            dataContrato: '2023-02-20', 
            latitude: '-23.561370', 
            longitude: '-46.655010' 
          }
        ];
        setClientes(mockClientes);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      showAlert('danger', 'Erro ao carregar dados de clientes.');
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
      dataContrato: '',
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

console.log("RENDER");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editMode) {
        // Simulação de atualização - será substituída pela chamada real à API
        setTimeout(() => {
          const updatedClientes = clientes.map(cliente => 
            cliente._id === currentId ? { ...cliente, ...formData } : cliente
          );
          setClientes(updatedClientes);
          resetForm();
          showAlert('success', 'Cliente atualizado com sucesso!');
          setLoading(false);
        }, 500);
      } else {
        const response = await clienteService.createClient(formData);
        setClientes([...clientes, response]);
        resetForm();
        showAlert('success', 'Cliente cadastrado com sucesso!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} cliente.`);
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome,
      endereco: cliente.endereco,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      uf: cliente.uf,
      cep: cliente.cep,
      segmento: cliente.segmento,
      executivo: cliente.executivo,
      servico: cliente.servico,
      dataContrato: cliente.dataContrato,
      latitude: cliente.latitude,
      longitude: cliente.longitude
    });
    setEditMode(true);
    setCurrentId(cliente._id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Simulação de exclusão - será substituída pela chamada real à API
      setTimeout(() => {
        const updatedClientes = clientes.filter(cliente => cliente._id !== deleteId);
        setClientes(updatedClientes);
        setShowModal(false);
        showAlert('success', 'Cliente removido com sucesso!');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      showAlert('danger', 'Erro ao remover cliente.');
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
    // Implementação da função getCoordinates aqui
  };

  return (
    <Container>
      <h2 className="mb-4">Cadastro de Clientes</h2>
      
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
                placeholder="Digite o nome do cliente"
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
                placeholder="Digite o serviço contratado"
                value={formData.servico}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data do Contrato</Form.Label>
              <Form.Control
                type="date"
                name="dataContrato"
                value={formData.dataContrato}
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
            {loading && clientes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Carregando...</td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Nenhum cliente cadastrado</td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.endereco}</td>
                  <td>{cliente.bairro}</td>
                  <td>{`${cliente.cidade}/${cliente.uf}`}</td>
                  <td>{cliente.segmento}</td>
                  <td>{cliente.servico}</td>
                  <td>
                    <Button variant="secondary" onClick={() => handleEdit(cliente)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(cliente._id)}>
                      Excluir
                    </Button>
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

export default CadastroCliente;