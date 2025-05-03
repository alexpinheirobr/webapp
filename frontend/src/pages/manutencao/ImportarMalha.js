import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

function ImportarMalha() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Verificar se o arquivo é do tipo KML
      if (selectedFile.name.endsWith('.kml') || selectedFile.type === 'application/vnd.google-earth.kml+xml') {
        setFile(selectedFile);
      } else {
        showAlert('danger', 'Por favor, selecione um arquivo KML válido.');
        setFile(null);
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      showAlert('warning', 'Por favor, selecione um arquivo KML para importar.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulação de importação - será substituída pela chamada real à API
      setTimeout(() => {
        const mockResultado = {
          fibrasAdicionadas: 3,
          fibrasAtualizadas: 2
        };
        
        setResultado(mockResultado);
        showAlert('success', 'Arquivo KML importado com sucesso!');
        setLoading(false);
        setFile(null);
        
        // Limpar o input de arquivo
        const fileInput = document.getElementById('formFile');
        if (fileInput) {
          fileInput.value = '';
        }
      }, 2000);
      
      // Código para chamada real à API (comentado)
      // const formData = new FormData();
      // formData.append('kmlFile', file);
      // 
      // const response = await axios.post('/api/kml/importar', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      // 
      // setResultado({
      //   fibrasAdicionadas: response.data.fibrasAdicionadas,
      //   fibrasAtualizadas: response.data.fibrasAtualizadas
      // });
      // showAlert('success', 'Arquivo KML importado com sucesso!');
    } catch (error) {
      console.error('Erro ao importar arquivo KML:', error);
      showAlert('danger', 'Erro ao importar arquivo KML. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 5000);
  };

  return (
    <Container>
      <h2 className="mb-4">Importar Malha</h2>
      
      {alert.show && (
        <Alert variant={alert.variant}>{alert.message}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Instruções</Card.Title>
          <Card.Text>
            Selecione um arquivo KML contendo a malha de fibra para importação. O sistema irá:
            <ul>
              <li>Adicionar novas fibras ao banco de dados</li>
              <li>Atualizar fibras existentes com os novos campos</li>
            </ul>
            O arquivo KML deve conter os seguintes dados:
            <ul>
              <li>Nome da fibra</li>
              <li>Coordenadas geográficas</li>
              <li>Opcionalmente: quantidade de FO e propriedade na descrição</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Selecione o arquivo KML</Form.Label>
          <Form.Control 
            type="file" 
            accept=".kml,application/vnd.google-earth.kml+xml"
            onChange={handleFileChange}
            disabled={loading}
          />
          <Form.Text className="text-muted">
            Apenas arquivos KML são aceitos.
          </Form.Text>
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={!file || loading}>
          {loading ? 'Importando...' : 'Importar Arquivo'}
        </Button>
      </Form>
      
      {resultado && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Resultado da Importação</Card.Title>
            <Card.Text>
              <strong>Fibras adicionadas:</strong> {resultado.fibrasAdicionadas}<br />
              <strong>Fibras atualizadas:</strong> {resultado.fibrasAtualizadas}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ImportarMalha;
