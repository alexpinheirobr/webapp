const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const xml2js = require('xml2js');
const Fibra = require('../models/Fibra');

// Configurar armazenamento para upload de arquivos KML
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/vnd.google-earth.kml+xml' && 
        file.originalname.split('.').pop().toLowerCase() !== 'kml') {
      return cb(new Error('Apenas arquivos KML são permitidos'));
    }
    cb(null, true);
  }
});

// @desc    Importar arquivo KML de malha de fibra
// @route   POST /api/kml/importar
// @access  Private
router.post('/importar', upload.single('kmlFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
    }

    const kmlFilePath = req.file.path;
    const kmlData = fs.readFileSync(kmlFilePath, 'utf8');

    // Parsear o arquivo KML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(kmlData);

    // Processar os dados do KML
    const placemarks = result.kml.Document[0].Placemark;
    
    if (!placemarks || placemarks.length === 0) {
      return res.status(400).json({ message: 'Nenhum dado de fibra encontrado no arquivo KML' });
    }

    let fibrasAdicionadas = 0;
    let fibrasAtualizadas = 0;

    for (const placemark of placemarks) {
      const nome = placemark.name[0];
      
      // Extrair propriedades da descrição (se disponível)
      let quantidadeFo = 1;
      let propriedade = 'Própria';
      
      if (placemark.description && placemark.description[0]) {
        const descricao = placemark.description[0];
        
        // Tentar extrair quantidade de FO e propriedade da descrição
        const foMatch = descricao.match(/FO:\s*(\d+)/i);
        if (foMatch && foMatch[1]) {
          quantidadeFo = parseInt(foMatch[1]);
        }
        
        const propMatch = descricao.match(/Propriedade:\s*([^\n]+)/i);
        if (propMatch && propMatch[1]) {
          propriedade = propMatch[1].trim();
        }
      }
      
      // Extrair coordenadas
      let coordenadas = [];
      
      if (placemark.LineString && placemark.LineString[0].coordinates) {
        const coordStr = placemark.LineString[0].coordinates[0].trim();
        const coordPairs = coordStr.split(' ');
        
        coordenadas = coordPairs.map(pair => {
          const [lng, lat, alt] = pair.split(',');
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });
      }
      
      // Verificar se a fibra já existe
      let fibra = await Fibra.findOne({ nome });
      
      if (fibra) {
        // Atualizar fibra existente
        fibra.quantidadeFo = quantidadeFo;
        fibra.propriedade = propriedade;
        fibra.coordenadas = coordenadas;
        fibra.updatedAt = Date.now();
        
        await fibra.save();
        fibrasAtualizadas++;
      } else {
        // Criar nova fibra
        fibra = new Fibra({
          nome,
          quantidadeFo,
          propriedade,
          coordenadas
        });
        
        await fibra.save();
        fibrasAdicionadas++;
      }
    }
    
    // Remover o arquivo KML após processamento
    fs.unlinkSync(kmlFilePath);
    
    res.json({
      message: 'Arquivo KML importado com sucesso',
      fibrasAdicionadas,
      fibrasAtualizadas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao importar arquivo KML' });
  }
});

module.exports = router;
