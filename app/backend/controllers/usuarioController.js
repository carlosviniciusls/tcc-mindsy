const pool = require('../db/connection');
const bcrypt = require('bcryptjs');

exports.obterUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaCriptografada]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
      [email]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    delete usuario.senha;
    res.json({ message: 'Login bem-sucedido!', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza apenas o nome do usuário e retorna o objeto atualizado
exports.atualizarNome = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    await pool.query(
      'UPDATE usuarios SET nome = ? WHERE id = ?',
      [nome.trim(), id]
    );
    const [rows] = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE id = ?',
      [id]
    );
    res.json({ usuario: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza apenas a senha, validando a antiga antes
exports.atualizarSenha = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Senha atual e nova senha são obrigatórias.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT senha FROM usuarios WHERE id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaAtual = rows[0].senha;
    const senhaValida = await bcrypt.compare(oldPassword, senhaAtual);
    if (!senhaValida) {
      return res.status(403).json({ message: 'Senha atual incorreta.' });
    }

    const senhaCriptografada = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [senhaCriptografada, id]
    );

    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
