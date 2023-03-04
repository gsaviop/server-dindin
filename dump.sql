-- Database: dindin

-- DROP DATABASE IF EXISTS dindin;

CREATE DATABASE dindin
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	senha VARCHAR(100) NOT NULL
)

CREATE TABLE categorias (
	id SERIAL PRIMARY KEY,
	descricao TEXT
)

CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
	descricao TEXT,
	valor INT NOT NULL,
	data VARCHAR NOT NULL,
	categoria_id INT REFERENCES categorias(id) NOT NULL,
	usuario_id INT REFERENCES usuarios(id) NOT NULL
)

ALTER TABLE transacoes
ADD COLUMN tipo VARCHAR NOT NULL

INSERT INTO categorias (descricao)
VALUES 
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');