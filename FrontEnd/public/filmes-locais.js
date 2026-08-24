// Catálogo local do LisoFlix.
// Serve como fallback (e fonte principal enquanto o backend/Supabase não está
// configurado) para o site sempre ter conteúdo navegável, mesmo offline.
//
// Vídeos: recortes curtos de curtas-metragens de código aberto da Blender
// Foundation (Big Buck Bunny, Sintel — licença CC BY 3.0) e o clipe de teste
// "Jellyfish" (uso livre), servidos por test-videos.co.uk. Nenhum conteúdo
// protegido por direitos autorais é usado — ver FrontEnd/public/videos/CREDITOS.txt.

const FILMES_LOCAIS = [
    {
        id: 1,
        titulo: "Big Buck Bunny",
        genero: "Ação",
        ano: 2008,
        classificacao: "Livre",
        icone: "🐰",
        corA: "#2d5a27",
        corB: "#8bc34a",
        descricao: "Um coelho gigante e pacato é provocado por três roedores implicantes. Cansado de apanhar, decide bolar um plano para virar o jogo de vez.",
        preview: "videos/bigbuckbunny_360.mp4",
        video: "videos/bigbuckbunny_720.mp4",
        destaque: true
    },
    {
        id: 2,
        titulo: "Fuga Total",
        genero: "Ação",
        ano: 2009,
        classificacao: "12",
        icone: "🏃",
        corA: "#b71c1c",
        corB: "#ff5722",
        descricao: "Uma perseguição frenética pela floresta: quando ser gentil não funciona mais, resta improvisar uma fuga cheia de armadilhas.",
        preview: "videos/bigbuckbunny_360.mp4",
        video: "videos/bigbuckbunny_720.mp4"
    },
    {
        id: 3,
        titulo: "Vingança na Floresta",
        genero: "Ação",
        ano: 2010,
        classificacao: "14",
        icone: "🌲",
        corA: "#1b3a1b",
        corB: "#6d4c22",
        descricao: "Depois de anos sendo o alvo das piadas da floresta, o herói decide que chegou a hora de ensinar uma lição aos valentões.",
        preview: "videos/bigbuckbunny_360.mp4",
        video: "videos/bigbuckbunny_720.mp4"
    },
    {
        id: 4,
        titulo: "Sintel",
        genero: "Fantasia",
        ano: 2010,
        classificacao: "12",
        icone: "🐉",
        corA: "#1a1a4e",
        corB: "#6a3093",
        descricao: "Uma jovem guerreira solitária parte em uma jornada épica por terras desoladas em busca de um pequeno dragão que ela criou e perdeu.",
        preview: "videos/sintel_360.mp4",
        video: "videos/sintel_720.mp4",
        destaque: true
    },
    {
        id: 5,
        titulo: "Guerreira das Sombras",
        genero: "Fantasia",
        ano: 2011,
        classificacao: "14",
        icone: "⚔️",
        corA: "#2c0735",
        corB: "#6a0dad",
        descricao: "Em um mundo devastado, uma guerreira enfrenta criaturas e tempestades para reencontrar algo que jurou nunca abandonar.",
        preview: "videos/sintel_360.mp4",
        video: "videos/sintel_720.mp4"
    },
    {
        id: 6,
        titulo: "A Última Jornada",
        genero: "Fantasia",
        ano: 2012,
        classificacao: "16",
        icone: "🗡️",
        corA: "#0f2027",
        corB: "#2c5364",
        descricao: "Nem toda jornada tem volta. Uma aventurista cruza paisagens geladas em busca de respostas que talvez não queira encontrar.",
        preview: "videos/sintel_360.mp4",
        video: "videos/sintel_720.mp4"
    },
    {
        id: 7,
        titulo: "Vida Marinha",
        genero: "Documentário",
        ano: 2013,
        classificacao: "Livre",
        icone: "🐙",
        corA: "#005c97",
        corB: "#363795",
        descricao: "Um mergulho hipnotizante no mundo silencioso das águas-vivas, flutuando em câmera lenta pelas profundezas do oceano.",
        preview: "videos/jellyfish_360.mp4",
        video: "videos/jellyfish_720.mp4",
        destaque: true
    },
    {
        id: 8,
        titulo: "Oceano Azul",
        genero: "Documentário",
        ano: 2014,
        classificacao: "Livre",
        icone: "🌊",
        corA: "#00c6ff",
        corB: "#0072ff",
        descricao: "Correntes, luz e criaturas translúcidas dançando no azul profundo — uma pausa contemplativa para respirar.",
        preview: "videos/jellyfish_360.mp4",
        video: "videos/jellyfish_720.mp4"
    },
    {
        id: 9,
        titulo: "Profundezas",
        genero: "Documentário",
        ano: 2015,
        classificacao: "Livre",
        icone: "🪼",
        corA: "#0f0c29",
        corB: "#302b63",
        descricao: "Quanto mais fundo se vai, mais estranho e bonito o oceano se torna. Uma jornada visual sem pressa nenhuma.",
        preview: "videos/jellyfish_360.mp4",
        video: "videos/jellyfish_720.mp4"
    }
];
