const pool = require('../db/connection');

// Criar nova reserva
exports.criarReserva = async (req, res) => {
  const { usuario_id, livro_id } = req.body;

  try {
    // Verifica se o usuário já tem uma reserva ativa
    const [existeReserva] = await pool.query(
      'SELECT id FROM reservas WHERE usuario_id = ? AND status = "ativa"',
      [usuario_id]
    );

    if (existeReserva.length > 0) {
      return res.status(400).json({
        message: 'Você já possui uma reserva ativa. Cancele ou retire antes de reservar outro livro.'
      });
    }

    // Verifica se o livro está disponível
    const [livros] = await pool.query(
      'SELECT status FROM livros WHERE id = ?',
      [livro_id]
    );

    if (!livros.length) {
      return res.status(404).json({ message: 'Livro não encontrado.' });
    }

    if (livros[0].status !== 'disponivel') {
      return res.status(400).json({ message: 'Livro não está disponível para reserva.' });
    }

    // Cria a reserva e atualiza o status do livro
    await pool.query(
      'INSERT INTO reservas (usuario_id, livro_id, status) VALUES (?, ?, "ativa")',
      [usuario_id, livro_id]
    );

    await pool.query(
      'UPDATE livros SET status = "reservado" WHERE id = ?',
      [livro_id]
    );

    res.status(201).json({ message: 'Reserva criada com sucesso!' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Listar reservas ativas de um usuário
exports.reservasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const [reservas] = await pool.query(`
      SELECT reservas.*, livros.titulo, livros.imagem_url, maquinas.nome AS nome_maquina
      FROM reservas
      JOIN livros ON reservas.livro_id = livros.id
      LEFT JOIN maquinas ON livros.maquina_id = maquinas.id
      WHERE reservas.usuario_id = ? AND reservas.status = 'ativa'
    `, [usuarioId]);

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancelar reserva
exports.cancelarReserva = async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  try {
    const [reserva] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);

    if (!reserva.length) return res.status(404).json({ message: 'Reserva não encontrada' });

    if (reserva[0].usuario_id != usuario_id) {
      return res.status(403).json({ message: 'Você não tem permissão para cancelar esta reserva' });
    }

    await pool.query('UPDATE reservas SET status = "cancelada" WHERE id = ?', [id]);
    await pool.query('UPDATE livros SET status = "disponivel" WHERE id = ?', [reserva[0].livro_id]);

    res.json({ message: 'Reserva cancelada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retirar livro
exports.retirarLivro = async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  try {
    const [reserva] = await pool.query('SELECT * FROM reservas WHERE id = ? AND status = "ativa"', [id]);

    if (!reserva.length) return res.status(404).json({ message: 'Reserva não encontrada ou já foi concluída.' });

    if (reserva[0].usuario_id != usuario_id) {
      return res.status(403).json({ message: 'Você não tem permissão para retirar este livro' });
    }

    await pool.query('UPDATE reservas SET status = "concluida" WHERE id = ?', [id]);

    const livroId = reserva[0].livro_id;
    const [livroData] = await pool.query('SELECT maquina_id FROM livros WHERE id = ?', [livroId]);

    await pool.query(`
      INSERT INTO historico (usuario_id, livro_id, maquina_id)
      VALUES (?, ?, ?)
    `, [usuario_id, livroId, livroData[0].maquina_id]);

    res.json({ message: 'Livro retirado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
