CREATE TABLE IF NOT EXISTS Produto (
	id varchar(60) NOT NULL UNIQUE,
	nome varchar(30) NOT NULL,
	descricao text NOT NULL,
	id_categoria int NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Fornecedor (
	CNPJ varchar(30) NOT NULL,
	nome varchar(30) NOT NULL,
	PRIMARY KEY (CNPJ)
);

CREATE TABLE IF NOT EXISTS Funcionario (
	CPF varchar(30) NOT NULL,
	nome varchar(30) NOT NULL,
	salario_cents int NOT NULL,
	id_cargo int NOT NULL,
	descricao_funcao text NOT NULL,
	PRIMARY KEY (CPF)
);

CREATE TABLE IF NOT EXISTS Compra (
	id varchar(60) NOT NULL UNIQUE,
	CPF_funcionario varchar(30) NOT NULL,
	data timestamp NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Lote (
	id varchar(60) NOT NULL UNIQUE,
	id_produto varchar(60) NOT NULL,
	CNPJ_fornecedor varchar(30) NOT NULL,
	data_pedido timestamp NOT NULL,
	data_recebido timestamp NOT NULL,
	quantidade int NOT NULL,
	valor_cents bigint NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ItemCompra (
	id_compra varchar(60) NOT NULL,
	id_produto varchar(60) NOT NULL,
	id_lote varchar(60) NOT NULL,
	id_preco varchar(60) NOT NULL,
	quantidade int NOT NULL,
	valor_unidade_cents int NOT NULL,
	valor_final_cents int NOT NULL,
	PRIMARY KEY (id_compra, id_produto)
);

CREATE TABLE IF NOT EXISTS Preco (
	id varchar(60) NOT NULL UNIQUE,
	data_efetiva timestamp NOT NULL,
	id_produto varchar(60) NOT NULL,
	valor_cents int NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Categoria (
	id int NOT NULL,
	nome varchar(40) NOT NULL UNIQUE,
	descricao text NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Cargo (
	id int NOT NULL,
	nome varchar(30) NOT NULL,
	descricao text NOT NULL,
	PRIMARY KEY (id)
);

