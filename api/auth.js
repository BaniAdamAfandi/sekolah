// Vercel Serverless Function — memulai alur GitHub OAuth untuk Decap CMS.
// Membutuhkan Environment Variables di Vercel:
//   OAUTH_GITHUB_CLIENT_ID
//   OAUTH_GITHUB_CLIENT_SECRET
import { randomBytes } from 'node:crypto';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID belum diset di Environment Variables Vercel.');
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;

  const state = randomBytes(12).toString('hex');

  const authorizeUrl =
    'https://github.com/login/oauth/authorize?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo,user',
      state,
    }).toString();

  // Simpan state di cookie untuk diverifikasi di callback (CSRF protection).
  res.setHeader('Set-Cookie', [
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);
  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
