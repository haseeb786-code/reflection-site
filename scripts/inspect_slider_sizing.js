import fs from 'fs';

const html = fs.readFileSync('section_10_features.html', 'utf8');

// Search for any data attributes or settings
const matches = html.match(/data-[a-z\-]+="[^"]*"/gi);
console.log('Data attributes:', matches);

// Check slide flex
const flexMatches = html.match(/flex:[^;]+;/gi);
console.log('Flex rules:', flexMatches);

// Check max-width and container
const containerMatches = html.match(/max-width:[^;]+;/gi);
console.log('Max width rules:', containerMatches);
