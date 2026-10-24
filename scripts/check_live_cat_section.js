import dns from 'dns';
try { dns.setDefaultResultOrder('ipv4first'); } catch(e){}

async function testLive() {
  const res = await fetch('https://reflectionelite.com/?nocache=' + Date.now());
  console.log('Homepage status:', res.status);
  const text = await res.text();
  const m = text.match(/<section[^>]*class="[^"]*te-cat-showcase-section[^"]*"[\s\S]*?<\/section>/i);
  if (m) {
    console.log('Found category showcase section on live homepage:');
    console.log(m[0]);
  } else {
    console.log('Not found');
  }
}

testLive().catch(console.error);
