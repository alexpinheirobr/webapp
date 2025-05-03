import React, { useState } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Importando o arquivo CSS

function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState('0');

  const handleAccordionToggle = (eventKey) => {
    setExpanded(expanded === eventKey ? null : eventKey);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img 
            src="/logo.png"
            alt="Links Logo" 
            className="sidebar-logo"
            onError={(e) => {
              console.error('Erro ao carregar a logo');
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="app-title">Prospecção de clientes para Links</div>
      </div>
      <Accordion defaultActiveKey="0" activeKey={expanded || ''}>
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={() => handleAccordionToggle('0')}>Cadastro</Accordion.Header>
          <Accordion.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/cadastro/fibra" className={isActive('/cadastro/fibra') ? 'active' : ''}>
                Cadastro de Fibra
              </Nav.Link>
              <Nav.Link as={Link} to="/cadastro/cliente" className={isActive('/cadastro/cliente') ? 'active' : ''}>
                Cadastro de Clientes
              </Nav.Link>
              <Nav.Link as={Link} to="/cadastro/prospect" className={isActive('/cadastro/prospect') ? 'active' : ''}>
                Cadastro de Prospects
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={() => handleAccordionToggle('1')}>Prospecção</Accordion.Header>
          <Accordion.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/prospeccao/heatmap-fibra" className={isActive('/prospeccao/heatmap-fibra') ? 'active' : ''}>
                Gerar HeatMap por Fibra
              </Nav.Link>
              <Nav.Link as={Link} to="/prospeccao/heatmap-cliente" className={isActive('/prospeccao/heatmap-cliente') ? 'active' : ''}>
                Gerar HeatMap por Cliente
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header onClick={() => handleAccordionToggle('2')}>Manutenção</Accordion.Header>
          <Accordion.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/manutencao/importar-malha" className={isActive('/manutencao/importar-malha') ? 'active' : ''}>
                Importar Malha
              </Nav.Link>
              <Nav.Link as={Link} to="/manutencao/usuario" className={isActive('/manutencao/usuario') ? 'active' : ''}>
                Cadastro de Usuários
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="sidebar-footer">
        <Nav.Link as={Link} to="/login" className="text-light">
          Sair
        </Nav.Link>
      </div>
    </div>
  );
}

export default Sidebar;
