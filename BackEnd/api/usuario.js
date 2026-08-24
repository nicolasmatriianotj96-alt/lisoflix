import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { aplicarCors } from '../lib/cors.js';
import { exigirUsuarioId } from '../lib/auth.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    aplicarCors(res, 'GET, PUT');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const userId = exigirUsuarioId(req);

        if (req.method === 'GET') {
            const { data: usuario, error } = await supabase
             .from('usuarios')
             .select('id, usuario, email, foto_perfil')
             .eq('id', userId)
             .single();

            if (error) throw error;

            return res.status(200).json({
                id: usuario.id,
                nome: usuario.usuario, // Pega de "usuario" e manda como "nome"
                email: usuario.email,
                foto_perfil: usuario.foto_perfil
            });
        }

        if (req.method === 'PUT') {
            const { nome, email, senha } = req.body;
            const updateData = { usuario: nome, email }; // Salva em "usuario"

            if (senha) {
                if (senha.length < 8) {
                    return res.status(400).json({ mensagem: 'Senha precisa ter 8+ caracteres' });
                }
                updateData.senha = await bcrypt.hash(senha, 10);
            }

            const { error } = await supabase
             .from('usuarios')
             .update(updateData)
             .eq('id', userId);

            if (error) throw error;
            return res.status(200).json({ mensagem: 'Perfil atualizado' });
        }

    } catch (e) {
        console.log("ERRO USUARIO:", e);
        return res.status(e.status || 500).json({ mensagem: e.status ? e.message : 'Erro ao processar requisição' });
    }
}