import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import {readableLines,extractCrystalMentions,extractFrequencyMentions,playableFrequency,clampTone} from '../src/soundSources.js';

test('frequency index extracts only literal Hz references and preserves author text',()=>{
  const html='<p>Solfeggio frequencies: 396 Hz reflection, 528 Hz tradition.</p><p>no number here</p><p>528Hz again</p><p>18 Hz below limit.</p>';
  const found=extractFrequencyMentions(html);
  assert.deepEqual(found.map(x=>x.hz),[396,528]);
  assert.ok(found[0].sourceExcerpt.includes('396 Hz'));
  assert.equal(found[0].sourceFile,'Reference_Appendices.docx');
});
test('crystal lookup only includes entries with a source mention',()=>{
  const found=extractCrystalMentions('<p>Amethyst and Rose Quartz are named here.</p><p>Unrelated heading</p>');
  assert.deepEqual(found.map(x=>x.name),['Amethyst','Rose Quartz']);
  assert.ok(!found.some(x=>x.name==='Citrine'));
});
test('tone limiter prevents extreme or non-audible demonstration frequencies',()=>{
  assert.equal(playableFrequency(432),true);
  assert.equal(playableFrequency(45),false);
  assert.equal(playableFrequency(2000),false);
  assert.equal(clampTone(10),80);
  assert.equal(clampTone(10000),1000);
  assert.equal(clampTone('bad'),440);
  assert.equal(readableLines('<p>A &amp; B</p><p>C</p>')[0],'A & B');
});
test('original archive is source of frequency and crystal mentions (no fabricated six rituals)',async t=>{
  const path='content/source/SovereignBodyMethod.zip';
  if(!existsSync(path)){t.skip('Approved archive is absent');return}
  const zip=await JSZip.loadAsync(await readFile(path));
  const reference=zip.file('Reference_Appendices.docx');
  const crystal=zip.file('Crystal_Energy_Work_Complete_Guide.docx');
  assert.ok(reference);assert.ok(crystal);
  const a=await mammoth.convertToHtml({buffer:await reference.async('nodebuffer')});
  const b=await mammoth.convertToHtml({buffer:await crystal.async('nodebuffer')});
  const tones=extractFrequencyMentions(a.value),minerals=extractCrystalMentions(b.value);
  assert.ok(tones.length>0,'Expected original frequency references with Hz units');
  assert.ok(minerals.length>0,'Expected actual crystal terms in manuscript');
  assert.ok(tones.every(x=>x.sourceExcerpt.length<=201));
  assert.ok(minerals.every(x=>x.sourceExcerpt.length<=201));
});
