import { createClient } from '@supabase/supabase-js';
import { aplicarCors } from '../lib/cors.js';
import { exigirUsuarioId } from '../lib/auth.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    aplicarCors(res, 'POST');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const userId = exigirUsuarioId(req);
        const { filme_id } = req.body;

        if (!filme_id) return res.status(400).json({ mensagem: 'filme_id faltando' });

        // 1. Verifica se já existe
        const { data: existe, error: errBusca } = await supabase
          .from('favoritos')
          .select('id')
          .eq('usuario_id', userId)
          .eq('filme_id', filme_id)
          .maybeSingle(); // maybeSingle não quebra se não achar

        if (errBusca) throw errBusca;

        if (existe) {
            // 2. Se existe, REMOVE
            const { error: errDel } = await supabase.from('favoritos').delete().eq('id', existe.id);
            if (errDel) throw errDel;
            return res.status(200).json({ mensagem: 'Removido dos favoritos' });
        } else {
            // 3. Se não existe, ADICIONA
            const { error: errIns } = await supabase.from('favoritos').insert([{ usuario_id: userId, filme_id }]);
            if (errIns) throw errIns;
            return res.status(200).json({ mensagem: 'Adicionado aos favoritos' });
        }

    } catch (e) {
        console.log("ERRO FAVORITAR:", e);
        return res.status(e.status || 500).json({ mensagem: e.status ? e.message : 'Erro ao processar requisição' });
    }
}