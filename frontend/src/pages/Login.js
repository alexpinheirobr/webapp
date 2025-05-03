import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulação de login - será substituído pela chamada real à API
      setTimeout(() => {
        if (email === 'admin@exemplo.com' && senha === 'admin') {
          localStorage.setItem('userToken', 'token-simulado');
          window.location.href = '/';
        } else {
          setError('Credenciais inválidas');
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <Card className="login-form">
        <Card.Body>
          <h2 className="text-center mb-4">Prospecção de Clientes para Links</h2>
          <h4 className="text-center mb-4">Login</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Para demonstração, use: admin@exemplo.com / admin
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
