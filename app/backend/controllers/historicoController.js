const pool = require('../db/connection');

exports.listarHistorico = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [historico] = await pool.query(
      `SELECT h.id, l.titulo, l.autor, h.data_retirada, m.nome AS maquina
       FROM historico h
       JOIN livros l ON h.livro_id = l.id
       JOIN maquinas m ON h.maquina_id = m.id
       WHERE h.usuario_id = ?
       ORDER BY h.data_retirada DESC`,
      [usuarioId]
    );

    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
