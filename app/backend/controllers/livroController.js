const pool = require('../db/connection');

// Listar todos os livros
exports.listarLivros = async (req, res) => {
  try {
    const [livros] = await pool.query(`
      SELECT livros.*, maquinas.nome AS nome_maquina
      FROM livros
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
    `);
    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros.' });
  }
};

// Buscar livro por título
exports.buscarLivroPorTitulo = async (req, res) => {
  const { titulo } = req.query;
  if (!titulo) return res.status(400).json({ message: 'Parâmetro "titulo" é obrigatório.' });

  try {
    const [livros] = await pool.query(`
      SELECT livros.*, maquinas.nome AS nome_maquina
      FROM livros
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
      WHERE livros.titulo LIKE ?
    `, [`%${titulo}%`]);

    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livro por título.' });
  }
};

// Detalhes de um livro por ID
exports.detalhesLivro = async (req, res) => {
  const { id } = req.params;
  try {
    const [livros] = await pool.query(`
      SELECT livros.*, maquinas.nome AS nome_maquina
      FROM livros
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
      WHERE livros.id = ?
    `, [id]);

    if (!livros.length) {
      return res.status(404).json({ message: 'Livro não encontrado.' });
    }

    res.json(livros[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do livro.' });
  }
};

// Filtrar por tipo (pessoal/profissional)
exports.filtrarPorTipo = async (req, res) => {
  const { tipo } = req.params;
  if (!['pessoal', 'profissional'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo deve ser "pessoal" ou "profissional".' });
  }

  try {
    const [livros] = await pool.query(`
      SELECT livros.*, maquinas.nome AS nome_maquina
      FROM livros
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
      WHERE livros.tipo = ?
    `, [tipo]);

    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao filtrar livros por tipo.' });
  }
};

// Filtrar livros disponíveis por máquina
exports.filtrarPorMaquina = async (req, res) => {
  const { maquinaId } = req.params;
  try {
    const [livros] = await pool.query(`
      SELECT livros.*, maquinas.nome AS nome_maquina
      FROM livros
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
      WHERE livros.maquina_id = ? AND livros.status = 'disponivel'
    `, [maquinaId]);

    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros da máquina.' });
  }
};
