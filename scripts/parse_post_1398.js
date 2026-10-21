import fs from 'fs';

const html = fs.readFileSync('post_1398_edit.html', 'utf8');
const pt = html.match(/name="post_type"\s+value="([^"]+)"/i);
console.log('Post type from post_1398_edit.html:', pt ? pt[1] : 'not found');

const title = html.match(/name="post_title"\s+value="([^"]+)"/i);
console.log('Post title:', title ? title[1] : 'not found');

const forms = [...html.matchAll(/<form[^>]*action="([^"]*)"[^>]*>/gi)].map(m => m[1]);
console.log('Form actions:', forms);
