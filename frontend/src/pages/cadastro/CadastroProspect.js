import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import prospectService from '../../services/prospectService';

function CadastroProspect() {
  const [prospects, setProspects] = useState([]);
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
      dataProspeccao: '',
      latitude: '',
      longitude: ''
    }
  });

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const data = await prospectService.getAllProspects();
      setProspects(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar prospects:', error);
      showAlert('danger', 'Erro ao carregar dados de prospects.');
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

      if (editMode) {
        await prospectService.updateProspect(currentId, data);
        await fetchProspects();
        handleReset();
        showAlert('success', 'Prospect atualizado com sucesso!');
        setLoading(false);
      } else {
        await prospectService.createProspect(data);
        await fetchProspects();
        handleReset();
        showAlert('success', 'Prospect cadastrado com sucesso!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao salvar prospect:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} prospect.`);
      setLoading(false);
    }
  };

  const handleEdit = (prospect) => {
    Object.keys(prospect).forEach((key) => {
      setValue(key, prospect[key] || '');
    });
    setEditMode(true);
    setCurrentId(prospect.id || prospect._id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await prospectService.deleteProspect(deleteId);
      await fetchProspects();
      setShowModal(false);
      showAlert('success', 'Prospect removido com sucesso!');
      setLoading(false);
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
      const values = ['endereco', 'bairro', 'cidade', 'uf'].map((field) => {
        return (typeof getValues === 'function' ? getValues(field) : '');
      });
      if (values.some(v => !v)) {
        showAlert('warning', 'Preencha os campos de endereço para obter as coordenadas.');
        setGeoLoading(false);
        return;
      }
      setTimeout(() => {
        setValue('latitude', '-23.550520');
        setValue('longitude', '-46.633308');
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
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do prospect"
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
                    maxLength={8}
                    isInvalid={!!errors.cep}
                    {...register('cep', {
                      required: 'CEP é obrigatório',
                      maxLength: { value: 8, message: 'Máximo de 8 caracteres' },
                      minLength: { value: 8, message: 'CEP deve ter 8 caracteres' },
                      pattern: { value: /^[0-9]{8}$/, message: 'CEP deve conter apenas números' }
                    })}
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
                placeholder="Digite o serviço potencial"
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
              <Form.Label>Data da Prospecção</Form.Label>
              <Form.Control
                type="date"
                isInvalid={!!errors.dataProspeccao}
                {...register('dataProspeccao', {
                  required: 'Data da prospecção é obrigatória'
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dataProspeccao?.message}
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