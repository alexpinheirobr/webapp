import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Home() {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Bem-vindo ao Sistema de Prospecção de Clientes para Links</h2>
          <p className="lead">
            Este sistema ajuda no processo de prospecção de novos clientes para serviços de links de Internet ou ponto a ponto (lan to lan),
            considerando empresas que estão instaladas próximas à malha de fibra existente ou aos clientes já instalados.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header as="h5">Cadastro</Card.Header>
            <Card.Body>
              <Card.Text>
                Gerencie o cadastro de fibras, clientes e prospects para sua rede.
              </Card.Text>
              <ul>
                <li>Cadastro de Fibra</li>
                <li>Cadastro de Clientes</li>
                <li>Cadastro de Prospects</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header as="h5">Prospecção</Card.Header>
            <Card.Body>
              <Card.Text>
                Gere mapas de calor para identificar potenciais clientes próximos à sua infraestrutura.
              </Card.Text>
              <ul>
                <li>Gerar HeatMap por Fibra</li>
                <li>Gerar HeatMap por Cliente</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header as="h5">Manutenção</Card.Header>
            <Card.Body>
              <Card.Text>
                Importe dados de malha de fibra e gerencie usuários do sistema.
              </Card.Text>
              <ul>
                <li>Importar Malha</li>
                <li>Cadastro de Usuários</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
