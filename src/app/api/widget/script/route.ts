import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const apiKey = url.searchParams.get('apiKey');
  if (!apiKey) return new NextResponse('Missing apiKey', { status: 400 });

  const base = process.env.PUBLIC_BASE_URL || '';

  const js = `(() => {
    const container = document.createElement('div');
    container.id = 'validchat-root';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '2147483647';
    document.body.appendChild(container);

    const iframe = document.createElement('iframe');
    iframe.src = '${base}/widget?apiKey=${encodeURIComponent(apiKey)}';
    iframe.style.width = '360px';
    iframe.style.height = '520px';
    iframe.style.border = '0';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 10px 40px rgba(0,0,0,0.12)';
    iframe.style.display = 'none';
    container.appendChild(iframe);

    const btn = document.createElement('button');
    btn.textContent = 'Chat with us';
    btn.style.background = '#111827';
    btn.style.color = 'white';
    btn.style.padding = '12px 14px';
    btn.style.borderRadius = '999px';
    btn.style.border = '0';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    btn.onclick = () => { iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none'; };
    container.appendChild(btn);
  })();`;

  return new NextResponse(js, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
  });
}
