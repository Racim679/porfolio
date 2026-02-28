import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_COUNTRIES = ['DZ'];

export function middleware(request: NextRequest) {
  const country = request.geo?.country;

  if (country && BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Accès restreint</title>
  <style>
    body { margin: 0; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
    .box { text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; color: #111; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Accès non disponible</h1>
    <p>Ce site n'est pas accessible depuis votre région.</p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
