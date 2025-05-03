import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout
import Layout from './components/Layout';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';

// Cadastros
import CadastroFibra from './pages/cadastro/CadastroFibra';
import CadastroCliente from './pages/cadastro/CadastroCliente';
import CadastroProspect from './pages/cadastro/CadastroProspect';

// Prospecção
import HeatMapFibraIntegrado from './pages/prospeccao/HeatMapFibraIntegrado';
import HeatMapClienteIntegrado from './pages/prospeccao/HeatMapClienteIntegrado';

// Manutenção
import ImportarMalha from './pages/manutencao/ImportarMalha';
import CadastroUsuario from './pages/manutencao/CadastroUsuario';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* Cadastros */}
          <Route path="/cadastro/fibra" element={<CadastroFibra />} />
          <Route path="/cadastro/cliente" element={<CadastroCliente />} />
          <Route path="/cadastro/prospect" element={<CadastroProspect />} />
          
          {/* Prospecção */}
          <Route path="/prospeccao/heatmap-fibra" element={<HeatMapFibraIntegrado />} />
          <Route path="/prospeccao/heatmap-cliente" element={<HeatMapClienteIntegrado />} />
          
          {/* Manutenção */}
          <Route path="/manutencao/importar-malha" element={<ImportarMalha />} />
          <Route path="/manutencao/usuario" element={<CadastroUsuario />} />
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
