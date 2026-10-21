import fs from 'fs';

async function check() {
  const WP_URL = "https://reflectionelite.com";
  const res1 = await fetch(`${WP_URL}/wp-login.php`);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(";")[0]).join("; ");

  const params = new URLSearchParams();
  params.append("log", "admin");
  params.append("pwd", "process.env.PROD_WP_PASS || "[REDACTED]"");
  params.append("wp-submit", "Log In");
  params.append("redirect_to", `${WP_URL}/wp-admin/plugins.php`);
  params.append("testcookie", "1");

  const res2 = await fetch(`${WP_URL}/wp-login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": cookieHeader },
    body: params.toString(),
    redirect: "manual"
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(";")[0]).join("; ");

  const pRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, {
    headers: { "Cookie": allCookies }
  });
  const html = await pRes.text();
  fs.writeFileSync('plugins_page.html', html, 'utf8');

  const matches = [...html.matchAll(/data-slug="([^"]+)"|data-plugin="([^"]+)"/g)];
  console.log("Plugins found:", [...new Set(matches.map(m => m[1] || m[2]))]);

  const actLinks = [...html.matchAll(/href="([^"]*plugins\.php\?action=activate[^"]*)"/g)].map(m => m[1]);
  console.log("Activation links available:", actLinks);

  const deactLinks = [...html.matchAll(/href="([^"]*plugins\.php\?action=deactivate[^"]*)"/g)].map(m => m[1]);
  console.log("Deactivation links available:", deactLinks);
}
check().catch(console.error);
