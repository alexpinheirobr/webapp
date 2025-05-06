import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

function CadastroUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      // Simulação de chamada à API - será substituída pela chamada real
      setTimeout(() => {
        const mockUsuarios = [
          { _id: '1', nome: 'Administrador', email: 'admin@exemplo.com' },
          { _id: '2', nome: 'Usuário Teste', email: 'usuario@exemplo.com' }
        ];
        setUsuarios(mockUsuarios);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      showAlert('danger', 'Erro ao carregar dados de usuários.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmSenha('');
    setEditMode(false);
    setCurrentId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senha
    if (senha !== confirmSenha) {
      showAlert('danger', 'As senhas não coincidem.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editMode) {
        // Simulação de atualização - será substituída pela chamada real à API
        setTimeout(() => {
          const updatedUsuarios = usuarios.map(usuario => 
            usuario._id === currentId ? { ...usuario, nome, email } : usuario
          );
          setUsuarios(updatedUsuarios);
          resetForm();
          showAlert('success', 'Usuário atualizado com sucesso!');
          setLoading(false);
        }, 500);
      } else {
        // Simulação de criação - será substituída pela chamada real à API
        setTimeout(() => {
          const newUsuario = {
            _id: Date.now().toString(),
            nome,
            email
          };
          setUsuarios([...usuarios, newUsuario]);
          resetForm();
          showAlert('success', 'Usuário cadastrado com sucesso!');
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      showAlert('danger', `Erro ao ${editMode ? 'atualizar' : 'cadastrar'} usuário.`);
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setSenha('');
    setConfirmSenha('');
    setEditMode(true);
    setCurrentId(usuario._id);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Simulação de exclusão - será substituída pela chamada real à API
      setTimeout(() => {
        const updatedUsuarios = usuarios.filter(usuario => usuario._id !== deleteId);
        setUsuarios(updatedUsuarios);
        setShowModal(false);
        showAlert('success', 'Usuário removido com sucesso!');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showAlert('danger', 'Erro ao remover usuário.');
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
    <Container className="cadastro-root">
      <h2 className="mb-4">Cadastro de Usuários</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Row>
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={40}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={60}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{editMode ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}</Form.Label>
              <Form.Control
                type="password"
                placeholder={editMode ? 'Nova senha (opcional)' : 'Digite a senha'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required={!editMode}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{editMode ? 'Confirmar Nova Senha' : 'Confirmar Senha'}</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme a senha"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required={!editMode}
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
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleEdit(usuario)}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => confirmDelete(usuario._id)}
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
          Tem certeza que deseja excluir este usuário?
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

export default CadastroUsuario;
