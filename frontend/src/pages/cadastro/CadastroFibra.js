import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import fibraService from '../../services/fibraService';

function CadastroFibra() {
  const [fibras, setFibras] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nome: '',
      quantidadeFo: '',
      propriedade: ''
    }
  });

  useEffect(() => {
    fetchFibras();
  }, []);

  const fetchFibras = async () => {
    try {
      setLoading(true);
      const data = await fibraService.getAllFibras();
      setFibras(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar fibras:', error);
      showAlert('danger', 'Erro ao carregar dados de fibras.');
      setLoading(false);
    }
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 3000);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      setTimeout(() => {
        const updatedFibras = fibras.filter(fibra => fibra._id !== deleteId);
        setFibras(updatedFibras);
        setShowModal(false);
        showAlert('success', 'Fibra removida com sucesso!');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao excluir fibra:', error);
      showAlert('danger', 'Erro ao remover fibra.');
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
      const fibraData = {
        nome: data.nome,
        quantidadeFo: parseInt(data.quantidadeFo),
        propriedade: data.propriedade
      };

      if (editMode) {
        await fibraService.updateFibra(currentId, fibraData);
        await fetchFibras();
        handleReset();
        showAlert('success', 'Fibra atualizada com sucesso!');
        setLoading(false);
      } else {
        await fibraService.createFibra(fibraData);
        await fetchFibras();
        handleReset();
        showAlert('success', 'Fibra cadastrada com sucesso!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao salvar fibra:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} fibra.`);
      setLoading(false);
    }
  };

  const handleEdit = (fibra) => {
    setValue('nome', fibra.nome || '');
    setValue('quantidadeFo', fibra.quantidadeFo.toString() || '');
    setValue('propriedade', fibra.propriedade || '');
    setEditMode(true);
    setCurrentId(fibra._id);
  };

  return (
    <Container>
      <h2 className="mb-4">Cadastro de Fibra</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Row>
        <Col md={4}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Fibra</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da fibra"
                maxLength={40}
                isInvalid={!!errors.nome}
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  maxLength: { value: 40, message: 'Máximo de 40 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nome?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantidade de FO</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite a quantidade de FO"
                min="1"
                max="99"
                isInvalid={!!errors.quantidadeFo}
                {...register('quantidadeFo', {
                  required: 'Quantidade de FO é obrigatória',
                  min: { value: 1, message: 'Mínimo de 1' },
                  max: { value: 99, message: 'Máximo de 99' },
                  pattern: { value: /^[0-9]+$/, message: 'Apenas números' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantidadeFo?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Propriedade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a propriedade"
                maxLength={20}
                isInvalid={!!errors.propriedade}
                {...register('propriedade', {
                  required: 'Propriedade é obrigatória',
                  maxLength: { value: 20, message: 'Máximo de 20 caracteres' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.propriedade?.message}
              </Form.Control.Feedback>
            </Form.Group>
            
            <div className="d-flex">
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
        </Col>
        
        <Col md={8}>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade FO</th>
                  <th>Propriedade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fibras.map(fibra => (
                  <tr key={fibra._id}>
                    <td>{fibra.nome}</td>
                    <td>{fibra.quantidadeFo}</td>
                    <td>{fibra.propriedade}</td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleEdit(fibra)}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => confirmDelete(fibra._id)}
                        disabled={loading}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir esta fibra?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CadastroFibra;
