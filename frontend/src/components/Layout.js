import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="ms-auto">
          <Header />
          <main className="content">
            <Outlet />
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
