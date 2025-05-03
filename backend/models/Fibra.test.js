// tests/unit/models/Fibra.test.js
/*const { sequelize } = require('../../../backend/config/db');
const Fibra = require('../../../backend/models/Fibra');

describe('Modelo Fibra', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  
  afterEach(async () => {
    await Fibra.destroy({ where: {}, truncate: true });
  });
  
  test('Deve criar uma fibra com sucesso', async () => {
    const fibraData = {
      nome: 'Fibra Teste',
      quantidadeFo: 24,
      propriedade: 'Própria',
      coordenadas: JSON.stringify([
        { latitude: '-23.550520', longitude: '-46.633308' }
      ])
    };
    
    const fibra = await Fibra.create(fibraData);
    
    expect(fibra).toHaveProperty('id');
    expect(fibra.nome).toBe(fibraData.nome);
    expect(fibra.quantidadeFo).toBe(fibraData.quantidadeFo);
  });
  
  test('Deve validar campos obrigatórios', async () => {
    try {
      await Fibra.create({
        // Faltando campos obrigatórios
      });
      // Se chegar aqui, o teste falhou
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.name).toBe('SequelizeValidationError');
    }
  });
});
