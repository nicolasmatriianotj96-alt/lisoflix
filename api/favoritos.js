import { createClient } from '@supabase/supabase-js';
import { aplicarCors } from '../lib/cors.js';
import { exigirUsuarioId } from '../lib/auth.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    aplicarCors(res, 'GET');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const userId = exigirUsuarioId(req);

        const { data, error } = await supabase.from('favoritos').select('filme_id').eq('usuario_id', userId);
        if (error) throw error;
        return res.status(200).json(data);

    } catch (e) {
        console.log("ERRO FAVORITOS:", e.message);
        return res.status(e.status || 500).json({ mensagem: e.status ? e.message : 'Erro ao processar requisição' });
    }
}