import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function CadastroFibra() {
  const [fibras, setFibras] = useState([]);
  const [nome, setNome] = useState('');
  const [quantidadeFo, setQuantidadeFo] = useState('');
  const [propriedade, setPropriedade] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFibras();
  }, []);

  const fetchFibras = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockFibras = [
          { _id: '1', nome: 'Fibra Centro', quantidadeFo: 24, propriedade: 'Própria' },
          { _id: '2', nome: 'Fibra Norte', quantidadeFo: 12, propriedade: 'Alugada' },
          { _id: '3', nome: 'Fibra Sul', quantidadeFo: 36, propriedade: 'Própria' }
        ];
        setFibras(mockFibras);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar fibras:', error);
      showAlert('danger', 'Erro ao carregar dados de fibras.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNome('');
    setQuantidadeFo('');
    setPropriedade('');
    setEditMode(false);
    setCurrentId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const fibraData = {
        nome,
        quantidadeFo: parseInt(quantidadeFo),
        propriedade
      };
      
      if (editMode) {
        setTimeout(() => {
          const updatedFibras = fibras.map(fibra => 
            fibra._id === currentId ? { ...fibra, ...fibraData } : fibra
          );
          setFibras(updatedFibras);
          resetForm();
          showAlert('success', 'Fibra atualizada com sucesso!');
          setLoading(false);
        }, 500);
      } else {
        setTimeout(() => {
          const newFibra = {
            _id: Date.now().toString(),
            ...fibraData
          };
          setFibras([...fibras, newFibra]);
          resetForm();
          showAlert('success', 'Fibra cadastrada com sucesso!');
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao salvar fibra:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} fibra.`);
      setLoading(false);
    }
  };

  const handleEdit = (fibra) => {
    setNome(fibra.nome);
    setQuantidadeFo(fibra.quantidadeFo.toString());
    setPropriedade(fibra.propriedade);
    setEditMode(true);
    setCurrentId(fibra._id);
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

  return (
    <Container>
      <h2 className="mb-4">Cadastro de Fibra</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Row>
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Fibra</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da fibra"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantidade de FO</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite a quantidade de FO"
                value={quantidadeFo}
                onChange={(e) => setQuantidadeFo(e.target.value)}
                min="1"
                max="99"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Propriedade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a propriedade"
                value={propriedade}
                onChange={(e) => setPropriedade(e.target.value)}
                maxLength={20}
                required
              />
            </Form.Group>
            
            <div className="d-flex">
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
