# Servidor estático simples para testar o FrontEnd em http://localhost
# Não depende de Node/Python - usa só o .NET que já vem no Windows.
#
# Uso:  powershell -File servidor-local.ps1  [-Porta 5500]

param(
    [int]$Porta = 5500
)

$pasta = Join-Path $PSScriptRoot "public"

$tipos = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".mp4"  = "video/mp4"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".txt"  = "text/plain; charset=utf-8"
    ".ico"  = "image/x-icon"
    ".json" = "application/json; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Porta/")

try {
    $listener.Start()
} catch {
    Write-Host "Não consegui abrir a porta $Porta. Tente outra: powershell -File servidor-local.ps1 -Porta 5501"
    exit 1
}

Write-Host "LisoFlix rodando em: http://localhost:$Porta/index.html"
Write-Host "Pressione Ctrl+C nesta janela para parar o servidor."
Write-Host ""

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    try {
        $caminho = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
        if ($caminho -eq "/") { $caminho = "/index.html" }

        $arquivo = Join-Path $pasta ($caminho.TrimStart("/") -replace "/", "\")
        $arquivo = [System.IO.Path]::GetFullPath($arquivo)

        # impede sair da pasta public/ com ../
        if (-not $arquivo.StartsWith([System.IO.Path]::GetFullPath($pasta))) {
            $res.StatusCode = 403
            $res.Close()
            continue
        }

        if (Test-Path $arquivo -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($arquivo).ToLower()
            $res.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($arquivo)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado: $caminho")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        $res.StatusCode = 500
    } finally {
        $res.OutputStream.Close()
    }
}
