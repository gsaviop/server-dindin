const pool = require('../../connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSignature = require('../jwtSignature');

async function signUpUser(req, res) {
    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha) {
        return res.status(400).json({"mensagem": "É necessário preencher todos os campos de cadastro"});
    }

    const isEmailValid = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if(isEmailValid.rows.length > 0) {
        return res.status(403).json({"mensagem": "Já existe usuário cadastrado com o e-mail informado."});
    }

    try {
        const encryptedPassword = await bcrypt.hash(senha, 10);

        const query = `INSERT INTO usuarios (nome, email, senha)
                        VALUES ($1, $2, $3)
                        RETURNING *`

        const newUser = await pool.query(query, [nome, email, encryptedPassword]);

        return res.status(201).json(newUser.rows[0]);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

async function logInUser(req, res) {
    const { email, senha } = req.body;

    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if(user.rowCount === 0) {
            return res.status(404).json({"mensagem": "E-mail ou senha inválido(s)"});
        }

        const isPasswordValid = await bcrypt.compare(senha, user.rows[0].senha);

        if(!isPasswordValid) {
            return res.status(404).json({"mensagem": "E-mail ou senha inválido(s)"});
        }

        const token = jwt.sign({id: user.rows[0].id}, jwtSignature, {expiresIn: '1d'});

        const { senha: _, ...loggedInUser } = user.rows[0];

        return res.status(200).json({"user": loggedInUser, token});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});

    }

}

async function checkUserProfile(req, res) {
    const { id, nome, email } = req.user
    return res.status(200).json({
        id,
        nome,
        email
    });
}

async function updateUser(req, res) {
    const { nome, email, senha } = req.body;
    const userId = req.user.id;

    if(!nome || !email || !senha) {
        return res.status(400).json({"mensagem": "É necessário preencher todos os campos de cadastro"});
    }

    const isEmailValid = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if(isEmailValid.rows.length > 0) {
        return res.status(403).json({"mensagem": "O e-mail informado já está sendo utilizado por outro usuário."});
    }

    try {
        const encryptedPassword = await bcrypt.hash(senha, 10);

        const query = `UPDATE usuarios SET nome = $1, email = $2, senha = $3
                        WHERE id = $4
                        RETURNING *`;

        const updatedUser = await pool.query(query, [nome, email, encryptedPassword, userId]);
        
        return res.status(204).json(updatedUser.rows[0]);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }

}


module.exports = {
    signUpUser,
    logInUser,
    checkUserProfile,
    updateUser
}