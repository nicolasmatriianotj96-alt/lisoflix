import jwt from 'jsonwebtoken';

// Lê e valida o Bearer token do header Authorization, retorna o id do usuário.
// Lança um erro com `status` para o handler responder com o código HTTP correto.
export function exigirUsuarioId(req) {
    const auth = req.headers.authorization;
    if (!auth) {
        const erro = new Error('Token não enviado');
        erro.status = 401;
        throw erro;
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (e) {
        const erro = new Error('Token inválido');
        erro.status = 401;
        throw erro;
    }
}
