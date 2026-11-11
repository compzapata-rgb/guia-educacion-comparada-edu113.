
const titles=['Inicio y diagnóstico','Tema y delimitación','Objetivos y diseño','Fuentes, APA 7 e IA responsable','Descripción','Interpretación','Yuxtaposición','Comparación','Informe final','Revisión y autoevaluación'];const ids=['need','topic','countries','level','period','dims','question','general','specific1','specific2','coherence','preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'];const key='edu113-v0';let data={completed:0,fields:{},answers:{}};try{data=Object.assign(data,JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){};function save(){ids.forEach(id=>data.fields[id]=document.getElementById(id).value);try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}}function show(id){document.querySelectorAll('main section').forEach(s=>s.hidden=true);document.getElementById('home').hidden=id!=='home';if(id!=='home')document.getElementById(id).hidden=false;render();const mirror=document.getElementById('questionMirror');if(mirror)mirror.textContent=data.fields.question?.trim()||'Completa la pregunta en la estación 2 para verla aquí.';window.scrollTo(0,0)}function render(){const el=document.getElementById('modules');el.innerHTML=titles.map((t,i)=>'<article class="card"><span class="tag">'+(i<3?'Planifica':i<6?'Investiga':i<8?'Compara':'Presenta y mejora')+'</span><h3>'+(i+1)+'. '+t+'</h3><p>'+(i<data.completed?'Completada':i===data.completed&&i<3?'Disponible':'Próximamente / pendiente')+'</p><button '+(i>data.completed||i>2?'disabled':'')+' onclick="show(\'s'+(i+1)+'\')">Abrir</button></article>').join('');const pct=Math.round(data.completed/10*100);for(const id of ['bar','bar2'])document.getElementById(id).style.width=pct+'%';for(const id of ['summary','summary2'])document.getElementById(id).textContent=data.completed+' de 10 secciones · '+pct+'% del itinerario total';}function quiz(){const choices=['¿Cómo funciona la educación en general?','¿Qué semejanzas y diferencias existen en las estrategias de atención a dificultades de aprendizaje en primaria de Argentina, Bolivia y Perú?','¿Cuáles son todos los problemas educativos del mundo?'];document.getElementById('q1').innerHTML=choices.map((x,i)=>'<button class="answer" onclick="answer('+i+')">'+String.fromCharCode(65+i)+'. '+x+'</button>').join('');if(data.answers.q1!==undefined)answer(data.answers.q1)}function answer(i){data.answers.q1=i;save();const f=document.getElementById('f1');f.hidden=false;f.textContent=i===1?'Muy bien. Identificaste tres países, un fenómeno común, un nivel educativo y una pregunta comparativa. Aún conviene precisar período e indicadores.':'Buen intento. Busca una pregunta que identifique unidades de comparación, un fenómeno común y semejanzas y diferencias.'}function complete(n){save();if(n===1&&(!data.fields.need?.trim()||data.answers.q1===undefined)){alert('Responde la actividad y completa la reflexión.');return}if(n===2&&['topic','countries','level','period','dims','question'].some(k=>!data.fields[k]?.trim())){document.getElementById('f2').hidden=false;document.getElementById('f2').textContent='Completa todos los campos antes de continuar.';return}if(n===3&&['general','specific1','specific2','coherence'].some(k=>!data.fields[k]?.trim())){document.getElementById('f3').hidden=false;document.getElementById('f3').textContent='Completa tus objetivos y la reflexión de coherencia.';return}data.completed=Math.max(data.completed,n);save();show('map')}function exportData(){save();const blob=new Blob([JSON.stringify({version:'0.5',...data},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='avance_edu113.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}async function importData(input){const f=input.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(typeof obj.completed!=='number'||typeof obj.fields!=='object')throw Error('Formato inválido');data={completed:Math.min(3,Math.max(0,obj.completed)),fields:obj.fields,answers:obj.answers||{}};ids.forEach(id=>document.getElementById(id).value=data.fields[id]||'');save();quiz();show('progress')}catch(e){alert('No se pudo importar el respaldo.')}}ids.forEach(id=>document.getElementById(id).value=data.fields[id]||'');quiz();render();
function toggleRadial(force){const nav=document.getElementById('radialNav');const open=typeof force==='boolean'?force:!nav.classList.contains('open');nav.classList.toggle('open',open);const b=document.getElementById('radialToggle');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');b.textContent=open?'×':'☰'}function navRadial(id){toggleRadial(false);if(id==='s1'&&data.completed<0){show('map')}else show(id)}document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleRadial(false)});
/* Menú lateral adaptable: no modifica el almacenamiento del progreso */
function setSidebar(open){document.body.classList.toggle('sidebar-closed',!open);const b=document.getElementById('sidebarToggle');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Ocultar menú lateral':'Mostrar menú lateral')}
function toggleSidebar(){setSidebar(document.body.classList.contains('sidebar-closed'))}
function sidebarGo(id){if(/^s[1-3]$/.test(id)&&Number(id.slice(1))>data.completed+1){show('map')}else{show(id)}if(matchMedia('(max-width:850px)').matches)setSidebar(false)}
const originalShow=show;show=function(id){originalShow(id);document.querySelectorAll('.sidebar [data-page]').forEach(b=>{const active=b.dataset.page===id;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})};
if(matchMedia('(max-width:850px)').matches)setSidebar(false);else setSidebar(true);
show('home');

/* Actividades de consulta contextual: no sustituyen evaluación docente */
const bookPages=[
{title:'1. Plantea una pregunta comparable',text:'Selecciona un fenómeno y unidades de comparación. Ejemplo: ¿qué estrategias de atención a dificultades de aprendizaje en primaria se documentan en Argentina, Bolivia y Perú durante un período definido?'},
{title:'2. Reúne fuentes equivalentes',text:'Consulta fuentes académicas y documentos oficiales de los tres países. Registra año, nivel educativo, organismo emisor y alcance de cada documento.'},
{title:'3. Organiza una matriz común',text:'Usa las mismas dimensiones para cada país: marco normativo, dificultades documentadas y estrategias de atención. No compares categorías que no son equivalentes.'},
{title:'4. Interpreta con prudencia',text:'Distingue los hallazgos documentados de las hipótesis explicativas. Examina contexto histórico, social y normativo, y reconoce límites de las fuentes.'}
];let bookIndex=0;function bookRender(){const p=bookPages[bookIndex],e=document.getElementById('bookPage');if(!e)return;e.innerHTML='<h3>'+p.title+'</h3><p>'+p.text+'</p>';document.getElementById('bookCount').textContent=(bookIndex+1)+' de '+bookPages.length;document.getElementById('bookPrev').disabled=bookIndex===0;document.getElementById('bookNext').disabled=bookIndex===bookPages.length-1}function bookMove(n){bookIndex=Math.max(0,Math.min(bookPages.length-1,bookIndex+n));bookRender()}
const branches={
start:{question:'Quieres comparar la atención a dificultades de aprendizaje en primaria de Argentina, Bolivia y Perú. ¿Cuál es tu primer paso?',choices:[['Describir cada país sin criterios comunes','describe'],['Definir dimensiones y buscar documentos comparables','criteria']]},
describe:{result:'Describir es necesario, pero no basta. Sin dimensiones comunes, la comparación puede quedar reducida a tres descripciones independientes.',next:'start'},
criteria:{result:'Buena decisión. Definir criterios comunes permite construir una matriz y localizar evidencias pertinentes para los tres sistemas.',next:'sources'},
sources:{question:'Encuentras un documento oficial reciente de un país y una noticia antigua del otro. ¿Qué haces?',choices:[['Los comparo como si fueran equivalentes','unequal'],['Busco fuentes oficiales equivalentes y registro sus fechas','equivalent']]},
unequal:{result:'Las fuentes tienen naturaleza y fechas diferentes. Podrías producir una comparación engañosa; revisa su comparabilidad.',next:'sources'},
equivalent:{result:'Correcto: documentar la procedencia y las limitaciones fortalece la interpretación. Ya puedes iniciar una matriz comparativa.',next:'start'}
};function branchShow(key){const node=branches[key],e=document.getElementById('branchContent');if(!e)return;e.replaceChildren();if(node.question){const p=document.createElement('p');p.textContent=node.question;e.append(p);node.choices.forEach(([label,target])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>branchShow(target);e.append(b)})}else{const p=document.createElement('p');p.className='branch-result';p.textContent=node.result;e.append(p);const b=document.createElement('button');b.textContent=node.next==='start'?'Volver a empezar':'Continuar';b.onclick=()=>branchShow(node.next);e.append(b)}}
bookRender();branchShow('start');

/* Ruta visual: usa el mismo avance persistido de las actividades existentes. */
const routeDescriptions=['Comprende qué es comparar sistemas educativos','Define fenómeno, países, nivel y período','Redacta pregunta y objetivos coherentes','Selecciona fuentes y registra referencias','Describe cada sistema con los mismos criterios','Interpreta factores contextuales y evidencias','Organiza los hallazgos en una matriz','Identifica semejanzas y diferencias','Redacta resultados y conclusiones','Revisa coherencia, fuentes y limitaciones'];
const routeIcons=['⌕','◎','✎','▤','▥','◈','▦','⇄','≡','✓'];
function renderJourney(){
 const root=document.getElementById('journeyStops');if(!root)return;
 const current=Math.min(9,Math.max(0,data.completed));
 const originalAvatar=document.querySelector('#home .guide-character svg');
 root.replaceChildren();
 titles.forEach((title,i)=>{
 const state=i<data.completed?'done':i===current?'current':'future';
 const item=document.createElement('div');item.className='journey-stop '+state;
 const btn=document.createElement('button');btn.className='stop-btn';btn.type='button';
 const accessible=i<3&&i<=data.completed;btn.disabled=!accessible;
 btn.setAttribute('aria-label','Paso '+(i+1)+': '+title+'. '+(state==='done'?'Completado':state==='current'?'Paso actual':'Próximamente'));
 if(state==='current')btn.setAttribute('aria-current','step');
 if(accessible)btn.onclick=()=>show('s'+(i+1));
 const circle=document.createElement('span');circle.className='stop-circle';circle.textContent=state==='done'?'✓':routeIcons[i];
 const copy=document.createElement('span');copy.className='stop-copy';
 const heading=document.createElement('strong');heading.textContent=(i+1)+'. '+title;
 const desc=document.createElement('small');desc.textContent=routeDescriptions[i];
 const status=document.createElement('em');status.textContent=state==='done'?'COMPLETADO':state==='current'?(i<3?'CONTINÚA AQUÍ':'EN PREPARACIÓN'):'PRÓXIMAMENTE';
 copy.append(heading,desc,status);btn.append(circle,copy);item.append(btn);
 if(state==='current'&&originalAvatar){
 const avatar=document.createElement('span');avatar.className='route-avatar';avatar.setAttribute('aria-hidden','true');
 const art=originalAvatar.cloneNode(true);avatar.append(art);
 const bubble=document.createElement('span');bubble.className='route-avatar-label';bubble.textContent=i<3?'¡Vamos por este paso!':'Próxima etapa';avatar.append(bubble);btn.append(avatar);
 }
 root.append(item);
 });
 const pct=Math.round(data.completed/10*100);
 document.getElementById('routePercent').textContent=pct+'%';
 document.getElementById('routeProgress').setAttribute('aria-valuenow',String(pct));
 const next=document.getElementById('routeNext');next.replaceChildren();
 const title=document.createElement('strong');title.textContent=current<3?'Tu siguiente paso: '+(current+1)+'. '+titles[current]:'Has completado las secciones disponibles';
 const info=document.createElement('p');info.textContent=current<3?'Tu avatar marca dónde continuar. Al finalizar la actividad, el avance se guarda en este navegador.':'Las siguientes secciones todavía están en preparación. Puedes revisar tus respuestas o descargar tu respaldo.';
 const action=document.createElement('button');action.textContent=current<3?'Continuar mi investigación':'Ver mi progreso';action.onclick=()=>show(current<3?'s'+(current+1):'progress');
 next.append(title,info,action);
}
const baseRender=render;render=function(){baseRender();renderJourney()};
renderJourney();

/* v0.7.1 · Explorador de países; los textos son orientaciones de búsqueda, no datos estadísticos. */
const countryGuide={
 argentina:{name:'Argentina',summary:'Caso modelo: dificultades de aprendizaje en educación primaria.',items:['Localiza la Ley 27.306 y comprueba su alcance en la fuente oficial.','Identifica medidas de atención y adaptaciones educativas documentadas.','Registra año, organismo emisor y artículo o apartado utilizado.']},
 bolivia:{name:'Bolivia',summary:'Caso modelo: dificultades de aprendizaje en educación primaria.',items:['Localiza la Ley 070 y otras disposiciones pertinentes en fuentes oficiales.','Busca documentos sobre estrategias de atención y apoyo educativo.','Distingue entre disposiciones normativas y evidencias de implementación.']},
 peru:{name:'Perú',summary:'Caso modelo: dificultades de aprendizaje en educación primaria.',items:['Consulta la Ley General de Educación 28044 y verifica su pertinencia.','Identifica orientaciones oficiales y estudios sobre apoyo educativo.','Registra qué información es comparable con Argentina y Bolivia.']}
};
let selectedCountry='argentina';
function selectCountry(code){if(!countryGuide[code])return;selectedCountry=code;const item=countryGuide[code];document.querySelectorAll('.country-choice').forEach(b=>{const active=b.dataset.country===code;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});document.getElementById('countryTitle').textContent=item.name;document.getElementById('countryTag').textContent='Explorando '+item.name;document.getElementById('countrySummary').textContent=item.summary;const list=document.createElement('ul');item.items.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li)});document.getElementById('countryDetails').replaceChildren(list)}
function addCountryToSelection(){const field=document.getElementById('countries');if(!field)return;const name=countryGuide[selectedCountry].name;const existing=field.value.split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean);if(!existing.some(x=>x.toLocaleLowerCase('es')===name.toLocaleLowerCase('es')))existing.push(name);field.value=existing.join(', ');save();field.focus()}
selectCountry('argentina');
