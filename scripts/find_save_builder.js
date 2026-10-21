import fs from 'fs';

const html = fs.readFileSync('elementor_editor_frame.html', 'utf8');

const saveMatches = [...html.matchAll(/save_builder[^"'\s,]*/g)].map(m => m[0]);
console.log('save_builder matches:', saveMatches);

const ajaxMatches = [...html.matchAll(/admin-ajax\.php[^\s"']*/g)].map(m => m[0]);
console.log('admin-ajax matches:', ajaxMatches);

// Find where "actions" or "editor_post_id" is used
const editorPostMatches = [...html.matchAll(/editor_post_id[^,;\}]*/g)].map(m => m[0]);
console.log('editor_post_id matches:', editorPostMatches);
