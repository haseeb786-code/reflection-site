import fs from 'fs';

const page = JSON.parse(fs.readFileSync('page_52_edit.json', 'utf8'));
const data = JSON.parse(page.meta._elementor_data);

function getSummary(node) {
  let widgets = [];
  if (node.widgetType) {
    let title = node.settings?.title || node.settings?.heading_title || node.settings?.editor || '';
    if (typeof title === 'string') title = title.replace(/<[^>]+>/g, '').slice(0, 30);
    widgets.push(`${node.widgetType}("${title}")`);
  }
  if (node.elements) {
    node.elements.forEach(c => {
      widgets = widgets.concat(getSummary(c));
    });
  }
  return widgets;
}

data.forEach((el, idx) => {
  const w = getSummary(el);
  console.log(`Section #${idx + 1} [ID: ${el.id}] - ${w.join(', ')}`);
});
