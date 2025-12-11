import db from '../db.js';

const getAllDividas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM dividas');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching dividas:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};

const createDivida = async (req, res) => {  
    try {
        const {nome_cliente, cpf_cliente, email_cliente, cep, numero, complemento, 
            valor, descricao, situacao, numero_processo} = req.body;

        const comprovante = req.file ? req.file.buffer : null;

        if (!nome_cliente || !cpf_cliente || !email_cliente || !valor || !descricao || !situacao) {
            return res.status(400).json({
                error: "Campos obrigatórios não preenchidos."
            });
        }

        // CPF precisa ter 11 dígitos
        if (!/^\d{11}$/.test(cpf_cliente)) {
            return res.status(400).json({ error: "CPF inválido." });
        }

        // E-mail básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_cliente)) {
            return res.status(400).json({ error: "E-mail inválido." });
        }

        // Valor deve ser número positivo
        if (isNaN(valor) || Number(valor) <= 0) {
            return res.status(400).json({ error: "Valor inválido." });
        }

        // Situação só pode ser "pendente" ou "pago"
        const situacoesValidas = ["pendente", "pago"];
        if (!situacoesValidas.includes(situacao)) {
            return res.status(400).json({ error: "Situação inválida." });
        }


        const sql = `
            INSERT INTO dividas (
                nome_cliente, cpf_cliente, email_cliente, cep,
                numero, complemento, valor, descricao, situacao,
                numero_processo, comprovante
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *;
        `;

        const values = [nome_cliente, cpf_cliente, email_cliente, cep, numero, complemento, 
            valor, descricao, situacao, numero_processo, comprovante];
        const result =  await db.query(sql, values);
        
        res.status(201).json(result.rows[0]);
        console.log('Divida created successfully:', result.rows[0]);
    } catch (error) {
        console.error('Error creating divida:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteDivida = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM dividas WHERE id = $1 RETURNING *;';
        const values = [id];
        const result = await db.query(sql, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Divida not found' });
        }
        res.json({ message: 'Divida deleted successfully', divida: result.rows[0] });
    } catch (error) {
        console.error('Error deleting divida:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getComprovante = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT comprovante FROM dividas WHERE id = $1;';
        const values = [id];
        const result = await db.query(sql, values);
        if (result.rowCount === 0 || !result.rows[0].comprovante) {
            return res.status(404).json({ error: 'Comprovante not found' });
        }

        const arquivoBase64 = result.rows[0].comprovante;

        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(arquivoBase64, 'base64'));
    } catch (error) {
        console.error('Error fetching comprovante:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




export default {
    getAllDividas,
    createDivida,
    deleteDivida,
    getComprovante

};