const pool = require('../db/connection');

// Adicionar livro aos favoritos
exports.adicionarFavorito = async (req, res) => {
  const { usuario_id, livro_id } = req.body;

  try {
    await pool.query(
      'INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)',
      [usuario_id, livro_id]
    );
    res.status(201).json({ message: 'Livro adicionado aos favoritos!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Livro já está nos favoritos.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Remover livro dos favoritos
exports.removerFavorito = async (req, res) => {
  const { usuario_id, livro_id } = req.body;

  try {
    const [result] = await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = ? AND livro_id = ?',
      [usuario_id, livro_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito não encontrado.' });
    }

    res.json({ message: 'Livro removido dos favoritos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os favoritos do usuário
exports.listarFavoritos = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [favoritos] = await pool.query(`
      SELECT 
        f.data_favorito,
        l.id, l.titulo, l.autor, l.ano, l.descricao, l.imagem_url, l.tipo, l.status,
        m.nome AS nome_maquina
      FROM favoritos f
      JOIN livros l ON f.livro_id = l.id
      LEFT JOIN maquinas m ON l.maquina_id = m.id
      WHERE f.usuario_id = ?
    `, [usuarioId]);

    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
