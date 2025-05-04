import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import clienteService from '../../services/clienteService';
import geocodeService from '../../services/geocodeService';

function CadastroCliente() {
  const [clientes, setClientes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
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
    }
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAllClients();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      showAlert('danger', 'Erro ao carregar dados de clientes.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setEditMode(false);
    setCurrentId('');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (data.latitude === '') data.latitude = null;
      if (data.longitude === '') data.longitude = null;
      if (data.dataContrato === '') data.dataContrato = null;

      if (editMode) {
        await clienteService.updateClient(currentId, data);
        await fetchClientes();
        handleReset();
        showAlert('success', 'Cliente atualizado com sucesso!');
        setLoading(false);
      } else {
        await clienteService.createClient(data);
        await fetchClientes();
        handleReset();
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
    Object.keys(cliente).forEach((key) => {
      setValue(key, cliente[key] || '');
    });
    setEditMode(true);
    setCurrentId(cliente.id || cliente._id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await clienteService.deleteClient(deleteId);
      await fetchClientes();
      setShowModal(false);
      showAlert('success', 'Cliente removido com sucesso!');
      setLoading(false);
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
    setGeoLoading(true);
    try {
      const values = getValues();
      const { endereco, complemento, bairro, cidade, uf, cep } = values;
      const result = await geocodeService.getCoordinates(endereco, complemento, bairro, cidade, uf, cep);
      setValue('latitude', result.latitude);
      setValue('longitude', result.longitude);
      showAlert('success', 'Coordenadas obtidas com sucesso!');
    } catch (error) {
      showAlert('danger', 'Não foi possível obter as coordenadas. Verifique o endereço.');
    }
    setGeoLoading(false);
  };

  const handleUfChange = (e) => {
    const upperUf = e.target.value.toUpperCase();
    setValue('uf', upperUf);
  };

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setValue('cep', value);
  };

  return (
    <Container>
      <h2 className="mb-4">Cadastro de Clientes</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do cliente"
                maxLength={100}
                isInvalid={!!errors.nome}
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  maxLength: { value: 100, message: 'Máximo de 100 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nome?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço"
                maxLength={100}
                isInvalid={!!errors.endereco}
                {...register('endereco', {
                  required: 'Endereço é obrigatório',
                  maxLength: { value: 100, message: 'Máximo de 100 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.endereco?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Complemento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o complemento"
                maxLength={40}
                isInvalid={!!errors.complemento}
                {...register('complemento', {
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.complemento?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o bairro"
                maxLength={40}
                isInvalid={!!errors.bairro}
                {...register('bairro', {
                  required: 'Bairro é obrigatório',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bairro?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a cidade"
                maxLength={40}
                isInvalid={!!errors.cidade}
                {...register('cidade', {
                  required: 'Cidade é obrigatória',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cidade?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>UF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="UF"
                    maxLength={2}
                    isInvalid={!!errors.uf}
                    {...register('uf', {
                      required: 'UF é obrigatória',
                      maxLength: { value: 2, message: 'Máximo de 2 caracteres' },
                      minLength: { value: 2, message: 'UF deve ter 2 caracteres' },
                      pattern: { value: /^[A-Za-z]{2}$/, message: 'UF deve conter apenas letras' }
                    })}
                    onChange={handleUfChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.uf?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="CEP"
                    maxLength={9}
                    isInvalid={!!errors.cep}
                    {...register('cep', {
                      maxLength: { value: 9, message: 'Máximo de 9 caracteres' },
                      minLength: { value: 9, message: 'CEP deve ter 9 caracteres' },
                      pattern: { value: /^[0-9]{5}-[0-9]{3}$/, message: 'CEP deve estar no formato 99999-999' }
                    })}
                    onChange={handleCepChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cep?.message}
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Segmento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o segmento"
                maxLength={40}
                isInvalid={!!errors.segmento}
                {...register('segmento', {
                  required: 'Segmento é obrigatório',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.segmento?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Executivo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o executivo responsável"
                maxLength={40}
                isInvalid={!!errors.executivo}
                {...register('executivo', {
                  required: 'Executivo é obrigatório',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.executivo?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Serviço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o serviço contratado"
                maxLength={40}
                isInvalid={!!errors.servico}
                {...register('servico', {
                  required: 'Serviço é obrigatório',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.servico?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data do Contrato</Form.Label>
              <Form.Control
                type="date"
                isInvalid={!!errors.dataContrato}
                {...register('dataContrato')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dataContrato?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Row>
                <Col md={5}>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Latitude"
                    maxLength={20}
                    isInvalid={!!errors.latitude}
                    {...register('latitude', {
                      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: 'Latitude deve ser um número válido'
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.latitude?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col md={5}>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Longitude"
                    maxLength={20}
                    isInvalid={!!errors.longitude}
                    {...register('longitude', {
                      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: 'Longitude deve ser um número válido'
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.longitude?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="secondary"
                    className="mb-3 w-100"
                    onClick={getCoordinates}
                    disabled={geoLoading}
                    type="button"
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
            <Button variant="secondary" className="ms-2" onClick={handleReset} disabled={loading}>
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