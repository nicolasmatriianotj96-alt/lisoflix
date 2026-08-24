import { createClient } from '@supabase/supabase-js';
import { aplicarCors } from '../lib/cors.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    aplicarCors(res, 'GET');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).end();

    const { data: filmes, error } = await supabase
        .from('filmes')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.log('ERRO SUPABASE:', error); // VAI APARECER NO LOG DA VERCEL
        return res.status(500).json({ mensagem: error.message });
    }

    return res.status(200).json(filmes);
}