import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Banco de dados SQLite em memória
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Modelo Poção
const Pocao = sequelize.define('Pocao', {
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descricao: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  imagem: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  preco: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
});

// População inicial com os links fornecidos
async function initDB() {
  await sequelize.sync({ force: true });
  await Pocao.bulkCreate([
    { 
      nome: 'Blue Sky', 
      descricao: 'Essa poção provê um surto de inspiração por 24 horas. Foi utilizada por John Lennon quando escreveu Lucy in the Sky with Diamonds.', 
      imagem: 'https://i.ibb.co/ZzS7xb2/rsz-sky.png', 
      preco: 300 
    },
    { 
      nome: 'Perfume Misterioso', 
      descricao: 'Essa poção faz com que você fique cheirando lilás e groselha por 24 dias. Essência muito admirada pelos bruxos.', 
      imagem: 'https://i.ibb.co/pyhZJXf/rsz-lilas.png', 
      preco: 200 
    },
    { 
      nome: 'Poção de Pinus', 
      descricao: 'Essa poção faz com que você fique 10 cm mais alto! Observação: efeitos colaterais desconhecidos.', 
      imagem: 'https://i.ibb.co/DkzdL1q/rsz-pinus.png', 
      preco: 3000 
    },
    { 
      nome: 'Poção da Beleza Eterna', 
      descricao: 'Veneno que mata rápido.', 
      imagem: 'https://i.ibb.co/9p872NK/rsz-1beleza.png', 
      preco: 100 
    },
    { 
      nome: 'Poção do Arco Íris', 
      descricao: 'Traz felicidade momentânea. Pode durar de 10 minutos a 2 dias.', 
      imagem: 'https://i.ibb.co/PrC09MP/rsz-2unicornio.png', 
      preco: 120 
    },
    { 
      nome: 'Caldeirão das Verdades Secretas', 
      descricao: 'As pessoas lhe dirão apenas verdades por 1 hora. É necessário beber os 5L.', 
      imagem: 'https://i.ibb.co/s9Lyvj8/rsz-verdades.png', 
      preco: 150 
    }
  ]);
}
await initDB();

// Rotas
app.get('/', (req, res) => {
  res.redirect('/loja');
});

// Rota da loja (cliente)
app.get('/loja', async (req, res) => {
  const pocoes = await Pocao.findAll();
  res.render('loja', { pocoes });
});

// Rota de administração
app.get('/admin', async (req, res) => {
  const pocoes = await Pocao.findAll();
  res.render('admin', { pocoes });
});

// API REST (Web Service)
app.get('/api/pocoes', async (req, res) => {
  const pocoes = await Pocao.findAll();
  res.json(pocoes);
});

app.post('/api/pocoes', async (req, res) => {
  const { nome, descricao, imagem, preco } = req.body;
  if (!nome || !descricao || !imagem || !preco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const nova = await Pocao.create({ nome, descricao, imagem, preco });
  res.status(201).json(nova);
});

app.delete('/api/pocoes/:id', async (req, res) => {
  const id = req.params.id;
  const pocao = await Pocao.findByPk(id);
  if (!pocao) return res.status(404).json({ error: 'Poção não encontrada' });
  await pocao.destroy();
  res.json({ message: 'Poção removida com sucesso' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Loja: http://localhost:${port}/loja`);
  console.log(`Admin: http://localhost:${port}/admin`);
});
