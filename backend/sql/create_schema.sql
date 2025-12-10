CREATE TABLE dividas (
    id SERIAL PRIMARY KEY,

    -- Dados do cliente
    nome_cliente VARCHAR(200) NOT NULL,
    cpf_cliente VARCHAR(11) NOT NULL,
    email_cliente VARCHAR(200) NOT NULL,

    -- Endereço (facultativo)
    cep VARCHAR(20),
    numero VARCHAR(20),
    complemento VARCHAR(200),

    -- Dados da dívida
    valor NUMERIC(10,2) NOT NULL,
    descricao TEXT NOT NULL,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('Pendente', 'Pago')),

    -- Outros
    numero_processo VARCHAR(100),
    comprovante_path TEXT,  -- caminho do arquivo PDF

    criado_em TIMESTAMP DEFAULT NOW()
);
