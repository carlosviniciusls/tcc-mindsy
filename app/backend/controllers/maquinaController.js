const pool = require('../db/connection');

// GET /api/maquinas → lista todas as máquinas
exports.listarMaquinas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM maquinas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/maquinas/:id/livros → lista livros disponíveis na máquina X
exports.livrosPorMaquina = async (req, res) => {
  const { id } = req.params;
  try {
    const [livros] = await pool.query(
      'SELECT * FROM livros WHERE maquina_id = ? AND status = "disponivel"',
      [id]
    );

    if (!livros.length) {
      return res.status(404).json({ message: 'Nenhum livro disponível nesta máquina.' });
    }

    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/maquinas/livro/:livroId → lista máquinas que possuem o livro X
exports.maquinasPorLivro = async (req, res) => {
  const { livroId } = req.params;
  try {
    const [maquinas] = await pool.query(
      `SELECT m.id, m.nome, m.localizacao 
       FROM maquinas m
       JOIN livros l ON l.maquina_id = m.id
       WHERE l.id = ?`,
      [livroId]
    );

    if (!maquinas.length) {
      return res.status(404).json({ message: 'Nenhuma máquina encontrada com este livro.' });
    }

    res.json(maquinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
