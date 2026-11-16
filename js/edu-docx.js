
/* EDU-113 · DOCX independiente por módulo + estado de progreso incorporado */
(function(){
'use strict';
const enc=new TextEncoder(), dec=new TextDecoder();
const safe=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&apos;'}[c]));
const names=['Bienvenida','Comprender la comparación educativa','Delimitar tema y pregunta','Formular objetivos y criterios','Buscar, seleccionar y registrar fuentes','Describir cada caso','Construir la matriz comparativa','Interpretar, comparar y explicar','Redactar, revisar y presentar'];
let crcTable;
function crc32(b){if(!crcTable){crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0})}let c=0xffffffff;for(const x of b)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0}
function u16(n){return [n&255,n>>>8&255]}function u32(n){return [n&255,n>>>8&255,n>>>16&255,n>>>24&255]}
function zip(files){const local=[],central=[];let offset=0;for(const [name,content] of files){const nb=enc.encode(name),b=typeof content==='string'?enc.encode(content):content,crc=crc32(b);const header=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(b.length),...u32(b.length),...u16(nb.length),...u16(0),...nb]);local.push(header,b);const meta=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(b.length),...u32(b.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...nb]);central.push(meta);offset+=header.length+b.length}const centralSize=central.reduce((n,b)=>n+b.length,0),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralSize),...u32(offset),...u16(0)]);return new Blob([...local,...central,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}
function collect(stage){
const f=data.fields||{},x=(data.extra||{}).responses||{},extra=data.extra||{};const out=[];
const add=(label,text)=>{if(text&&String(text).trim())out.push(label+': '+String(text).trim())};
const at=(obj,k)=>obj&&typeof obj==='object'?obj[k]:'';
out.push('UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO');
out.push('CARRERA DE CIENCIAS DE LA EDUCACIÓN');
out.push('EDU-113 · EDUCACIÓN COMPARADA');
out.push('Recurso elaborado por Ivon Zapata Roca');
out.push('Módulo '+stage+': '+names[stage]);
out.push('Fecha de generación: '+new Date().toLocaleDateString('es-BO'));
out.push('Países de comparación: '+(f.countries||'Sin definir'));
if(stage===0){add('Autoevaluación inicial',x.likert);add('Dificultad prevista',x.difficulty)}
if(stage===1){add('Necesidad educativa observada',f.need);add('Definición propia',x.ownDefinition)}
if(stage===2){for(const [id,lab] of [['topic','Fenómeno'],['countries','Países'],['level','Nivel'],['period','Período'],['dims','Dimensiones'],['question','Pregunta comparativa']])add(lab,f[id])}
if(stage===3){for(const [id,lab] of [['question','Pregunta'],['general','Objetivo general'],['specific1','Objetivo específico 1'],['specific2','Objetivo específico 2'],['coherence','Justificación de coherencia']])add(lab,f[id]);add('Criterios',(extra.criteria||[]).join(', '));add('Justificación de criterios',x.criterionReason)}
if(stage===4){for(const [id,lab] of [['sourceTitle','Título de fuente'],['sourceUrl','Enlace'],['sourceLocator','Página o artículo'],['sourceIdea','Idea relevante'],['sourceNote','Comentario'],['preamble','Preámbulo'],['evidence','Evidencia'],['commentary','Comentario crítico']])add(lab,f[id]);(extra.sources||[]).forEach((s,i)=>{out.push('Fuente '+(i+1));for(const k of ['title','author','year','url','locator','idea','note'])add(k,s[k])})}
if(stage===5){for(const [country,text] of Object.entries(extra.descriptions||{}))add('Descripción de '+country,text)}
if(stage===6){for(const [criterion,row] of Object.entries(extra.matrix||{})){out.push('Criterio: '+criterion);for(const [country,val] of Object.entries(row||{}))add(country,val)}add('Semejanzas',x.similarities);add('Diferencias',x.differences)}
if(stage===7){add('Análisis',x.analysis);add('Limitaciones',x.limitations);add('Propuesta',x.proposal)}
if(stage===8){add('Pregunta original',f.question);add('Objetivo general',f.general);add('Conclusiones',x.conclusion);add('Presentación',x.presentation)}
out.push('Estado del módulo: '+(extra.moduleDone&&extra.moduleDone[stage]?'Completado según criterios de la guía':'En proceso'));
out.push('Nota: el registro de progreso no sustituye la valoración del docente.');
return out;
}
function docXML(lines){
const body=lines.map((line,i)=>'<w:p><w:pPr>'+(i<5?'<w:jc w:val="center"/>':'')+'</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="'+(i<5?'24':'22')+'"/>'+(i<5?'<w:b/>':'')+'</w:rPr><w:t xml:space="preserve">'+safe(line)+'</w:t></w:r></w:p>').join('');
return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>';
}
window.exportWord=function(stage){
if(!Number.isInteger(stage)||stage<0||stage>8)return;
const snapshot={schema:'edu113-stage-v1',stage,generated_at:new Date().toISOString(),data:{completed:data.completed,fields:data.fields,answers:data.answers,extra:data.extra}};
const files=[
['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="json" ContentType="application/json"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
['word/document.xml',docXML(collect(stage))],
['edu113/progress.json',JSON.stringify(snapshot)]
];
const blob=zip(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='EDU113_modulo_'+stage+'_'+new Date().toISOString().slice(0,10)+'.docx';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
};
function readDocx(ab){const view=new DataView(ab),b=new Uint8Array(ab);let pos=0;while(pos+30<b.length){if(view.getUint32(pos,true)!==0x04034b50)break;const method=view.getUint16(pos+8,true),comp=view.getUint32(pos+18,true),len=view.getUint16(pos+26,true),extra=view.getUint16(pos+28,true),name=dec.decode(b.slice(pos+30,pos+30+len)),start=pos+30+len+extra;if(name==='edu113/progress.json'){if(method!==0)throw Error('El documento fue recomprimido. Importa el original exportado por la guía.');return JSON.parse(dec.decode(b.slice(start,start+comp)))}pos=start+comp}throw Error('No se encontró el registro de progreso de EDU-113.')}
function validate(obj){if(!obj||typeof obj!=='object')throw Error('Archivo inválido');const d=obj.schema==='edu113-stage-v1'?obj.data:obj;if(!d||typeof d.fields!=='object'||!d.fields||typeof d.completed!=='number')throw Error('No se reconoce este respaldo');const ids=['need','topic','countries','level','period','dims','question','general','specific1','specific2','coherence','preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'];const fields={};for(const k of ids)fields[k]=typeof d.fields[k]==='string'?d.fields[k]:'';return {completed:Math.max(0,Math.min(8,Math.floor(d.completed))),fields,answers:d.answers||{},extra:d.extra&&typeof d.extra==='object'?d.extra:{}}}
window.importData=async function(input){const file=input.files&&input.files[0];if(!file)return;try{if(file.size>8*1024*1024)throw Error('El archivo supera el máximo de 8 MB.');const raw=file.name.toLowerCase().endsWith('.docx')?readDocx(await file.arrayBuffer()):JSON.parse(await file.text());const next=validate(raw);if(!confirm('¿Quieres importar el progreso de este archivo? Reemplazará las respuestas almacenadas en este navegador.'))return;localStorage.setItem('edu113-v0',JSON.stringify(next));location.reload()}catch(err){alert('No se pudo importar el archivo: '+err.message)}finally{input.value=''}};
const box=document.querySelector('#progress .card');if(box){const p=document.createElement('p');p.textContent='También puedes importar un documento Word (.docx) generado directamente por esta guía para recuperar tu avance en otro dispositivo. Utiliza el archivo original, sin volverlo a guardar desde Word.';const lab=document.createElement('label');lab.textContent='Importar progreso desde Word';lab.setAttribute('for','eduWordImport');const inp=document.createElement('input');inp.type='file';inp.id='eduWordImport';inp.accept='.docx';inp.onchange=()=>window.importData(inp);box.append(p,lab,inp)}
})();
