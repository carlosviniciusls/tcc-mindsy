-- #################################################
-- Script completo para criar o banco Mindsy e popular com dados de teste
-- #################################################

USE sql10803652;

-- 2) Remove tabelas caso já existam (para rodar várias vezes sem erro)
DROP TABLE IF EXISTS historico;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS maquinas;
DROP TABLE IF EXISTS usuarios;

-- 3) Cria as tabelas conforme o schema Mindsy

CREATE TABLE usuarios (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE maquinas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  localizacao VARCHAR(255)
);

CREATE TABLE livros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(255) NOT NULL,
  autor       VARCHAR(100),
  ano         INT,
  descricao   TEXT,
  imagem_url  TEXT,
  tipo        ENUM('pessoal','profissional'),
  status      ENUM('disponivel','reservado') DEFAULT 'disponivel',
  maquina_id  INT,
  FOREIGN KEY (maquina_id) REFERENCES maquinas(id)
);

CREATE TABLE reservas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT,
  livro_id      INT,
  data_reserva  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('ativa','concluida','cancelada') DEFAULT 'ativa',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (livro_id)   REFERENCES livros(id)
);

CREATE TABLE favoritos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT,
  livro_id      INT,
  data_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (livro_id)   REFERENCES livros(id),
  UNIQUE KEY(usuario_id, livro_id)
);

CREATE TABLE historico (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT,
  livro_id       INT,
  maquina_id     INT,
  data_retirada  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (livro_id)   REFERENCES livros(id),
  FOREIGN KEY (maquina_id) REFERENCES maquinas(id)
);

-- 4) Insere dados de teste

-- 4.1) Máquinas
INSERT INTO maquinas (nome, localizacao) VALUES
  ('Biblioteca Central',   'Av. Paulista, 1000 – São Paulo, SP'),
  ('Máquina Campus Norte', 'R. Dr. Almeida Lima, 200 – São Paulo, SP'),
  ('Estudantina',          'R. Augusta, 1500 – São Paulo, SP');
  
-- 4.3) Livros
INSERT INTO livros (
  titulo, autor, ano, descricao, imagem_url, tipo, status, maquina_id
) VALUES
  (
    'Dom Casmurro',
    'Machado de Assis',
    1899,
    'Clássico da literatura brasileira.',
    'https://picsum.photos/seed/1/200/300',
    'pessoal',
    'disponivel',
    1
  ),
  (
    'Clean Code',
    'Robert C. Martin',
    2008,
    'Boas práticas de desenvolvimento de software.',
    'https://picsum.photos/seed/2/200/300',
    'profissional',
    'disponivel',
    2
  ),
  (
    '1984',
    'George Orwell',
    1949,
    'Distopia política famosa.',
    'https://picsum.photos/seed/3/200/300',
    'pessoal',
    'disponivel',
    1
  ),
  (
    'The Pragmatic Programmer',
    'Andrew Hunt',
    1999,
    'Guia de programação prática e eficiente.',
    'https://picsum.photos/seed/4/200/300',
    'profissional',
    'disponivel',
    3
  ),
  (
    'O Pequeno Príncipe',
    'Antoine de Saint-Exupéry',
    1943,
    'História poética e filosófica sobre amizade e inocência.',
    'https://picsum.photos/seed/5/200/300',
    'pessoal',
    'disponivel',
    2
  ),
  (
    'Design Patterns',
    'Erich Gamma et al.',
    1994,
    'Padrões de projeto de software fundamentais.',
    'https://picsum.photos/seed/6/200/300',
    'profissional',
    'disponivel',
    3
  );

