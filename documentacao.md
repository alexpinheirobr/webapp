# Documentação do Sistema de Prospecção de Clientes para Links

## Visão Geral

Este sistema foi desenvolvido para auxiliar na prospecção de clientes para Links, permitindo o gerenciamento de fibras, clientes e prospects, com funcionalidades de geolocalização e geração de mapas de calor.

## Arquitetura

O sistema foi desenvolvido utilizando a seguinte arquitetura:

- **Backend**: Node.js com Express, MongoDB e Mongoose
- **Frontend**: React com TypeScript, React Bootstrap e Google Maps API
- **Autenticação**: JWT (JSON Web Token)

## Estrutura do Projeto

```
prospecao-clientes/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── pages/
│       │   ├── cadastro/
│       │   ├── manutencao/
│       │   └── prospeccao/
│       ├── services/
│       └── App.tsx
└── tests/
```

## Funcionalidades Principais

### 1. Gerenciamento de Fibras

- Cadastro, edição, visualização e exclusão de fibras
- Importação de malha de fibra via arquivo KML
- Visualização de fibras no mapa

### 2. Gerenciamento de Clientes

- Cadastro, edição, visualização e exclusão de clientes
- Geolocalização de endereços
- Visualização de clientes no mapa

### 3. Gerenciamento de Prospects

- Cadastro, edição, visualização e exclusão de prospects
- Identificação automática de prospects via mapa de calor
- Salvamento de prospects por segmento

### 4. Mapas de Calor

- Geração de mapa de calor por fibra
- Geração de mapa de calor por cliente
- Identificação de prospects em áreas de interesse

### 5. Importação de KML

- Importação de arquivos KML para malha de fibra
- Processamento automático de coordenadas

## Tecnologias Utilizadas

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer (upload de arquivos)
- TurfJS (processamento geoespacial)
- XML2JS (processamento de KML)

### Frontend

- React
- TypeScript
- React Bootstrap
- React Router
- Axios
- Google Maps API (@react-google-maps/api)

## Instalação e Configuração

### Requisitos

- Node.js (v14 ou superior)
- MongoDB
- Chave de API do Google Maps

### Passos para Instalação

1. Clone o repositório
2. Instale as dependências do backend:
   ```
   cd backend
   npm install
   ```
3. Instale as dependências do frontend:
   ```
   cd frontend
   npm install
   ```
4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta backend com as seguintes variáveis:
     ```
     MONGO_URI=sua_uri_do_mongodb
     JWT_SECRET=seu_segredo_jwt
     PORT=5000
     ```
   - Crie um arquivo `.env` na pasta frontend com as seguintes variáveis:
     ```
     REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps
     REACT_APP_API_URL=http://localhost:5000/api
     ```

### Execução

1. Inicie o backend:
   ```
   cd backend
   npm start
   ```
2. Inicie o frontend:
   ```
   cd frontend
   npm start
   ```

## Uso do Sistema

### Autenticação

- Acesse a página de login
- Use as credenciais padrão (admin/admin) para o primeiro acesso
- Altere a senha após o primeiro login

### Cadastro de Fibras

1. Acesse o menu "Cadastro > Fibras"
2. Preencha o formulário com os dados da fibra
3. Clique em "Cadastrar"

### Importação de KML

1. Acesse o menu "Manutenção > Importar Malha"
2. Selecione o arquivo KML
3. Clique em "Importar Arquivo"

### Geração de Mapa de Calor

1. Acesse o menu "Prospecção > HeatMap por Fibra" ou "Prospecção > HeatMap por Cliente"
2. Selecione as fibras ou bairros
3. Defina a largura em metros
4. Clique em "Gerar Mapa de Calor"
5. Para identificar prospects, clique em "Identificar Prospects"
6. Para salvar prospects, clique em "Salvar Prospects" e selecione os segmentos

## Manutenção e Suporte

### Backup do Banco de Dados

Recomenda-se realizar backups periódicos do banco de dados MongoDB:

```
mongodump --uri="sua_uri_do_mongodb" --out=backup_folder
```

### Atualização do Sistema

1. Pare os serviços de backend e frontend
2. Faça backup do banco de dados
3. Atualize o código via git pull ou substituição de arquivos
4. Instale novas dependências, se houver
5. Reinicie os serviços

## Considerações de Segurança

- Mantenha a chave JWT_SECRET segura e complexa
- Não compartilhe a chave da API do Google Maps
- Implemente HTTPS em ambiente de produção
- Atualize regularmente as dependências para corrigir vulnerabilidades

## Limitações Conhecidas

- A importação de KML suporta apenas arquivos no formato padrão do Google Earth
- A geolocalização depende da disponibilidade e precisão da API do Google Maps
- A identificação de prospects é baseada em proximidade geográfica e pode requerer validação manual

## Contato e Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com:

- Email: suporte@exemplo.com
- Telefone: (11) 1234-5678
