const pool = require('../../connect');

async function listAllCategories(req, res) {

    try {
        const categories = await pool.query('SELECT * FROM categorias');
    
        const result = categories.rows.map((category) => ({
            id: category.id, 
            descricao: category.descricao
        }));
    
        return res.status(200).json(result);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

module.exports = listAllCategories;