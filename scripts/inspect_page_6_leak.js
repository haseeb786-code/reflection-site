async function main() {
  const res = await fetch('https://reflectionelite.com/shop/?v=' + Date.now());
  const html = await res.text();
  const footerIdx = html.indexOf('<footer');
  const junkIdx = html.indexOf('High Strength Metal Materials');
  console.log('footerIdx:', footerIdx);
  console.log('junkIdx:', junkIdx);
  console.log('Junk is before or after footer:', junkIdx > footerIdx ? 'AFTER FOOTER' : 'BEFORE FOOTER');
}

main().catch(console.error);
