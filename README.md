# README - Sistema de Prospecção de Clientes para Links

## Sobre o Projeto

Este sistema foi desenvolvido para auxiliar na prospecção de clientes para Links, permitindo o gerenciamento de fibras, clientes e prospects, com funcionalidades de geolocalização e geração de mapas de calor.

## Funcionalidades Principais

- Cadastro e gerenciamento de fibras, clientes e prospects
- Importação de malha de fibra via arquivo KML
- Geolocalização de endereços
- Geração de mapas de calor por fibra e por cliente
- Identificação e salvamento de prospects

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- MongoDB com Mongoose
- JWT para autenticação
- TurfJS para processamento geoespacial

### Frontend
- React com TypeScript
- React Bootstrap
- Google Maps API

## Estrutura do Projeto

```
prospecao-clientes/
├── backend/         # API Node.js
├── frontend/        # Aplicação React
├── tests/           # Testes automatizados
└── documentacao.md  # Documentação completa
```

## Instalação Rápida

1. Clone o repositório
2. Instale as dependências:
   ```
   cd backend && npm install
   cd frontend && npm install
   ```
3. Configure as variáveis de ambiente:
   - Backend: MONGO_URI, JWT_SECRET, PORT
   - Frontend: REACT_APP_GOOGLE_MAPS_API_KEY, REACT_APP_API_URL

4. Inicie o backend:
   ```
   cd backend && npm start
   ```

5. Inicie o frontend:
   ```
   cd frontend && npm start
   ```

## Documentação

Para informações detalhadas sobre instalação, configuração, uso e manutenção do sistema, consulte o arquivo [documentacao.md](./documentacao.md).

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## Contato

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com:
- Email: suporte@exemplo.com
- Telefone: (11) 1234-5678
