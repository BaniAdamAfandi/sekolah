// Vercel Serverless Function — menyelesaikan alur GitHub OAuth untuk Decap CMS.
// Menukar `code` menjadi access token, lalu mengirimkannya ke jendela CMS
// via window.postMessage sesuai protokol Decap/Netlify CMS.

function renderResponse(status, content) {
  // status: 'success' | 'error'
  return `<!doctype html><html><head><meta charset="utf-8"><title>Autentikasi</title></head>
<body>
<p>Menyelesaikan proses login…</p>
<script>
  (function () {
    function receiveMessage(e) {
      // Kirim hasil ke jendela pembuka (Decap CMS)
      window.opener.postMessage(
        'authorization:github:${status}:${JSON.stringify(content)}',
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    // Handshake awal: beri tahu CMS bahwa kita siap
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`;
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!clientId || !clientSecret) {
    res.status(500).send(
      renderResponse('error', { message: 'Environment variables OAuth belum lengkap.' })
    );
    return;
  }

  const { code, state } = req.query;
  const cookies = parseCookies(req.headers.cookie);

  if (!code) {
    res.status(400).send(renderResponse('error', { message: 'Kode otorisasi tidak ditemukan.' }));
    return;
  }
  if (!state || state !== cookies.oauth_state) {
    res.status(403).send(renderResponse('error', { message: 'State tidak valid (kemungkinan CSRF).' }));
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      res.status(401).send(
        renderResponse('error', { message: data.error_description || 'Gagal memperoleh token.' })
      );
      return;
    }

    // Hapus cookie state
    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    res.status(200).send(
      renderResponse('success', { token: data.access_token, provider: 'github' })
    );
  } catch (err) {
    res.status(500).send(renderResponse('error', { message: 'Kesalahan server: ' + err.message }));
  }
}
