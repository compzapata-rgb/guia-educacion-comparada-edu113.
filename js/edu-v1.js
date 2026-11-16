
/* EDU-113 v1.0 · Ampliación modular conservando data, ids y clave localStorage */
(function(){
'use strict';
const labels=['Bienvenida','Comprender la comparación','Delimitar tema y pregunta','Objetivos y criterios','Fuentes e IA responsable','Describir cada caso','Matriz comparativa','Interpretar y explicar','Redactar y revisar'];
const descriptions=['Conoce la guía y registra tu punto de partida','Distingue describir, investigar y comparar','Define fenómeno, países, nivel, periodo y pregunta','Formula objetivos y elige criterios pertinentes','Localiza, verifica y registra fuentes','Redacta descripciones con evidencias por país','Organiza hallazgos con criterios comunes','Analiza semejanzas, diferencias y contexto','Revisa conclusiones y prepara tu informe'];
const required={
1:['need'],2:['topic','countries','level','period','dims','question'],
3:['general','specific1','specific2','coherence'],
4:['sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'],
5:[],6:[],7:[],8:[]
};
const defaults=['Argentina','Bolivia','Perú'];
data.extra=data.extra&&typeof data.extra==='object'?data.extra:{};
data.extra.responses=data.extra.responses||{};
data.extra.criteria=Array.isArray(data.extra.criteria)?data.extra.criteria:[];
data.extra.descriptions=data.extra.descriptions||{};
data.extra.matrix=data.extra.matrix||{};
data.extra.checks=data.extra.checks||{};
data.extra.moduleDone=data.extra.moduleDone||{};
if(Number(data.completed)>0)data.extra.moduleDone[0]=true;for(let i=1;i<=Math.min(3,Number(data.completed)||0);i++)data.extra.moduleDone[i]=true;
let active=0;
let noticeTimer;
const E=(id)=>document.getElementById(id);
const escapeHTML=(v)=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(key)=>data.extra.responses[key]||'';
function persist(){try{localStorage.setItem('edu113-v0',JSON.stringify(data));const n=E('eduSaveNotice');if(n){n.textContent='Progreso guardado en este navegador';n.dataset.status='saved'}}catch(err){const n=E('eduSaveNotice');if(n){n.textContent='El navegador no permite guardar. Exporta un respaldo.';n.dataset.status='error'}}}
function put(k,v){data.extra.responses[k]=v;persist();}
function countries(){const list=(data.fields.countries||'').split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean);return [...new Set(list.length?list:defaults)].slice(0,8)}
function criteria(){return data.extra.criteria.length?data.extra.criteria:['Normativa','Programas','Recursos']}
const opts=(list,selected)=>list.map(x=>'<option value="'+escapeHTML(x)+'"'+(x===selected?' selected':'')+'>'+escapeHTML(x)+'</option>').join('');
const input=(key,label,placeholder,multi=true)=>'<label for="edu_'+key+'">'+label+'</label>'+(multi?'<textarea':'<input type="text"')+' class="edu-input" id="edu_'+key+'" data-save="'+key+'" placeholder="'+escapeHTML(placeholder||'')+'"'+(multi?' rows="4"></textarea>':'>');
function card(title,body,extra=''){return '<article class="edu-panel '+extra+'"><h3>'+title+'</h3>'+body+'</article>'}
function fold(title,text){return '<details class="learning-fold edu-accordion"><summary>'+title+'</summary><div class="edu-fold-body">'+text+'</div></details>'}
function quiz(id,question,options,answer,hint){
const value=get('quiz_'+id);
return '<div class="edu-quiz" data-quiz="'+id+'" data-correct="'+answer+'"><p class="edu-question">'+question+'</p>'+options.map((o,i)=>'<button type="button" class="edu-answer '+(String(i)===value?'chosen':'')+'" data-answer="'+i+'" aria-pressed="'+(String(i)===value)+'">'+escapeHTML(o)+'</button>').join('')+'<p class="edu-feedback" aria-live="polite" data-feedback="'+id+'">'+(value===''?'Selecciona una respuesta para recibir orientación.':Number(value)===answer?'Correcto. '+hint:'Revisa la explicación y vuelve a intentarlo. '+hint)+'</p></div>'
}
function checkModule(n,items){
const done=data.extra.checks[n]||{};
return '<div class="edu-check-panel"><h3>Revisa tu producto antes de continuar</h3>'+items.map((text,i)=>'<label class="edu-check"><input type="checkbox" data-check-module="'+n+'" data-check-index="'+i+'" '+(done[i]?'checked':'')+'><span>'+text+'</span></label>').join('')+'<p class="field-tip">Esta lista sirve para autoevaluarte; no certifica la calidad metodológica de tus respuestas.</p></div>';
}
function action(n){return '<div class="edu-module-actions"><button type="button" class="edu-ghost" data-export="'+n+'">Exportar este módulo a Word (.docx)</button><button type="button" class="edu-primary" data-complete="'+n+'">Guardar producto y continuar</button><p class="edu-action-feedback" data-module-feedback="'+n+'" role="status" aria-live="polite"></p></div>'}
function welcome(){
return '<div class="edu-stage-header"><span class="tag">Módulo 0 · Bienvenida</span><h2>Tu primera investigación comparativa, paso a paso</h2><p>Investigar es buscar evidencias, organizarlas y explicar lo que significan. Aquí aprenderás haciendo, sin necesidad de dominar la investigación desde el inicio.</p></div>'+
card('¿Qué vas a construir?','<p>Un tema delimitado, una pregunta, objetivos, criterios, fichas de fuentes, descripciones, una matriz y conclusiones. Tú decidirás cómo integrar estos productos en tu trabajo de asignatura.</p><div class="edu-pill-flow"><span>Entender</span><span>Elegir</span><span>Buscar</span><span>Comparar</span><span>Comunicar</span></div>')+
card('Tu punto de partida','<label for="edu_likert">¿Qué tanto sabes sobre comparar sistemas educativos?</label><select id="edu_likert" data-save="likert">'+opts(['','Nada','Poco','Algo','Bastante','Mucho'],get('likert'))+'</select>'+input('difficulty','¿Qué dificultad crees que tendrás al investigar?','Por ejemplo, encontrar fuentes confiables')+'<p class="field-tip">No hay respuestas correctas o incorrectas. Esta información es solo para tu reflexión.</p>')+
card('Cómo se utiliza la guía','<p>En cada módulo encontrarás una práctica breve, un ejemplo y campos para crear tu propio producto. El progreso se guarda en este navegador. Para trabajar en otro dispositivo, conserva un respaldo.</p>'+fold('Uso responsable de IA','La IA puede ayudarte a explorar y organizar ideas, pero no reemplaza la lectura, la verificación de fuentes ni tu análisis personal. Nunca cites una fuente sin abrirla y comprobarla.'))+
action(0);
}
function moduleOneExtras(){
return card('Práctica de clasificación',quiz('comparar','¿Cuál enunciado ya propone una comparación educativa?',['¿Qué es la dislexia?','¿Qué estrategias de apoyo a la lectura se aplican en Bolivia y Perú?','¿Por qué existen problemas educativos?'],1,'La segunda pregunta nombra un fenómeno y dos unidades comparables.'))+
card('Relaciona conceptos',match('concepts',[['Fenómeno educativo','Dificultades de lectura'],['Unidad de comparación','Argentina, Bolivia y Perú'],['Criterio','Normativa de apoyo']]))+
card('Mi primera idea',input('ownDefinition','Explica con tus palabras qué significa comparar en educación','Comparar en educación significa...')+fold('Ejemplo breve','No basta con describir un programa en cada país: primero se establecen criterios comunes para identificar semejanzas y diferencias.'))+
checkModule(1,['Puedo distinguir una pregunta descriptiva de una comparativa.','Mi idea de tema es pertinente para educación.'])+action(1)
}
function moduleTwoExtras(){
const phenomena=['Dificultades de aprendizaje','Deserción escolar','Inclusión educativa','Formación docente','Brecha digital','Educación intercultural','Violencia escolar','Alfabetización','Rendimiento académico'];
return card('Elige un fenómeno educativo','<p class="field-tip">Selecciona un ejemplo o escribe uno diferente en el formulario de delimitación.</p><div class="edu-chips">'+phenomena.map(x=>'<button type="button" data-topic="'+escapeHTML(x)+'">'+escapeHTML(x)+'</button>').join('')+'</div>')+
card('Una pregunta que se puede investigar','<p>Modelo: ¿Qué estrategias sobre <strong>[fenómeno]</strong> se documentan en <strong>[países]</strong> durante <strong>[periodo]</strong> y qué diferencias presentan?</p><button type="button" class="edu-ghost" id="eduQuestionDraft">Generar borrador con mis campos</button><p class="field-tip">La plantilla es orientativa. Revisa su precisión y pertinencia.</p>')+
card('Reconoce un error de delimitación',quiz('delimit','¿Cuál es una delimitación más viable?',['Comparar toda la educación mundial','Comparar políticas de inclusión en primaria de tres países durante un período definido','Estudiar problemas sin identificar fuentes'],1,'El fenómeno, el nivel y las unidades de comparación deben ser claros.'))+
checkModule(2,['Definí un fenómeno educativo concreto.','Mi pregunta contiene unidades, nivel y período.','Identifiqué dimensiones comparables.'])+action(2);
}
const criterionOptions=['Normativa','Programas','Formación docente','Recursos','Evaluación','Acceso y equidad','Currículo','Contexto'];
function moduleThreeExtras(){
return card('Parte B · Criterios de comparación','<p>Un criterio es el aspecto que observarás en todas las unidades. Selecciona entre dos y cuatro criterios relevantes para tu pregunta.</p><div class="edu-criteria">'+criterionOptions.map(x=>'<label class="edu-check"><input type="checkbox" data-criterion="'+x+'" '+(data.extra.criteria.includes(x)?'checked':'')+'><span>'+x+'</span></label>').join('')+'</div>'+input('criterionReason','¿Por qué seleccionaste estos criterios?','Los criterios elegidos permitirán...')+fold('Preguntas guía','Normativa: ¿qué leyes existen? Programas: ¿qué acciones se aplican? Recursos: ¿qué apoyos se ofrecen? Contexto: ¿qué factores influyen?'))+
card('Práctica con objetivos',quiz('objectives','¿Qué objetivo se relaciona mejor con una pregunta comparativa sobre apoyo a la lectura?',['Conocer la educación en general','Comparar las estrategias de apoyo a la lectura documentadas en los países seleccionados','Decidir qué país es el mejor'],1,'El objetivo debe responder a la pregunta y conservar su objeto de estudio.'))+
checkModule(3,['Mi objetivo general responde a mi pregunta.','Los objetivos específicos contribuyen al general.','Elegí criterios pertinentes y explico por qué.'])+action(3);
}
function match(id,pairs){
const saved=data.extra.responses['match_'+id]||{};
return '<div class="edu-match" data-match="'+id+'">'+pairs.map((p,i)=>'<label>'+p[0]+'<select data-match-item="'+i+'"><option value="">Selecciona un ejemplo</option>'+opts(pairs.map(x=>x[1]),saved[i]||'')+'</select></label>').join('')+'<button type="button" data-match-check="'+id+'" class="edu-ghost">Comprobar relaciones</button><p class="edu-feedback" data-match-feedback="'+id+'" role="status"></p></div>'
}
function order(id,steps){
const arr=data.extra.responses['order_'+id]||steps.map((_,i)=>i);
return '<div class="edu-order" data-order="'+id+'" data-expected="'+steps.length+'"><p class="field-tip">Ordena los pasos. Puedes arrastrar tarjetas o utilizar las flechas.</p><ol>'+arr.map(idx=>'<li draggable="true" data-order-id="'+idx+'"><span>'+steps[idx]+'</span><div><button type="button" data-move="-1" aria-label="Subir paso">↑</button><button type="button" data-move="1" aria-label="Bajar paso">↓</button></div></li>').join('')+'</ol><button type="button" data-order-check="'+id+'" class="edu-ghost">Comprobar secuencia</button><p class="edu-feedback" data-order-feedback="'+id+'" role="status"></p></div>'
}
const searchSteps=['Identificar palabras clave','Localizar fuentes académicas y oficiales','Revisar autoría, fecha y contenido','Verificar el enlace y la evidencia','Registrar la referencia y la idea útil'];
function moduleFour(){
return '<div class="edu-stage-header"><span class="tag">Módulo 4 · Investiga</span><h2>Busca y registra fuentes que respondan a tu pregunta</h2><p>Empieza por tus objetivos y criterios. Una fuente será útil si aporta evidencia verificable sobre lo que deseas comparar.</p></div>'+
card('Antes de buscar',quiz('sources','¿Qué fuente ofrece una mejor base para conocer una ley educativa?',['Una publicación anónima de una red social','El texto de la ley en un portal oficial','Una respuesta de IA sin referencias'],1,'Comprueba siempre el documento original y su fecha.'))+
card('Ordena el procedimiento',order('search',searchSteps))+
card('Explora distintas fuentes','<div class="edu-resource-grid">'+[
['Google Académico','https://scholar.google.com/','scholar.google.com'],
['SciELO','https://scielo.org/','scielo.org'],
['Redalyc','https://www.redalyc.org/','redalyc.org'],
['Dialnet','https://dialnet.unirioja.es/','dialnet.unirioja.es'],
['ERIC','https://eric.ed.gov/','eric.ed.gov'],
['Elicit','https://elicit.com/','elicit.com'],
['ResearchRabbit','https://www.researchrabbit.ai/','researchrabbit.ai'],
['Perplexity','https://www.perplexity.ai/','perplexity.ai'],
['NotebookLM','https://notebooklm.google.com/','notebooklm.google.com'],
['UNESCO','https://www.unesco.org/','unesco.org']
].map(r=>'<a href="'+r[1]+'" target="_blank" rel="noopener noreferrer"><img src="https://www.google.com/s2/favicons?domain='+r[2]+'&sz=128" width="34" height="34" alt="" loading="lazy" onerror="this.hidden=true"><span>'+r[0]+'</span></a>').join('')+'</div><p class="field-tip">Los buscadores requieren conexión. Los resultados deben comprobarse en las fuentes originales.</p>')+
card('La IA puede ayudarte, pero no investiga por ti','<p><strong>Pregunta demasiado general:</strong> «Dame fuentes sobre dificultades de aprendizaje».</p><p><strong>Mejor instrucción:</strong> «Encuentra fuentes oficiales y académicas sobre dificultades de aprendizaje en educación primaria, indicando autor, año, enlace verificable y limitaciones. No inventes referencias».</p>'+fold('Para utilizar NotebookLM de forma crítica','Pide que localice pasajes de los documentos cargados con sus secciones y luego vuelve al texto original para confirmar las afirmaciones.')+
quiz('ai','¿Qué haces si una IA ofrece un DOI que no puedes localizar?',['Lo citas porque parece académico','Lo verificas en el sitio editorial y no lo utilizas si no existe','Lo sustituyes por otro inventado'],1,'La cita solo es válida si la fuente existe y respalda realmente la afirmación.'))+
card('Mi primera ficha de fuente','<p class="field-tip">Conservamos los datos introducidos en la versión anterior. Puedes registrar nuevas fuentes de forma sucesiva.</p><div id="eduSourceMove"></div>'+input('sourceAuthor','Autoría o institución','Ministerio, universidad, investigadores',false)+input('sourceYear','Año de publicación','Ej. 2023',false)+'<button type="button" data-add-source class="edu-ghost">Guardar ficha en mi banco</button><div id="eduSourceBank"></div>')+
card('Citas y escritura académica','<p><a href="https://leo.uniandes.edu.co/uso-de-citas-en-la-escritura-academica/" target="_blank" rel="noopener noreferrer">Guía LEO de la Universidad de los Andes: uso de citas</a></p><p>Introduce la evidencia, incorpora una cita o paráfrasis verificable y explica qué aporta a tu comparación.</p>')+
checkModule(4,['La fuente tiene autoría y fecha identificables.','Abrí la fuente y comprobé su contenido.','Registré su relación con al menos un criterio.'])+action(4);
}
function moduleFive(){
return '<div class="edu-stage-header"><span class="tag">Módulo 5 · Describe</span><h2>Describe cada caso con evidencia</h2><p>Primero organiza lo que sabes de cada país. Todavía no determines cuál es mejor: documenta hechos comparables.</p></div>'+
card('Aprende a redactar','<div class="model-example"><strong>Esquema de un párrafo (no es una afirmación verificada)</strong><p>Idea principal → dato documentado y su fuente → explicación → relación con la pregunta.</p></div>'+order('paragraph',['Idea principal','Evidencia y referencia','Explicación del dato','Conexión con la pregunta']))+
card('Distingue evidencia y opinión',quiz('paraphrase','¿Cuál opción evita atribuir datos no comprobados?',['Todas las escuelas de un país son mejores','Según el documento consultado, la medida indicada en su artículo específico es...','La IA dijo que es cierto'],1,'El alcance de cada afirmación debe corresponder a lo que respalda la fuente.'))+
card('Escribe un párrafo por país','<p>Países utilizados: <strong id="eduCountriesDescription"></strong></p><div id="eduCaseFields"></div>')+
checkModule(5,['Identifiqué fuentes para cada país.','Distingo datos documentados de mis interpretaciones.','Relacioné mis descripciones con la misma pregunta.'])+action(5);
}
function moduleSix(){
return '<div class="edu-stage-header"><span class="tag">Módulo 6 · Organiza</span><h2>Construye una matriz comparativa</h2><p>Aplica los mismos criterios a cada país. Una matriz sirve para encontrar semejanzas y diferencias, no reemplaza el análisis.</p></div>'+
card('¿Qué información falta?',quiz('matrix','¿Qué haces si no existe un dato equivalente para uno de los países?',['Inventas un dato','Registras el vacío y sus posibles efectos sobre la comparación','Copias la información de otro país'],1,'Los vacíos también deben declararse.'))+
card('Tu matriz editable','<p class="field-tip">Se crea automáticamente con los países del módulo 2 y los criterios del módulo 3. En celular puedes desplazarte horizontalmente.</p><div id="eduMatrixFields" class="edu-table-scroll"></div>')+
card('Síntesis inicial',input('similarities','¿Qué semejanzas observas con las evidencias disponibles?','Coinciden en...')+input('differences','¿Qué diferencias documentadas encuentras?','Difieren en...'))+
checkModule(6,['Utilicé los mismos criterios en todos los países.','Las afirmaciones corresponden a evidencias verificables.','Señalé los vacíos de información cuando existen.'])+action(6);
}
function moduleSeven(){
return '<div class="edu-stage-header"><span class="tag">Módulo 7 · Analiza</span><h2>Interpreta semejanzas y diferencias</h2><p>Describir qué sucede es el inicio. Interpretar exige examinar factores contextuales y reconocer los límites de tus fuentes.</p></div>'+
card('Una decisión metodológica',quiz('interpret','Encuentras políticas distintas entre países, pero no sabes por qué. ¿Qué haces?',['Declaras un país superior','Buscas factores contextuales y nuevas evidencias','Inventas una explicación'],1,'Las explicaciones requieren pruebas y prudencia.'))+
card('Construye tu análisis',input('analysis','¿Qué podría explicar las semejanzas y diferencias?','Analiza historia, cultura, economía, políticas u otros factores, con fuentes.')+input('limitations','¿Qué limitaciones afectan tu comparación?','Por ejemplo, falta de datos comparables o diferentes años de publicación.')+input('proposal','¿Qué aprendizaje o propuesta pertinente surge para Bolivia?','No copies prácticas sin examinar su contexto.'))+
checkModule(7,['Separé descripción, interpretación y conclusión.','Mis explicaciones se relacionan con evidencias.','Reconocí limitaciones y evité generalizaciones.'])+action(7);
}
function moduleEight(){
return '<div class="edu-stage-header"><span class="tag">Módulo 8 · Comunica</span><h2>Redacta, revisa y presenta</h2><p>Integra tus productos en tu informe. Las exportaciones de cada módulo son independientes para que organices el documento según tu asignatura.</p></div>'+
card('Ordena tu informe',order('report',['Portada e introducción','Problema, pregunta y objetivos','Metodología y criterios','Descripción de los casos','Matriz y análisis','Conclusiones y propuestas','Referencias en APA 7']))+
card('Escribe tus conclusiones',input('conclusion','Conclusiones fundamentadas','Responde a la pregunta sin afirmar más de lo que muestran las evidencias.')+input('presentation','¿Cómo comunicarás los resultados?','Exposición oral, póster o infografía, según las indicaciones docentes.'))+
card('Revisa tu trabajo','<p>Pregunta: <strong id="eduReportQuestion"></strong></p><p>Objetivo general: <strong id="eduReportObjective"></strong></p><p class="field-tip">Compara ambos y verifica que las conclusiones respondan a lo planteado.</p>')+
checkModule(8,['Mi pregunta y objetivos son coherentes.','Mi análisis reconoce semejanzas, diferencias y límites.','Mis citas y referencias cumplen APA 7.','Mis conclusiones responden a la pregunta con evidencias.'])+action(8);
}
const main=E('mainContent');
if(!main)return;
const guide=E('eduNext')||document.createElement('section');
guide.id='eduNext';guide.className='edu-next';guide.hidden=true;
main.appendChild(guide);
function header(n){return '<nav class="edu-step-nav" aria-label="Módulos de la guía">'+labels.map((name,i)=>'<button type="button" data-stage="'+i+'" class="'+(i===n?'active':'')+'" '+(i>nextUnlocked()?'disabled':'')+' aria-current="'+(i===n?'step':'false')+'">'+i+'</button>').join('')+'</nav><p class="edu-stage-path">Módulo '+n+' de 8 · '+labels[n]+'</p>'}
function nextUnlocked(){let n=0;while(n<8&&data.extra.moduleDone[n])n++;return n}
function progressText(){let count=0;for(let i=0;i<=8;i++)if(data.extra.moduleDone[i])count++;return count}
function stageHTML(n){
if(n===0)return welcome();
if(n===1)return '<div class="edu-stage-header"><span class="tag">Módulo 1 · Comprende</span><h2>¿Qué es una investigación comparativa?</h2><p>Una investigación comparativa examina dos o más contextos mediante criterios comunes; no busca declarar cuál país es mejor.</p></div>'+moduleOneExtras();
if(n===2)return '<div class="edu-stage-header"><span class="tag">Módulo 2 · Delimita</span><h2>Convierte una idea en una pregunta investigable</h2><p>Elige un fenómeno, unidades, nivel, periodo y dimensiones. Las tarjetas del caso modelo permiten explorar países.</p></div>'+moduleTwoExtras();
if(n===3)return '<div class="edu-stage-header"><span class="tag">Módulo 3 · Planifica</span><h2>Objetivos que respondan a tu pregunta</h2><p>Primero redacta objetivos; después selecciona criterios comunes para comparar.</p></div>'+moduleThreeExtras();
if(n===4)return moduleFour();
if(n===5)return moduleFive();
if(n===6)return moduleSix();
if(n===7)return moduleSeven();
return moduleEight();
}
const originalStages={1:E('s1'),2:E('s2'),3:E('s3')};
const oldLab=document.querySelector('#s3 .source-lab');
if(oldLab){oldLab.remove();oldLab.id='eduOriginalLab'}
const stageOneExtra=E('eduOneExtra')||document.createElement('div');
stageOneExtra.id='eduOneExtra';
function compactLegacy(copy,n){const card=copy.querySelector('.card');if(!card)return;const start=card.querySelector('.mentor-note');if(!start)return;const children=[...card.children];let stop;if(n===1)stop=children.find(x=>x.tagName==='H3'&&x.textContent.includes('Descubre'));else if(n===2)stop=children.find(x=>x.classList.contains('country-explorer'));else stop=children.find(x=>x.tagName==='H3'&&x.textContent.includes('Redacta tus objetivos'));if(!stop)return;const d=document.createElement('details');d.className='learning-fold edu-accordion';const summary=document.createElement('summary');summary.textContent='Profundiza: explicación y fundamentos';d.append(summary);card.insertBefore(d,start);let node=start;while(node&&node!==stop){const next=node.nextElementSibling;d.append(node);node=next}}
function mount(n){
active=n;
guide.innerHTML=header(n)+'<div class="edu-module-content">'+stageHTML(n)+'</div>';
if(n<=3&&n>=1){const section=originalStages[n];const target=guide.querySelector('.edu-stage-header');if(section){const copy=section.cloneNode(true);copy.removeAttribute('id');copy.hidden=false;copy.classList.add('edu-legacy');if(n===1){const button=copy.querySelector('[onclick="complete(1)"]');if(button)button.remove();const oldQ=copy.querySelector('#q1');if(oldQ){const oldP=oldQ.previousElementSibling;const oldH=oldP&&oldP.previousElementSibling;if(oldP&&oldP.tagName==='P')oldP.remove();if(oldH&&oldH.tagName==='H3')oldH.remove();oldQ.remove()}const feedback=copy.querySelector('#f1');if(feedback)feedback.remove();}if(n===2){const button=copy.querySelector('[onclick="complete(2)"]');if(button)button.remove();}if(n===3){const button=copy.querySelector('[onclick="complete(3)"]');if(button)button.remove();}compactLegacy(copy,n);target.insertAdjacentElement('afterend',copy);}}
if(n===4&&oldLab){const place=E('eduSourceMove');if(place){const sourceCopy=oldLab.cloneNode(true);sourceCopy.hidden=false;place.append(sourceCopy)}}
guide.querySelectorAll('[data-save]').forEach(el=>{el.value=get(el.dataset.save)});
if(n===1){const el=guide.querySelector('#need');if(el)el.value=data.fields.need||''}
if(n===2){['topic','countries','level','period','dims','question'].forEach(id=>{const el=guide.querySelector('#'+id);if(el)el.value=data.fields[id]||''});const countryContainer=guide.querySelector('.country-explorer');if(countryContainer){countryContainer.querySelectorAll('.country-choice').forEach(btn=>{btn.onclick=()=>{countryContainer.querySelectorAll('.country-choice').forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-pressed',String(x===btn))});const item=countryGuide[btn.dataset.country];countryContainer.querySelector('#countryTitle').textContent=item.name;countryContainer.querySelector('#countryTag').textContent='Explorando '+item.name;countryContainer.querySelector('#countrySummary').textContent=item.summary;const ul=countryContainer.querySelector('#countryDetails');ul.textContent='';item.items.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.append(li)})};});const first=countryContainer.querySelector('.country-choice');if(first)first.click();const add=countryContainer.querySelector('.country-use');if(add)add.onclick=()=>{const selected=countryContainer.querySelector('.country-choice.active');const field=guide.querySelector('#countries');const name=countryGuide[selected.dataset.country].name;const arr=field.value.split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean);if(!arr.includes(name))arr.push(name);field.value=arr.join(', ');data.fields.countries=field.value;persist()}}}
if(n===3){['general','specific1','specific2','coherence'].forEach(id=>{const el=guide.querySelector('#'+id);if(el)el.value=data.fields[id]||''});const p=guide.querySelector('#questionMirror');if(p)p.textContent=data.fields.question||'Completa tu pregunta en el módulo 2.'}
if(n===4){['preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'].forEach(id=>{const el=guide.querySelector('#'+id);if(el)el.value=data.fields[id]||''});drawBank()}
if(n===5)drawDescriptions();
if(n===6)drawMatrix();
if(n===8){E('eduReportQuestion').textContent=data.fields.question||'Pendiente';E('eduReportObjective').textContent=data.fields.general||'Pendiente'}
document.querySelectorAll('.sidebar [data-page]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.page==='s'+n)});
const state=E('eduSaveNotice');if(state)state.textContent='Progreso guardado en este navegador';
}
function drawDescriptions(){const el=E('eduCaseFields');if(!el)return;E('eduCountriesDescription').textContent=countries().join(', ');el.replaceChildren();for(const name of countries()){const box=document.createElement('div');box.className='edu-case';const h=document.createElement('h4');h.textContent=name;box.append(h);const lbl=document.createElement('label');lbl.textContent='Hallazgo, evidencia y análisis breve';const ta=document.createElement('textarea');ta.rows=5;ta.dataset.countryDescription=name;ta.value=data.extra.descriptions[name]||'';ta.placeholder='¿Qué se ha documentado? Incluye fuente, sección y relación con el criterio.';lbl.append(ta);box.append(lbl);el.append(box)}}
function drawMatrix(){const el=E('eduMatrixFields');if(!el)return;const all=countries(), rows=criteria();const table=document.createElement('table');table.className='edu-matrix';const head=document.createElement('thead');const tr=document.createElement('tr');['Criterio',...all].forEach(t=>{const th=document.createElement('th');th.textContent=t;tr.append(th)});head.append(tr);table.append(head);const body=document.createElement('tbody');for(const criterion of rows){const row=document.createElement('tr');const th=document.createElement('th');th.textContent=criterion;row.append(th);for(const country of all){const td=document.createElement('td');const ta=document.createElement('textarea');ta.rows=3;ta.setAttribute('aria-label',criterion+' · '+country);ta.dataset.matrixCriterion=criterion;ta.dataset.matrixCountry=country;ta.value=(data.extra.matrix[criterion]||{})[country]||'';ta.placeholder='Hallazgo y fuente';td.append(ta);row.append(td)}body.append(row)}table.append(body);el.replaceChildren(table)}
function drawBank(){const root=E('eduSourceBank');if(!root)return;root.replaceChildren();(data.extra.sources||[]).forEach((s,i)=>{const article=document.createElement('article');article.className='edu-source';const title=document.createElement('strong');title.textContent=(i+1)+'. '+s.title;const p=document.createElement('p');p.textContent=(s.author||'Autor no indicado')+' · '+(s.year||'s. f.')+' · '+s.locator;const b=document.createElement('button');b.type='button';b.textContent='Eliminar ficha';b.onclick=()=>{data.extra.sources.splice(i,1);persist();drawBank()};article.append(title,p,b);root.append(article)})}
function msg(text,bad=false){const target=guide.querySelector('[data-module-feedback="'+active+'"]');if(target){target.textContent=text;target.dataset.status=bad?'error':'success'}return !bad}
function advance(n){
if(n!==active)return;
if(n===0&&get('likert')==='')return msg('Selecciona tu nivel de conocimientos previos.',true);
if(n===1&&(!data.fields.need?.trim()||!get('ownDefinition')?.trim()||get('quiz_comparar')!=='1'||get('matchResult_concepts')!=='correct'))return msg('Completa tu idea y definición, elige la pregunta comparativa y comprueba las relaciones.',true);
if(n===2){const blank=required[2].find(k=>!String(data.fields[k]||'').trim());if(blank)return msg('Completa tu delimitación: falta '+blank+'.',true);if(countries().length<2)return msg('Selecciona al menos dos unidades de comparación.',true);if(get('quiz_delimit')!=='1')return msg('Revisa la actividad sobre delimitación.',true)}
if(n===3){const blank=required[3].find(k=>!String(data.fields[k]||'').trim());if(blank)return msg('Completa tus objetivos y su relación con la pregunta.',true);if(data.extra.criteria.length<2||data.extra.criteria.length>4)return msg('Selecciona de dos a cuatro criterios.',true);if(!get('criterionReason').trim())return msg('Explica por qué elegiste esos criterios.',true);if(get('quiz_objectives')!=='1')return msg('Revisa la práctica sobre objetivos.',true)}
if(n===4){if(!(data.extra.sources||[]).length)return msg('Guarda al menos una ficha en el banco de fuentes.',true);if(get('quiz_sources')!=='1'||get('quiz_ai')!=='1'||get('orderResult_search')!=='correct')return msg('Completa la búsqueda ordenada y las actividades de fuentes e IA.',true)}
if(n===5&&(countries().some(c=>!String(data.extra.descriptions[c]||'').trim())||get('orderResult_paragraph')!=='correct'||get('quiz_paraphrase')!=='1'))return msg('Completa la descripción de cada país y las prácticas del párrafo académico.',true);
if(n===6&&(!get('similarities').trim()||!get('differences').trim()||get('quiz_matrix')!=='1'))return msg('Escribe semejanzas y diferencias y revisa la práctica sobre vacíos de información.',true);
if(n===7&&(!get('analysis').trim()||!get('limitations').trim()||get('quiz_interpret')!=='1'))return msg('Incluye interpretación, limitaciones y revisa la práctica de decisiones.',true);
if(n===8&&(!get('conclusion').trim()||get('orderResult_report')!=='correct'))return msg('Redacta tus conclusiones y revisa el orden del informe.',true);
data.extra.moduleDone[n]=true;data.completed=Math.max(Number(data.completed)||0,n);persist();if(n<8){navigate(n+1)}else{msg('Ruta completada. Guarda tus productos Word y revisa la calidad de tus evidencias con tu docente.');}
}
function navigate(n){if(n>nextUnlocked())return;active=n;document.querySelectorAll('main > section').forEach(s=>{if(s!==guide)s.hidden=true});E('home').hidden=true;guide.hidden=false;mount(n);history.replaceState(null,'','#modulo-'+n);window.scrollTo({top:0,behavior:'instant'});}
function returnToMap(){guide.hidden=true;E('home').hidden=true;document.querySelectorAll('main > section').forEach(s=>s.hidden=true);const map=E('map');map.hidden=false;map.innerHTML='<article class="card edu-route-map"><span class="tag">Ruta de aprendizaje · 9 apartados</span><h2>Tu ruta metodológica</h2><p>Bienvenida y ocho módulos. Selecciona un apartado completado o el siguiente disponible.</p><div id="eduMapStations" class="edu-map-stations"></div></article>';const box=E('eduMapStations');labels.forEach((title,i)=>{const b=document.createElement('button');b.className='edu-map-stop';b.disabled=i>nextUnlocked();b.textContent=i+'. '+title+(data.extra.moduleDone[i]?' · completado':i===nextUnlocked()?' · continúa aquí':' · pendiente');b.onclick=()=>navigate(i);box.append(b)});window.scrollTo(0,0)}
function matchCheck(id){const root=guide.querySelector('[data-match="'+id+'"]');if(!root)return;const selected=[...root.querySelectorAll('select')].map(x=>x.value);const expected=['Dificultades de lectura','Argentina, Bolivia y Perú','Normativa de apoyo'];const correct=selected.every((v,i)=>v===expected[i]);const msg=root.querySelector('[data-match-feedback]');msg.textContent=correct?'Correcto. Has relacionado los conceptos.':'Revisa: fenómeno es lo que estudias; unidad es dónde comparas; criterio es qué aspecto observas.';put('matchResult_'+id,correct?'correct':'retry')}
function orderMove(li,offset){const ol=li.parentElement;const list=[...ol.children];const i=list.indexOf(li),j=i+offset;if(j<0||j>=list.length)return;if(offset<0)ol.insertBefore(li,list[j]);else ol.insertBefore(list[j],li);saveOrder(ol.closest('[data-order]'))}
function saveOrder(root){if(!root)return;put('order_'+root.dataset.order,[...root.querySelectorAll('li')].map(el=>Number(el.dataset.orderId)))}
function orderCheck(id){const root=guide.querySelector('[data-order="'+id+'"]');if(!root)return;const arr=[...root.querySelectorAll('li')].map(el=>Number(el.dataset.orderId));const result=arr.every((v,i)=>v===i);root.querySelector('[data-order-feedback]').textContent=result?'Secuencia correcta.':'La secuencia aún no sigue el procedimiento esperado. Revisa los pasos.';put('orderResult_'+id,result?'correct':'retry')}
let drag=null;
guide.addEventListener('dragstart',e=>{const li=e.target.closest('[data-order-id]');if(li){drag=li;e.dataTransfer.effectAllowed='move';}});
guide.addEventListener('dragover',e=>{const li=e.target.closest('[data-order-id]');if(drag&&li&&li!==drag)e.preventDefault()});
guide.addEventListener('drop',e=>{const li=e.target.closest('[data-order-id]');if(drag&&li&&li!==drag){e.preventDefault();li.parentElement.insertBefore(drag,li);saveOrder(li.closest('[data-order]'))}drag=null});
guide.addEventListener('input',e=>{const t=e.target;if(t.dataset.save){put(t.dataset.save,t.value);return}if(t.dataset.countryDescription){data.extra.descriptions[t.dataset.countryDescription]=t.value;persist();return}if(t.dataset.matrixCriterion){data.extra.matrix[t.dataset.matrixCriterion]=data.extra.matrix[t.dataset.matrixCriterion]||{};data.extra.matrix[t.dataset.matrixCriterion][t.dataset.matrixCountry]=t.value;persist();return}if(t.id&&['need','topic','countries','level','period','dims','question','general','specific1','specific2','coherence','preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'].includes(t.id)){data.fields[t.id]=t.value;persist();if(t.id==='question'){const p=guide.querySelector('#questionMirror');if(p)p.textContent=t.value}}});
guide.addEventListener('change',e=>{const t=e.target;if(t.dataset.save){put(t.dataset.save,t.value)}if(t.dataset.checkModule){const n=t.dataset.checkModule;data.extra.checks[n]=data.extra.checks[n]||{};data.extra.checks[n][t.dataset.checkIndex]=t.checked;persist()}if(t.dataset.criterion){if(t.checked&&!data.extra.criteria.includes(t.dataset.criterion))data.extra.criteria.push(t.dataset.criterion);if(!t.checked)data.extra.criteria=data.extra.criteria.filter(x=>x!==t.dataset.criterion);persist()}if(t.dataset.matchItem){const root=t.closest('[data-match]');const key='match_'+root.dataset.match;data.extra.responses[key]=data.extra.responses[key]||{};data.extra.responses[key][t.dataset.matchItem]=t.value;persist()}});
guide.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.stage!==undefined){navigate(Number(t.dataset.stage));return}if(t.dataset.quiz===undefined&&t.dataset.answer!==undefined){const root=t.closest('[data-quiz]'),id=root.dataset.quiz;put('quiz_'+id,t.dataset.answer);root.querySelectorAll('[data-answer]').forEach(btn=>{btn.classList.toggle('chosen',btn===t);btn.setAttribute('aria-pressed',String(btn===t))});root.querySelector('[data-feedback]').textContent=Number(t.dataset.answer)===Number(root.dataset.correct)?'Correcto. Puedes continuar.':'Todavía no. Revisa el ejemplo y vuelve a intentarlo.';return}if(t.dataset.topic){const f=guide.querySelector('#topic');if(f){f.value=t.dataset.topic;data.fields.topic=t.dataset.topic;persist();f.focus()}return}if(t.id==='eduQuestionDraft'){const f=guide.querySelector('#question');if(f){const q='¿Qué semejanzas y diferencias existen en '+(data.fields.dims||'las estrategias')+' relacionadas con '+(data.fields.topic||'el fenómeno educativo')+' en '+(data.fields.countries||'los países seleccionados')+' durante '+(data.fields.period||'el período definido')+' en '+(data.fields.level||'el nivel seleccionado')+'?';f.value=q;data.fields.question=q;persist();f.focus()}return}if(t.dataset.matchCheck){matchCheck(t.dataset.matchCheck);return}if(t.dataset.orderCheck){orderCheck(t.dataset.orderCheck);return}if(t.dataset.move){orderMove(t.closest('li'),Number(t.dataset.move));return}if(t.dataset.addSource!==undefined){const source={title:data.fields.sourceTitle||'',url:data.fields.sourceUrl||'',locator:data.fields.sourceLocator||'',idea:data.fields.sourceIdea||'',note:data.fields.sourceNote||'',author:get('sourceAuthor'),year:get('sourceYear')};if(!source.title||!source.url||!source.idea||!/^https?:\/\//i.test(source.url)){const p=E('eduSourceBank');p.textContent='Completa título, enlace válido (https://...) e idea útil para guardar la ficha.';return}data.extra.sources=data.extra.sources||[];data.extra.sources.push(source);persist();drawBank();return}if(t.dataset.complete!==undefined){advance(Number(t.dataset.complete));return}if(t.dataset.export!==undefined){exportWord(Number(t.dataset.export));return}});
function changeMainNav(){const side=document.querySelector('.sidebar');if(side){side.querySelectorAll('button[data-page^="s"],.sidebar-label').forEach(x=>x.hidden=true);const label=document.createElement('span');label.className='sidebar-label';label.textContent='Módulos de aprendizaje';side.append(label);labels.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+'. '+title;b.onclick=()=>navigate(i);b.dataset.edunav=i;side.append(b)})}const header=document.querySelector('header nav');if(header){header.innerHTML='';[['Inicio',0],['Ruta',-1],['Mi progreso',-2]].forEach(([label,n])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>n===-1?returnToMap():n===-2?openProgress():navigate(0);header.append(b)})}const launch=document.querySelector('#home .cta');if(launch)launch.onclick=()=>navigate(0);}
function openProgress(){guide.hidden=true;E('home').hidden=true;document.querySelectorAll('main > section').forEach(s=>s.hidden=true);E('progress').hidden=false;const label=E('summary2');if(label)label.textContent=progressText()+' de 9 apartados completados · '+Math.round(progressText()/9*100)+'%';const bar=E('bar2');if(bar)bar.style.width=Math.round(progressText()/9*100)+'%';}
const oldShow=show;
show=function(id){if(id==='home'||id==='map'||id==='progress'){if(id==='map')return returnToMap();if(id==='progress')return openProgress();return navigate(0)}if(/^s[1-8]$/.test(id))return navigate(Number(id.slice(1)));return oldShow(id)};
changeMainNav();
const bar=E('eduSaveNotice')||document.createElement('div');bar.id='eduSaveNotice';bar.className='edu-save-notice';bar.setAttribute('role','status');bar.textContent='Progreso guardado en este navegador';document.body.append(bar);
const past=location.hash.match(/^#modulo-(\d)$/);navigate(past?Math.min(nextUnlocked(),Number(past[1])):0);
})();
