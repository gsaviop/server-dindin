const pool = require('../../connect');


async function listUserTransactions(req, res) {
    const userId = req.user.id;

    try {

        const query = `SELECT 
                        transacoes.id,
                        transacoes.tipo,
                        transacoes.descricao,
                        transacoes.valor, 
                        transacoes.data,
                        transacoes.usuario_id,
                        transacoes.categoria_id,
                        categorias.descricao AS categoria_nome 
                        FROM transacoes 
                        JOIN categorias
                        ON transacoes.categoria_id = categorias.id
                        WHERE transacoes.usuario_id = $1`;

        const queryTransactions = await pool.query(query, [userId]);

        const result = queryTransactions.rows;

        return res.status(200).json(result)

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

async function checkUserTransactionById(req, res) {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const isTransactionValid = await pool.query('SELECT * FROM transacoes WHERE id = $1', [transactionId]);


    if(isTransactionValid.rowCount === 0) {
        return res.status(404).json({"mensagem": "Transação não encontrada no banco de dados"});
    }

    try {
        const queryparams = [transactionId, userId];
        const queryTransaction = await pool.query('SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', queryparams);
        
        return res.status(200).json(queryTransaction.rows[0]);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"}); 
    }
}

async function registerUserTransaction(req, res) {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const userId = req.user.id;

    if(!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({"mensagem": "Todos os campos obrigatórios devem ser informados."});
    }

    
    try {
        const isCategoryValid = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);
    
        if(isCategoryValid.rowCount === 0) {
            return res.status(404).json({"mensagem": "Categoria de transação não encontrada no banco de dados"});
        }
    
        if(tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({"mensagem": "Tipo de transação não reconhecido"});
        }
    
        const query = `INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING *`;
    
        const result = await pool.query(query, [descricao, valor, data, categoria_id, userId, tipo]);

        const { rows } = await pool.query(`SELECT 
            categorias.descricao AS categoria_nome 
            FROM categorias 
            WHERE id = $1`, [categoria_id])
    
            const categoria_nome = rows[0]
            const newTransaction = {
                ...result.rows[0],
                ...categoria_nome
            }

        return res.status(201).json(newTransaction);

        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"}); 
    }


}

async function updateUserTransaction(req, res) {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const transactionId = req.params.id;
    const userId = req.user.id;

    if(!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({"mensagem": "Todos os campos obrigatórios devem ser informados."});
    }

    if(tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({"mensagem": "Tipo de transação não reconhecido"});
    }

    const isTransactionValid = await pool.query('SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [transactionId, userId]);


    if(isTransactionValid.rowCount === 0) {
        return res.status(404).json({"mensagem": "Transação não encontrada no banco de dados"});
    }

    try {
        const query = `UPDATE transacoes 
                        SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 
                        WHERE id = $6
                        RETURNING *`;

        const queryparams = [descricao, valor, data, categoria_id, tipo, transactionId];

        const updatedTransaction = await pool.query(query, queryparams);
        
        return res.status(204).json(updatedTransaction.rows[0]);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }


}

async function deleteUserTransaction(req, res) {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const isTransactionValid = await pool.query('SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [transactionId, userId]);

    if(isTransactionValid.rowCount === 0) {
        return res.status(404).json({"mensagem": "Transação não encontrada no banco de dados"});
    }

    try {
        const result = await pool.query('DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2 RETURNING *', [transactionId, userId]);

        if(result.rowCount !== 0) {
            return res.status(400).json({"mensagem": "Erro ao deletar transação"});
        }

        return res.status(204).send();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

async function getAllTransactionStatement(req, res) {
    const userId = req.user.id;

    try {
        const query = `SELECT usuario_id, tipo, SUM(valor) AS total
                        FROM transacoes
                        WHERE usuario_id = $1
                        GROUP BY usuario_id, tipo`;

        const queryStatement = await pool.query(query, [userId]);

        const statementArray = queryStatement.rows;

        const statementObj = {
            "entrada": Number(statementArray[0].total),
            "saida": Number(statementArray[1].total)
        };

        return res.status(200).json(statementObj);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }

}


module.exports = {
    listUserTransactions,
    checkUserTransactionById,
    registerUserTransaction,
    updateUserTransaction,
    deleteUserTransaction,
    getAllTransactionStatement
};