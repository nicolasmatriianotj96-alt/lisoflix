export function aplicarCors(res, methods) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', `${methods}, OPTIONS`);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
