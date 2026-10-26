import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sharedDayFromSearch,canonicalShareLink,dayShareLink,cleanDayParameter,PUBLIC_SITE} from '../src/shareLinks.js';
test('deep-link parser accepts one exact Day 1-30, rejects malformed or ambiguous values',()=>{
 for(const n of [1,2,9,10,17,29,30])assert.equal(sharedDayFromSearch('?day='+n),n);
 for(const q of ['', '?day=0','?day=31','?day=-1','?day=01','?day=1.0',
  '?day=hello','?day=2&day=4','?day=2%20','?DAY=4','?day=1e1'])
   assert.equal(sharedDayFromSearch(q),null,q);
 assert.equal(sharedDayFromSearch('?utm_source=news&day=22'),22);
});
test('share URL carries only a public day and works on the real GitHub Pages base',()=>{
 assert.equal(canonicalShareLink('https://michaelwave369.github.io','/SovereignBodyMethod/'),PUBLIC_SITE);
 const link=dayShareLink('https://michaelwave369.github.io','/SovereignBodyMethod/',28);
 assert.equal(link,'https://michaelwave369.github.io/SovereignBodyMethod/?day=28#daily');
 for(const n of [-1,0,31,0.3,'12'])assert.throws(()=>dayShareLink('https://example.org','/SovereignBodyMethod/',n));
 assert.ok(!link.includes('favorites')&&!link.includes('prices'));
});
test('after user changes a linked day, clear stale deep-link while preserving section',()=>{
 assert.equal(cleanDayParameter('https://example.org/SovereignBodyMethod/?day=11#movement',12),'/SovereignBodyMethod/#movement');
 assert.equal(cleanDayParameter('https://example.org/SovereignBodyMethod/?day=11#daily',11),null);
 assert.equal(cleanDayParameter('https://example.org/SovereignBodyMethod/#daily',30),null);
});
test('published site metadata references only real public canonical and discovery assets',async()=>{
 const [html,robots,sitemap]=await Promise.all([
  readFile('index.html','utf8'),readFile('public/robots.txt','utf8'),readFile('public/sitemap.xml','utf8')]);
 for(const marker of ['rel="canonical"','property="og:title"','property="og:url"','name="twitter:card"','application/ld+json'])
  assert.ok(html.includes(marker),marker);
 assert.ok(html.includes(PUBLIC_SITE));
 assert.ok(sitemap.includes('<loc>'+PUBLIC_SITE+'</loc>'));
 assert.ok(robots.includes('Sitemap: '+PUBLIC_SITE+'sitemap.xml'));
 assert.ok(!html.includes('ratingValue'));
});
