const pool = require('../db/connection');

exports.registrarHistorico = async (req, res) => {
  const { usuario_id, livro_id } = req.body;

  try {
    // Verifica se a reserva está ativa e pertence ao usuário
    const [reservas] = await pool.query(
      `SELECT r.id, l.maquina_id 
       FROM reservas r
       JOIN livros l ON r.livro_id = l.id
       WHERE r.usuario_id = ? AND r.livro_id = ? AND r.status = 'ativa'`,
      [usuario_id, livro_id]
    );

    if (reservas.length === 0) {
      return res.status(400).json({ message: 'Reserva não encontrada ou já concluída.' });
    }

    const reserva = reservas[0];

    // Inserir no histórico
    await pool.query(
      'INSERT INTO historico (usuario_id, livro_id, maquina_id) VALUES (?, ?, ?)',
      [usuario_id, livro_id, reserva.maquina_id]
    );

    // Atualizar status da reserva para 'concluida'
    await pool.query(
      'UPDATE reservas SET status = ? WHERE id = ?',
      ['concluida', reserva.id]
    );

    // Atualizar status do livro para 'indisponivel'
    await pool.query(
      'UPDATE livros SET status = ? WHERE id = ?',
      ['indisponivel', livro_id]
    );

    res.status(201).json({ message: 'Retirada registrada no histórico com sucesso!' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
