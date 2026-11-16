
/* EDU-113 v1.0 · Ampliación modular conservando data, ids y clave localStorage */
(function(){
'use strict';
const labels=['Bienvenida','¿Qué es la investigación comparativa?','Delimitar tema','Objetivos y criterios','Fuentes y uso responsable de la inteligencia artificial','Describir cada caso','Matriz comparativa','Interpretar y explicar','Redactar y revisar'];
const descriptions=['Conoce la guía y registra tu punto de partida','Distingue describir, investigar y comparar','Define fenómeno, tres países, nivel, periodo y dimensiones','Formula objetivos y elige criterios pertinentes','Localiza, verifica y registra fuentes','Redacta descripciones con evidencias por país','Organiza hallazgos con criterios comunes','Analiza semejanzas, diferencias y contexto','Revisa conclusiones y prepara tu informe'];
const required={
1:['need'],2:['topic','countries','level','period','dims'],
3:['general','specific1','specific2'],
4:['sourceTitle','sourceUrl','sourceLocator','preamble','evidence','commentary'],
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
return '<div class="edu-check-panel"><h3>Revisa tu producto antes de continuar</h3>'+items.map((text,i)=>'<label class="edu-check"><input type="checkbox" data-check-module="'+n+'" data-check-index="'+i+'" '+(done[i]?'checked':'')+'><span>'+text+'</span></label>').join('')+'<label for="edu_rubric_'+n+'">Autoevaluación de este producto</label><select id="edu_rubric_'+n+'" data-save="rubric_'+n+'">'+opts(['','Logrado','En proceso','Necesita mejoras'],get('rubric_'+n))+'</select><p class="field-tip">Esta lista sirve para autoevaluarte; no certifica la calidad metodológica de tus respuestas.</p></div>';
}
function action(n){return '<div class="edu-module-actions"><button type="button" class="edu-primary" data-complete="'+n+'">Guardar y continuar</button><p class="edu-action-feedback" data-module-feedback="'+n+'" role="status" aria-live="polite"></p></div>'}
function welcome(){
return '<div class="edu-stage-header"><span class="tag">Módulo 0 · Bienvenida</span><h2>Tu primera investigación comparativa, paso a paso</h2><p>Investigar es buscar evidencias, organizarlas y explicar lo que significan. Aquí aprenderás haciendo, sin necesidad de dominar la investigación desde el inicio.</p></div>'+
card('¿Qué vas a construir?','<p>Al finalizar esta guía, tendrás elaborados los elementos principales de tu primera investigación comparativa: un tema delimitado, una pregunta de investigación, objetivos claros, fuentes confiables y una matriz comparativa. Estos avances te servirán de base para organizar y redactar tu informe final.</p><div class="edu-workflow" role="img" aria-label="Flujo de aprendizaje: entender la investigación comparativa; elegir tema, pregunta y objetivos; buscar fuentes y describir casos; comparar mediante la matriz de yuxtaposición e interpretar; comunicar el informe final."><div class="edu-flow-step"><span class="edu-flow-icon" aria-hidden="true">◈</span><strong>Entender</strong><small>Módulo 1 · Fundamentos</small></div><span class="edu-flow-arrow" aria-hidden="true">→</span><div class="edu-flow-step"><span class="edu-flow-icon" aria-hidden="true">◎</span><strong>Elegir</strong><small>Módulos 2–3 · Tema y objetivos</small></div><span class="edu-flow-arrow" aria-hidden="true">→</span><div class="edu-flow-step"><span class="edu-flow-icon" aria-hidden="true">⌕</span><strong>Buscar</strong><small>Módulos 4–5 · Fuentes y casos</small></div><span class="edu-flow-arrow" aria-hidden="true">→</span><div class="edu-flow-step"><span class="edu-flow-icon" aria-hidden="true">⇄</span><strong>Comparar</strong><small>Módulos 6–7 · Yuxtaposición y análisis</small></div><span class="edu-flow-arrow" aria-hidden="true">→</span><div class="edu-flow-step"><span class="edu-flow-icon" aria-hidden="true">▤</span><strong>Producto final</strong></div></div>')+
card('Tu punto de partida',input('studentName','Nombre del estudiante','Escribe tu nombre',false)+'<label for="edu_likert">¿Qué tanto sabes sobre comparar sistemas educativos?</label><select id="edu_likert" data-save="likert">'+opts(['','Nada','Poco','Algo','Bastante','Mucho'],get('likert'))+'</select>'+'<p class="field-tip">No hay respuestas correctas o incorrectas. Esta información es solo para tu reflexión.</p>')+
card('Cómo se utiliza la guía','<p>En cada módulo encontrarás una práctica breve, un ejemplo y campos para crear tu propio producto. El progreso se guarda en este navegador. Para trabajar en otro dispositivo, conserva un respaldo.</p>'+fold('Uso responsable de IA','La IA puede ayudarte a explorar y organizar ideas, pero no reemplaza la lectura, la verificación de fuentes ni tu análisis personal. Nunca cites una fuente sin abrirla y comprobarla.'))+
action(0);
}
const m1Practice=[
{id:'m1q1',q:'¿Qué es la Educación Comparada?',options:['Una clasificación de países según su calidad educativa','Un campo que estudia y compara la educación en diferentes contextos','Una lista de asignaturas escolares'],answer:1,correct:'La Educación Comparada estudia la educación en distintos contextos para comprender semejanzas, diferencias y sus posibles explicaciones.',wrong:['No se trata de decidir qué país es mejor.','', 'No se limita a enumerar asignaturas.']},
{id:'m1q2',q:'¿Qué es un fenómeno educativo?',options:['Una situación o proceso que ocurre en la educación y puede estudiarse','El nombre de un país','Un documento sin relación con la escuela'],answer:0,correct:'Las dificultades de lectura, la deserción escolar y la inclusión son ejemplos de fenómenos educativos.',wrong:['','Un país es una unidad de comparación, no un fenómeno.','Un documento puede ser una fuente, pero no es el fenómeno mismo.']},
{id:'m1q3',q:'¿Qué son los criterios de comparación?',options:['Opiniones sobre qué país parece mejor','Los nombres de las personas investigadoras','Aspectos comunes que examinamos en cada caso, como currículo o evaluación'],answer:2,correct:'Aplicar el mismo criterio a cada país permite una comparación coherente.',wrong:['Una preferencia personal no es un criterio verificable.','Los nombres de autoría no son los aspectos que comparas.','']},
{id:'m1q4',q:'¿Cuáles son unidades o elementos de comparación?',options:['La pregunta y su respuesta','Bolivia, Argentina y Perú cuando se comparan sus sistemas educativos','Solamente las fuentes bibliográficas'],answer:1,correct:'Los países son unidades de comparación; también podrían compararse regiones, instituciones o períodos.',wrong:['La pregunta orienta la investigación, pero no constituye por sí misma las unidades.','','Las fuentes aportan evidencias, no son necesariamente las unidades de análisis.']},
{id:'m1q5',q:'¿Para qué necesitamos fuentes en una comparación?',options:['Para afirmar causas sin comprobarlas','Para copiar conclusiones ajenas','Para fundamentar lo que decimos sobre cada caso'],answer:2,correct:'Las fuentes verificables permiten describir cada caso y justificar semejanzas y diferencias.',wrong:['Las causas deben investigarse, no suponerse.','Copiar conclusiones no es analizar.','']}
];
const phenomenaM1=[
{name:'Dificultades de lectura',icon:'📖',desc:'Algunos estudiantes necesitan apoyo para leer y comprender textos.',idea:'He observado dificultades para comprender textos en educación primaria.'},
{name:'Deserción escolar',icon:'🏫',desc:'Estudiantes que abandonan la escuela antes de terminar sus estudios.',idea:'Me preocupa que algunos estudiantes abandonen sus estudios.'},
{name:'Inclusión educativa',icon:'🤝',desc:'Barreras que dificultan que todas las personas participen y aprendan.',idea:'He observado barreras para la participación de estudiantes con distintas necesidades.'},
{name:'Brecha digital',icon:'💻',desc:'Diferencias en el acceso o uso educativo de internet y tecnología.',idea:'He observado desigualdades en el acceso a recursos digitales para aprender.'},
{name:'Formación docente',icon:'🎓',desc:'Preparación y actualización de profesores para enseñar.',idea:'Me interesa investigar cómo se prepara a los docentes para atender dificultades de aprendizaje.'},
{name:'Educación rural',icon:'🌱',desc:'Oportunidades y dificultades de aprendizaje en comunidades rurales.',idea:'Me interesa investigar las oportunidades educativas en zonas rurales.'}
];
function m1Quiz(q){
const stored=get('quiz_'+q.id);
const buttons=q.options.map((op,i)=>'<button type="button" class="edu-answer'+(stored===String(i)?' chosen':'')+'" data-answer="'+i+'" aria-pressed="'+(stored===String(i))+'">'+escapeHTML(op)+'</button>').join('');
return '<div class="edu-quiz edu-m1-quiz" data-quiz="'+q.id+'" data-correct="'+q.answer+'"><p class="edu-question">'+escapeHTML(q.q)+'</p>'+buttons+'<p class="edu-feedback" data-feedback="'+q.id+'" data-result="'+(stored===''?'pending':Number(stored)===q.answer?'correct':'incorrect')+'" role="status" aria-live="polite">'+(stored===''?'Selecciona una respuesta para ver la explicación.':(Number(stored)===q.answer?'Correcto. '+q.correct:'Incorrecto. '+(q.wrong[Number(stored)]||'Revisa los conceptos y vuelve a intentarlo.')))+'</p></div>';
}
function m1Case(){
const fields=[
['Fenómeno educativo','Dificultades de aprendizaje'],
['Nivel educativo','Educación primaria'],
['Países','Argentina, Bolivia y Perú'],
['Pregunta comparativa','¿Qué semejanzas y diferencias presentan las estrategias de atención a las dificultades de aprendizaje en primaria de estos países?']
];
return '<div class="edu-case-grid">'+fields.map((a,i)=>'<div class="edu-case-tile"><span class="edu-case-icon" aria-hidden="true">'+['🔎','📚','🌎','❓'][i]+'</span><span class="edu-case-label">'+a[0]+'</span><strong>'+a[1]+'</strong></div>').join('')+'</div>';
}
function moduleOneExtras(){
return card('Primero observa, después construye','<p><strong>¿Qué producirás en este módulo?</strong> Una primera idea de un fenómeno o necesidad educativa que te interese investigar.</p><p>Una <strong>necesidad educativa</strong> es algo que necesita atención o mejora para facilitar el aprendizaje o la participación. Por ejemplo, estudiantes que necesitan apoyo para comprender lo que leen.</p>'+fold('¿En qué se diferencia de un fenómeno educativo?','Un fenómeno educativo es una situación o proceso que podemos estudiar, como la deserción o la formación docente. Una necesidad educativa señala qué apoyo o mejora hace falta dentro de esa situación.')+
'<h4>Caso práctico: dificultades de aprendizaje</h4><p class="field-tip">Observa cómo identificamos los elementos de una posible comparación. Es un ejemplo de planteamiento, no una conclusión de investigación.</p>'+m1Case())+
fold('¿Cómo se realiza una comparación educativa rigurosa?','<p>Primero definimos qué aspectos estudiaremos en común, por ejemplo las políticas de apoyo, el currículo o la evaluación. Después buscamos evidencias de cada país para esos mismos criterios. Finalmente explicamos sus semejanzas y diferencias, sin afirmar causas que no hayan sido comprobadas.</p><p><strong>Pregúntate:</strong> ¿estoy comparando el mismo aspecto y el mismo nivel educativo en todos los países?</p>')+
card('Elige un fenómeno que te interese investigar','<p>Un <strong>fenómeno educativo</strong> es una situación que ocurre en la educación y que podemos estudiar. Explora estos ejemplos. Selecciona uno para empezar tu idea; después podrás modificarla.</p><div class="edu-phenomena">'+phenomenaM1.map((x,i)=>'<button type="button" class="edu-phenomenon" data-phenomenon="'+i+'"><span class="edu-phenomenon-icon" aria-hidden="true">'+x.icon+'</span><strong>'+x.name+'</strong><small>'+x.desc+'</small></button>').join('')+'</div><label for="need">¿Qué necesidad o situación educativa has observado en tu entorno?</label><textarea id="need" rows="3" placeholder="Escribe una situación concreta que te gustaría investigar."></textarea>'+input('researchPurpose','¿Qué te gustaría averiguar o comparar sobre esa situación?','Por ejemplo, cómo se apoya la lectura en escuelas de distintos países.'))+
card('Práctica de clasificación',m1Quiz({id:'comparar',q:'¿Cuál enunciado propone una comparación educativa?',options:['¿Qué es la dislexia?','¿Qué estrategias de apoyo a la lectura se aplican en Bolivia y Perú?','¿Por qué existen problemas educativos?'],answer:1,correct:'Compara un mismo fenómeno (apoyo a la lectura) en dos países. Para investigar, aún habría que precisar el nivel y el período.',wrong:['Esta pregunta solo pide definir un concepto. No compara dos casos.','','Esta pregunta es muy general: no especifica qué casos o aspectos se compararán.']}))+
card('Relaciona conceptos','<p class="field-tip">Selecciona el ejemplo que corresponda a cada concepto. Las alternativas están mezcladas.</p>'+match('concepts',[['Fenómeno educativo','Dificultades de lectura'],['Unidades o elementos a comparar','Argentina, Bolivia y Perú'],['Criterio común','Currículo educativo']]))+
card('Comprueba lo aprendido','<p>Responde estas cinco preguntas. Recibirás una explicación después de cada respuesta.</p><div class="edu-m1-assessment">'+m1Practice.map((q,i)=>'<div class="edu-mini-question"><span class="edu-mini-count">Pregunta '+(i+1)+' de 5</span>'+m1Quiz(q)+'</div>').join('')+'</div>')+
card('Mi primera idea','<p>Con lo que aprendiste, escribe una explicación breve con tus propias palabras.</p>'+input('ownDefinition','¿Qué significa investigar y comparar en educación?','Investigar comparativamente es...')+fold('Ejemplo de respuesta breve','Comparar consiste en estudiar el mismo fenómeno en distintos contextos, utilizando criterios y fuentes comunes. No significa elegir un país ganador.'))+
action(1);
}

const m2Phenomena=['Dificultades de aprendizaje','Comprensión lectora','Deserción escolar','Ausentismo escolar','Inclusión educativa','Brecha digital','Formación docente','Educación intercultural','Violencia escolar','Acoso escolar','Rendimiento académico','Alfabetización inicial','Acceso a educación rural','Educación bilingüe','Evaluación del aprendizaje','Educación socioemocional','Participación familiar','Accesibilidad educativa','Educación técnica','Uso pedagógico de la IA'];
const m2Countries=['Argentina','Bolivia','Brasil','Chile','Colombia','Costa Rica','Cuba','Ecuador','El Salvador','Guatemala','Haití','Honduras','México','Nicaragua','Panamá','Paraguay','Perú','República Dominicana','Uruguay','Venezuela'];
const m2Levels=['Primera infancia (0 a 3 años)','Educación inicial o preescolar','Educación primaria','Educación secundaria','Educación técnica y tecnológica','Educación superior universitaria','Educación de posgrado','Educación de personas jóvenes y adultas','Educación permanente de personas mayores','Educación especial e inclusiva (modalidad transversal)'];
const m2Dimensions=['Normativa y políticas educativas','Currículo y adaptaciones curriculares','Estrategias de enseñanza y atención','Formación y capacitación docente','Evaluación del aprendizaje','Acceso, permanencia y equidad','Recursos didácticos y tecnológicos','Programas de apoyo educativo','Participación familiar y comunitaria','Infraestructura y accesibilidad','Resultados de aprendizaje','Gestión y financiamiento'];
const m2Law={
Argentina:{flag:'🇦🇷',law:'Ley 27.306 (2016)',detail:'Establece medidas para abordar las dificultades específicas del aprendizaje (DEA), incluida la capacitación docente y las adaptaciones curriculares.',url:'https://www.argentina.gob.ar/normativa/nacional/ley27306-267234/texto',questions:['¿Qué medidas para estudiantes con DEA establece la Ley 27.306?','¿Qué adaptaciones curriculares y de evaluación prevé la norma?','¿Qué formación docente y apoyos institucionales se contemplan?','¿Qué estudios permiten conocer cómo se aplican estas medidas en primaria?']},
Bolivia:{flag:'🇧🇴',law:'Ley de la Educación N.º 070 (2010)',detail:'Contempla la educación especial y la atención a personas con dificultades en el aprendizaje dentro del Sistema Educativo Plurinacional.',url:'https://opce.gob.bo/web/files/archivos/ley_070.pdf',questions:['¿Cómo aborda la Ley 070 las dificultades en el aprendizaje?','¿Qué programas y orientaciones curriculares existen para estudiantes de primaria?','¿Qué capacitación o apoyo técnico reciben los docentes?','¿Qué documentos del Ministerio de Educación describen la atención educativa?']},
Perú:{flag:'🇵🇪',law:'Ley General de Educación N.º 28044 y normativa de educación inclusiva',detail:'Su marco de educación inclusiva contempla barreras curriculares, adaptaciones y atención a la diversidad, incluidos trastornos del aprendizaje.',url:'https://busquedas.elperuano.pe/dispositivo/NL/1951686-1',questions:['¿Qué disposiciones sobre inclusión y dificultades de aprendizaje recoge la normativa?','¿Cómo se plantea la adaptación del currículo y la evaluación en primaria?','¿Qué orientaciones oficiales existen para la formación y el apoyo docente?','¿Qué investigaciones describen la aplicación de estas medidas?']}
};
function m2CaseCards(){
const parts=[['Fenómeno','Dificultades de aprendizaje'],['Unidades','Argentina, Bolivia y Perú'],['Nivel','Educación primaria'],['Dimensiones','Currículo y estrategias de atención'],['Período documental','2016–2026']];
return '<div class="edu-m2-case-grid">'+parts.map((p,i)=>'<div class="edu-m2-case-tile"><span class="edu-m2-card-no">0'+(i+1)+'</span><span class="edu-m2-case-label">'+p[0]+'</span><strong>'+p[1]+'</strong></div>').join('')+'</div>';
}
function m2FlipCards(){
const pairs=[['Fenómeno','Dificultades de aprendizaje'],['Unidades a comparar','Argentina, Bolivia y Perú'],['Nivel educativo','Educación primaria'],['Dimensiones','Currículo y estrategias de atención'],['Período documental','2016–2026']];
return '<div class="edu-m2-flip-grid">'+pairs.map((p,i)=>'<button type="button" class="edu-m2-flip" data-m2-flip aria-pressed="false" aria-label="'+p[0]+': ver respuesta"><span class="edu-m2-flip-inner"><span class="edu-m2-flip-face edu-m2-flip-front"><span class="edu-m2-flip-icon" aria-hidden="true">'+['◈','◎','▤','⇄','◷'][i]+'</span><strong>'+p[0]+'</strong><small>Toca para descubrir</small></span><span class="edu-m2-flip-face edu-m2-flip-back"><strong>'+p[1]+'</strong><small>Toca para volver</small></span></span></button>').join('')+'</div>';
}
function m2CountryExplorer(){
return '<div class="edu-m2-country-explorer"><p>Selecciona un país para conocer una norma de referencia y explorar preguntas que pueden orientar la búsqueda de fuentes. <strong>La existencia de una ley no demuestra por sí sola su aplicación.</strong></p><div class="edu-m2-country-buttons" role="group" aria-label="Seleccionar país del ejemplo">'+Object.keys(m2Law).map((name,i)=>'<button type="button" data-m2-country="'+name+'" aria-pressed="'+(i===0)+'" class="'+(i===0?'is-selected':'')+'"><span aria-hidden="true">'+m2Law[name].flag+'</span>'+name+'</button>').join('')+'</div><div id="eduM2CountryInfo" class="edu-m2-country-info" aria-live="polite"></div></div>';
}
function m2CountryHTML(name){
const info=m2Law[name]||m2Law.Argentina;
return '<span class="tag">Fenómeno: dificultades de aprendizaje en primaria</span><h4>'+escapeHTML(name)+'</h4><p><strong>Norma de referencia:</strong> '+escapeHTML(info.law)+'. '+escapeHTML(info.detail)+'</p><p><a href="'+info.url+'" target="_blank" rel="noopener noreferrer">Consultar fuente oficial</a></p><h5>Preguntas para orientar tu investigación</h5><ol>'+info.questions.map(q=>'<li>'+escapeHTML(q)+'</li>').join('')+'</ol><p class="field-tip">Comprueba en fuentes oficiales la vigencia de las normas y busca evidencias sobre su aplicación. Las preguntas no son resultados comprobados.</p>';
}
function m2Select(id,label,values,placeholder){
return '<label for="'+id+'">'+label+'</label><select id="'+id+'" data-m2-field="'+id+'"><option value="">'+placeholder+'</option>'+values.map(v=>'<option value="'+escapeHTML(v)+'">'+escapeHTML(v)+'</option>').join('')+'<option value="__other">Otro (escribir debajo)</option></select><input class="edu-input edu-m2-other" id="'+id+'Other" data-m2-other="'+id+'" type="text" placeholder="Escribe una opción diferente" hidden>';
}
function m2CountrySelector(){
return '<fieldset class="edu-m2-country-field"><legend>Países o unidades de comparación</legend><p class="field-tip">Despliega el menú y selecciona exactamente tres países de América Latina.</p><details class="edu-m2-country-dropdown"><summary id="eduM2CountrySummary">Selecciona tres países</summary><div class="edu-m2-country-list">'+m2Countries.map(x=>'<label><input type="checkbox" data-m2-select-country="'+x+'"><span>'+x+'</span></label>').join('')+'</div></details><p id="eduM2CountryCount" class="edu-m2-country-count" role="status" aria-live="polite"></p></fieldset>';
}
function m2DimensionSelector(){
return '<fieldset class="edu-m2-dimensions"><legend>Dimensiones preliminares · ¿qué aspectos estudiarás?</legend><p class="field-tip">Selecciona al menos una dimensión. En el módulo 3 podrás revisar y precisar tus criterios de comparación.</p><div class="edu-m2-dim-list">'+m2Dimensions.map(x=>'<label><input type="checkbox" data-m2-dimension="'+x+'"><span>'+x+'</span></label>').join('')+'</div><label for="eduM2DimensionOther">Otra dimensión (si corresponde)</label><input id="eduM2DimensionOther" class="edu-input" type="text" placeholder="Escribe otra dimensión que quieras comparar"></fieldset>';
}
function moduleTwoExtras(){
return card('Producto esperado: de una idea general a un tema delimitado','<p>Observa cómo una idea amplia se convierte en un tema que podemos investigar.</p><h4>Ejemplo</h4>'+m2CaseCards())+
fold('¿Cómo sé si mi tema está bien delimitado?','<p>Comprueba que identificaste el fenómeno, los tres países, el nivel educativo, un período de documentos y las dimensiones que compararás. También deberás verificar que existan fuentes suficientes para los tres casos.</p>')+
card('Tema y delimitación',fold('Explicación y fundamentos','<p><strong>Delimitar</strong> significa precisar qué vas a estudiar, dónde, en qué nivel educativo, durante qué período y desde qué aspectos. No es elegir países al azar: debes poder buscar información comparable en cada uno.</p><h4>Ejemplo</h4>'+m2FlipCards()))+
card('Selecciona un país y descubre sus características',m2CountryExplorer())+
card('Construye tu delimitación','<p>Ahora define los elementos de tu propio tema. Usa las listas para elegir opciones o escribe una alternativa diferente. Puedes revisar tus elecciones antes de continuar.</p>'+
m2Select('topic','Fenómeno educativo',m2Phenomena,'Selecciona el fenómeno que te interesa')+
m2CountrySelector()+
m2Select('level','Nivel o modalidad educativa',m2Levels,'Selecciona el nivel educativo')+
'<label for="period">Período de los documentos que investigarás</label><input id="period" class="edu-input" type="text" placeholder="Ejemplo: 2016–2026 o 2020–2026"><p class="field-tip">Indica los años de publicación de los documentos que consultarás; no necesariamente el tiempo que dura tu investigación.</p>'+
m2DimensionSelector())+
card('Actividad · ¿Cuál delimitación es más viable?',m2Quiz('delimit','¿Cuál delimitación permite realizar una comparación educativa concreta?',['Estudiar todos los problemas de todos los sistemas educativos del mundo.','Comparar políticas de inclusión en primaria de Argentina, Bolivia y Perú, entre 2016 y 2026, usando dimensiones comunes.','Investigar dificultades escolares sin especificar nivel, países ni documentos.'],1,['La opción es demasiado amplia: no define un fenómeno ni un conjunto manejable de países.','','No precisa qué se estudiará, dónde ni con qué criterios.'],'¡Bien hecho! Identificaste fenómeno, países, nivel, período y dimensiones.'))+
card('Actividad · Elige la mejor pregunta comparativa','<p>Lee con atención: algunas preguntas parecen comparativas, pero no mantienen un mismo criterio entre los países.</p>'+m2Quiz('question','Tu tema es la atención a las dificultades de aprendizaje en primaria de Argentina, Bolivia y Perú, con documentos de 2016–2026. ¿Qué pregunta está mejor formulada?',['¿Por qué Bolivia tiene mejores escuelas que Argentina y Perú?','¿Qué leyes existen en Argentina, qué métodos se usan en Bolivia y qué opinan los docentes en Perú?','¿Qué semejanzas y diferencias presentan las disposiciones curriculares y las estrategias de atención documentadas en los tres países durante 2016–2026?','¿Qué país tiene más dificultades de aprendizaje y cuál es el culpable?'],2,['Da por supuesto que un país es mejor, sin definir criterios ni evidencia.','Usa un aspecto distinto para cada país; así no se pueden comparar los mismos criterios.','','Presupone culpables y plantea una clasificación sin indicadores ni fuentes.'],'¡Excelente! La pregunta aplica las mismas dimensiones a los tres países y delimita el período documental.'))+
action(2);
}
function m2Quiz(id,question,answers,correct,wrong,right){
const value=get('quiz_'+id);
return '<div class="edu-quiz" data-quiz="'+id+'" data-correct="'+correct+'"><p class="edu-question">'+question+'</p>'+answers.map((a,i)=>'<button type="button" class="edu-answer'+(String(i)===value?' chosen':'')+'" data-answer="'+i+'" aria-pressed="'+(String(i)===value)+'">'+escapeHTML(a)+'</button>').join('')+'<p class="edu-feedback" data-feedback="'+id+'" data-result="'+(value===''?'pending':Number(value)===correct?'correct':'incorrect')+'" aria-live="polite">'+(value===''?'Selecciona una respuesta para recibir retroalimentación.':Number(value)===correct?'Correcto. '+right:'Incorrecto. '+wrong[Number(value)])+'</p></div>';
}
function m2SelectedCountries(){return (data.fields.countries||'').split(/[,;\n]+/).map(x=>x.trim()).filter(x=>m2Countries.includes(x))}
function m2SaveCountries(){const selected=[...guide.querySelectorAll('[data-m2-select-country]:checked')].map(x=>x.dataset.m2SelectCountry);data.fields.countries=selected.join(', ');persist();const msg=guide.querySelector('#eduM2CountryCount');if(msg)msg.textContent=selected.length+' de 3 países seleccionados';const sum=guide.querySelector('#eduM2CountrySummary');if(sum)sum.textContent=selected.length?selected.join(' · '):'Selecciona tres países';}
function m2SaveDimensions(){const selected=[...guide.querySelectorAll('[data-m2-dimension]:checked')].map(x=>x.dataset.m2Dimension);const other=guide.querySelector('#eduM2DimensionOther');if(other&&other.value.trim())selected.push(other.value.trim());data.fields.dims=selected.join('; ');persist()}
function m2Init(){
const info=guide.querySelector('#eduM2CountryInfo');if(info)info.innerHTML=m2CountryHTML('Argentina');
for(const id of ['topic','level']){const select=guide.querySelector('#'+id);const other=guide.querySelector('#'+id+'Other');if(!select||!other)continue;const current=data.fields[id]||'';const known=[...select.options].some(o=>o.value===current);select.value=known?current:current?'__other':'';other.hidden=select.value!=='__other';if(!other.hidden)other.value=current}
const period=guide.querySelector('#period');if(period)period.value=data.fields.period||'';
const chosen=m2SelectedCountries();guide.querySelectorAll('[data-m2-select-country]').forEach(el=>{el.checked=chosen.includes(el.dataset.m2SelectCountry)});
const count=guide.querySelector('#eduM2CountryCount');if(count)count.textContent=chosen.length+' de 3 países seleccionados';const sum=guide.querySelector('#eduM2CountrySummary');if(sum)sum.textContent=chosen.length?chosen.join(' · '):'Selecciona tres países';
const dims=(data.fields.dims||'').split(';').map(x=>x.trim()).filter(Boolean);
guide.querySelectorAll('[data-m2-dimension]').forEach(el=>{el.checked=dims.includes(el.dataset.m2Dimension)});
const other=guide.querySelector('#eduM2DimensionOther');if(other)other.value=dims.filter(x=>!m2Dimensions.includes(x)).join('; ');
}
const criterionOptions=['Normativa','Programas','Formación docente','Recursos','Evaluación','Acceso y equidad','Currículo','Contexto'];

const m3Example={
question:'¿Qué semejanzas y diferencias presentan las estrategias de atención a las dificultades de aprendizaje en educación primaria de Argentina, Bolivia y Perú durante 2016–2026?',
general:'Comparar las estrategias de atención a las dificultades de aprendizaje en educación primaria de Argentina, Bolivia y Perú durante 2016–2026, identificando sus semejanzas y diferencias.',
specific:[
'Identificar las orientaciones normativas y curriculares relacionadas con las dificultades de aprendizaje en los tres países.',
'Describir las estrategias de atención documentadas en educación primaria de Argentina, Bolivia y Perú.',
'Contrastar las semejanzas y diferencias entre las estrategias descritas, considerando las condiciones de cada país.'
]};
function m3ExampleCards(){
return '<div class="edu-m3-examples"><div class="edu-m3-example edu-m3-question"><span class="edu-m3-label"><span aria-hidden="true">❔</span> Pregunta de investigación</span><p>'+m3Example.question+'</p></div><div class="edu-m3-example edu-m3-general"><span class="edu-m3-label"><span aria-hidden="true">🎯</span> Objetivo general</span><p>'+m3Example.general+'</p></div><div class="edu-m3-step-intro"><strong>Para lograr el objetivo general, necesitamos objetivos específicos.</strong><p>Cada uno indica una acción concreta que ayuda a responder la pregunta.</p></div><div class="edu-m3-specific-grid">'+m3Example.specific.map((text,i)=>'<div class="edu-m3-example edu-m3-specific"><span class="edu-m3-label"><span class="edu-m3-num">'+(i+1)+'</span> Objetivo específico '+(i+1)+'</span><p>'+text+'</p></div>').join('')+'</div></div>';
}
function m3GuidedDraft(){
const topic=escapeHTML(data.fields.topic||'tu fenómeno educativo');
const countries=escapeHTML(data.fields.countries||'tus tres países');
const level=escapeHTML(data.fields.level||'el nivel seleccionado');
const period=escapeHTML(data.fields.period||'el período seleccionado');
const dims=escapeHTML(data.fields.dims||'las dimensiones seleccionadas');
return card('Ahora construye tus propios objetivos',
'<p>En una investigación comparativa, el <strong>objetivo general</strong> expresa lo que quieres lograr. Comienza con un verbo en infinitivo y relaciona tu fenómeno, los países y el nivel educativo.</p>'+
'<div class="edu-m3-bloom"><h4>Guía breve: taxonomía de Bloom revisada</h4><p>Elige un verbo según lo que realmente vas a hacer. Los niveles orientan, pero un verbo por sí solo no determina la calidad de una investigación.</p><div class="edu-m3-bloom-grid">'+[['Recordar','Identificar'],['Comprender','Explicar'],['Aplicar','Utilizar'],['Analizar','Comparar'],['Evaluar','Valorar'],['Crear','Proponer']].map(x=>'<div><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div>').join('')+'</div><p class="field-tip">Para una investigación comparativa suelen ser útiles <strong>comparar, analizar o examinar</strong>, siempre que correspondan a tu pregunta.</p></div>'+
'<div class="edu-m3-focus-guide"><h4>Antes de redactar, responde mentalmente:</h4><ul><li><strong>¿Qué harás?</strong> ¿Comparar, analizar o examinar?</li><li><strong>¿Qué investigarás?</strong> '+topic+'.</li><li><strong>¿Dónde o entre quiénes?</strong> '+countries+'.</li><li><strong>¿En qué nivel?</strong> '+level+'.</li><li><strong>¿Qué aspectos?</strong> '+dims+'.</li><li><strong>¿En qué período?</strong> '+period+'.</li><li><strong>¿Para qué?</strong> Para identificar y explicar semejanzas y diferencias con evidencias.</li></ul></div>'+
'<label for="general">Redacta aquí tu objetivo general</label><textarea class="edu-input" id="general" rows="4" placeholder="Comparar ... en ... durante ... para ..."></textarea><button type="button" class="edu-ghost" data-m3-suggest="general">Mostrar propuesta editable</button>'+
'<div class="edu-m3-specific-select"><h4>¿Qué objetivos específicos te ayudarían a lograrlo?</h4><p>Selecciona las acciones que realizarás para alcanzar tu objetivo general. Puedes elegir dos o tres. Estos pasos deben contribuir a la comparación.</p><div class="edu-m3-specific-options">'+[['identify','Identificar las normas y orientaciones relacionadas con el fenómeno en los países seleccionados.'],['describe','Describir las estrategias o programas documentados en cada país.'],['compare','Contrastar las semejanzas y diferencias según los criterios elegidos.']].map(x=>'<label class="edu-m3-specific-option"><input type="checkbox" data-m3-specific="'+x[0]+'"><span>'+x[1]+'</span></label>').join('')+'</div></div>'+
'<p class="field-tip">Tus respuestas se guardan automáticamente. La formulación definitiva debe revisarse con el docente.</p>');
}
function moduleThreeExtras(){
return card('Ejemplo práctico','<p>Observa cómo la pregunta se transforma en un objetivo general y en tres pasos para alcanzarlo.</p>'+m3ExampleCards())+
card('¿Cómo se redactan los objetivos?', '<div class="edu-m3-hints"><div><strong>Objetivo general</strong><p>Responde: ¿qué quiero lograr con toda la investigación?</p></div><div><strong>Objetivos específicos</strong><p>Responden: ¿qué acciones concretas necesito realizar para lograrlo?</p></div></div>')+
m3GuidedDraft()+
card('Parte B · Criterios de comparación','<p>Selecciona entre dos y cuatro criterios que puedas investigar en todos los países.</p><div class="edu-criteria">'+criterionOptions.map(x=>'<label class="edu-check"><input type="checkbox" data-criterion="'+x+'" '+(data.extra.criteria.includes(x)?'checked':'')+'><span>'+x+'</span></label>').join('')+'</div>')+
card('Retroalimentación de coherencia','<p>Comprueba si tu objetivo general contiene elementos suficientes, si las acciones específicas contribuyen a lograrlo y si has elegido criterios comunes.</p><button type="button" class="edu-primary" data-m3-review>Revisar mis objetivos y criterios</button><div id="eduM3Review" class="edu-m3-review" role="status" aria-live="polite"><p>Completa tus objetivos y selecciona criterios; después presiona «Revisar».</p></div><p class="field-tip"><strong>Importante:</strong> esta revisión es automática y orientativa. No verifica las fuentes ni puede determinar toda la coherencia metodológica; no sustituye la revisión y orientación del docente.</p>')+
action(3);
}
function m3SpecificOptions(){return {
identify:'Identificar las normas y orientaciones relacionadas con '+(data.fields.topic||'el fenómeno estudiado')+' en '+(data.fields.countries||'los países seleccionados')+'.',
describe:'Describir las estrategias y los programas documentados en '+(data.fields.countries||'los países seleccionados')+'.',
compare:'Contrastar las semejanzas y diferencias entre los países según los criterios seleccionados.'
}}
function m3SpecificKeys(){
return Array.isArray(data.extra.responses.m3SpecificKeys)?data.extra.responses.m3SpecificKeys:[];
}
function m3SyncSpecific(){
const picked=[...guide.querySelectorAll('[data-m3-specific]:checked')].map(el=>el.dataset.m3Specific);
data.extra.responses.m3SpecificKeys=picked;
const options=m3SpecificOptions();const descriptions=picked.map(k=>options[k]);
data.fields.specific1=descriptions[0]||'';
data.fields.specific2=descriptions[1]||'';
data.extra.responses.m3Specific3=descriptions[2]||'';
data.fields.coherence=descriptions.length>=2?'Los objetivos específicos seleccionados aportan pasos para alcanzar el objetivo general.':'';
persist();
}
function m3Init(){
const general=guide.querySelector('#general');if(general)general.value=data.fields.general||'';
const keys=m3SpecificKeys();
guide.querySelectorAll('[data-m3-specific]').forEach(el=>{el.checked=keys.includes(el.dataset.m3Specific)});
const feedback=guide.querySelector('#eduM3Review');if(feedback&&get('m3ReviewViewed'))m3Review();
}
function m3Suggest(kind){
if(kind!=='general')return;
const topic=(data.fields.topic||'el fenómeno educativo').toLowerCase();
const countries=data.fields.countries||'los países seleccionados';
const level=(data.fields.level||'el nivel educativo seleccionado').toLowerCase();
const aspects=(data.fields.dims||'las estrategias educativas').replace(/[;]+/g,', ');
const period=data.fields.period||'el período definido';
const el=guide.querySelector('#general');if(el){
el.value='Comparar '+aspects+' relacionadas con '+topic+' en '+level+' de '+countries+' durante '+period+', para identificar semejanzas y diferencias.';
data.fields.general=el.value;persist();el.focus();
}
}
function m3Normalize(s){
return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.,;:¿?¡!]/g,' ').replace(/\s+/g,' ').trim();
}
function m3Review(){
const area=guide.querySelector('#eduM3Review');if(!area)return;
const text=(data.fields.general||'').trim(),normalized=m3Normalize(text);
const countries=m2SelectedCountries();
const criteria=data.extra.criteria;
const pick=m3SpecificKeys();
const checks=[];
const infinitives=['comparar','analizar','examinar','describir','identificar','contrastar','evaluar','explicar','determinar','caracterizar','establecer','explorar'];
checks.push([infinitives.some(v=>normalized.startsWith(v+' ')),'Empieza con un verbo en infinitivo que indique la acción principal.']);
checks.push([text.split(/\s+/).filter(Boolean).length>=12,'Desarrolla el objetivo con suficiente precisión; evita una frase demasiado breve.']);
checks.push([!data.fields.topic||m3Normalize(text).includes(m3Normalize(data.fields.topic)),'Menciona el fenómeno seleccionado en la delimitación.']);
checks.push([countries.length!==3||countries.every(country=>normalized.includes(m3Normalize(country))),'Incluye los tres países que elegiste para comparar.']);
checks.push([!data.fields.level||normalized.includes(m3Normalize(data.fields.level)),'Precisa el nivel o modalidad educativa que investigarás.']);
checks.push([!data.fields.period||normalized.includes(m3Normalize(data.fields.period)),'Comprueba el período documental.']);
checks.push([pick.length>=2,'Selecciona al menos dos objetivos específicos que ayuden a lograr el general.']);
checks.push([pick.includes('compare'),'Considera una acción de contraste para identificar las semejanzas y diferencias.']);
checks.push([criteria.length>=2&&criteria.length<=4,'Selecciona entre dos y cuatro criterios de comparación.']);
const met=checks.filter(x=>x[0]).length;
area.innerHTML='<h4>Resultado orientativo: '+met+' de '+checks.length+' aspectos identificados</h4><ul>'+checks.map(x=>'<li class="'+(x[0]?'edu-m3-review-good':'edu-m3-review-improve')+'"><span aria-hidden="true">'+(x[0]?'✓':'•')+'</span> '+(x[0]?'Verificado: ':'Por revisar: ')+escapeHTML(x[1])+'</li>').join('')+'</ul><p>La presencia de estos elementos <strong>no garantiza</strong> que los objetivos estén bien formulados. Verifica que las acciones sean viables, que los criterios sean pertinentes y que existan fuentes para cada país. <strong>La revisión docente es imprescindible.</strong></p>';
put('m3ReviewViewed','yes');
}
function match(id,pairs){
const saved=data.extra.responses['match_'+id]||{};
return '<div class="edu-match" data-match="'+id+'">'+pairs.map((p,i)=>'<label>'+p[0]+'<select data-match-item="'+i+'"><option value="">Selecciona un ejemplo</option>'+opts([...pairs.map(x=>x[1])].reverse(),saved[i]||'')+'</select></label>').join('')+'<button type="button" data-match-check="'+id+'" class="edu-ghost">Comprobar relaciones</button><p class="edu-feedback" data-match-feedback="'+id+'" role="status"></p></div>'
}
function order(id,steps){
const saved=data.extra.responses['order_'+id];const arr=Array.isArray(saved)&&saved.length===steps.length?saved:id==='search'?[2,0,4,1,5,3]:steps.map((_,i)=>i);if(id==='search'&&(!Array.isArray(saved)||saved.length!==steps.length))data.extra.responses.orderResult_search='';
return '<div class="edu-order" data-order="'+id+'" data-expected="'+steps.length+'"><p class="field-tip">Ordena los pasos. Puedes arrastrar tarjetas o utilizar las flechas.</p><ol>'+arr.map(idx=>'<li draggable="true" data-order-id="'+idx+'"><span>'+steps[idx]+'</span><div><button type="button" data-move="-1" aria-label="Subir paso">↑</button><button type="button" data-move="1" aria-label="Bajar paso">↓</button></div></li>').join('')+'</ol><button type="button" data-order-check="'+id+'" class="edu-ghost">Comprobar secuencia</button><p class="edu-feedback" data-order-feedback="'+id+'" role="status"></p></div>'
}
const searchSteps=[
'Identificar palabras clave relacionadas con el tema',
'Seleccionar documentos académicos y fuentes oficiales',
'Revisar autoría, fecha y contenido del documento',
'Comprobar que el enlace funciona y conduce al documento original',
'Registrar la referencia y el fragmento útil',
'Redactar la referencia bibliográfica según APA 7.ª edición'
];
const m4Searchers=[
['Google Académico','https://scholar.google.com/','scholar.google.com','Artículos, tesis y publicaciones académicas'],
['SciELO','https://scielo.org/','scielo.org','Revistas científicas de acceso abierto'],
['Redalyc','https://www.redalyc.org/','redalyc.org','Revistas científicas de América Latina'],
['Dialnet','https://dialnet.unirioja.es/','dialnet.unirioja.es','Artículos, tesis y libros académicos'],
['ERIC','https://eric.ed.gov/','eric.ed.gov','Estudios especializados en educación'],
['Elicit','https://elicit.com/','elicit.com','Búsqueda asistida de literatura académica'],
['ResearchRabbit','https://www.researchrabbit.ai/','researchrabbit.ai','Exploración de investigaciones relacionadas'],
['Perplexity','https://www.perplexity.ai/','perplexity.ai','Búsqueda asistida con enlaces a fuentes'],
['UNESCO','https://www.unesco.org/','unesco.org','Documentos e informes institucionales']
];
function m4Links(){
return '<div class="edu-resource-grid edu-m4-search-grid">'+m4Searchers.map(r=>'<a href="'+r[1]+'" target="_blank" rel="noopener noreferrer"><img src="https://www.google.com/s2/favicons?domain='+r[2]+'&sz=128" width="34" height="34" alt="" loading="lazy" onerror="this.hidden=true"><span><strong>'+r[0]+'</strong><small>'+r[3]+'</small></span></a>').join('')+'</div>';
}
function m4Topic(){
const topic=(data.fields.topic||'el fenómeno que elegiste').trim();
const level=(data.fields.level||'el nivel educativo seleccionado').trim();
const countries=(data.fields.countries||'los países seleccionados').trim();
return {topic,level,countries,query:topic+' '+level+' '+countries};
}
function m4Input(key,label,placeholder,rows=2){
return '<label for="edu_'+key+'">'+label+'</label><textarea class="edu-input" id="edu_'+key+'" data-save="'+key+'" rows="'+rows+'" placeholder="'+escapeHTML(placeholder)+'"></textarea>';
}
function moduleFour(){
const topic=m4Topic();
return '<div class="edu-stage-header"><span class="tag">Módulo 4 · Investiga</span><h2>Fuentes y uso responsable de la inteligencia artificial</h2><p>Aprende a encontrar un documento, seleccionar una cita útil, explicar su importancia y redactar su referencia en APA 7.</p></div>'+
card('Antes de buscar',quiz('sources','¿Qué fuente ofrece una base más confiable para conocer una ley educativa?',['Una publicación anónima de una red social','El texto de la ley en un portal oficial','Una respuesta de IA sin referencias'],1,'Consulta siempre la fuente original y verifica su vigencia.'))+
card('Ordena el procedimiento para seleccionar y citar una fuente','<p>Las seis tarjetas aparecen desordenadas. Arrástralas o usa las flechas para establecer la secuencia y presiona <strong>Comprobar secuencia</strong>.</p>'+order('search',searchSteps))+
card('Explora distintas fuentes','<p>Las siguientes páginas sirven para <strong>buscar fuentes académicas y documentos oficiales</strong>. No todos los servicios son repositorios: las herramientas de IA ayudan a localizar investigaciones, pero siempre debes abrir y comprobar el documento original.</p>'+m4Links())+
card('Uso responsable de la inteligencia artificial','<p><strong>La IA puede ayudarte a buscar, organizar información o formular preguntas, pero no debe inventar fuentes ni escribir conclusiones sin evidencias.</strong></p><div class="edu-m4-ai-tips"><div><strong>Úsala para</strong><p>Proponer palabras clave, sugerir dónde buscar, organizar documentos que ya verificaste y aclarar conceptos.</p></div><div><strong>No la utilices para</strong><p>Inventar autores, DOI, citas, páginas, resultados o afirmar que una fuente dice algo sin abrirla.</p></div></div><p><strong>¿Qué es un DOI?</strong> Es un identificador digital permanente que suele utilizarse para localizar artículos y otros documentos académicos. Puede escribirse como <code>https://doi.org/10.xxxx/xxxxx</code>. <strong>No todos los documentos tienen DOI</strong>: si no lo tienen, puedes utilizar la dirección web correspondiente.</p>'+quiz('ai','Una IA te proporciona un DOI que no aparece en la publicación. ¿Qué haces?',['Lo añades porque parece correcto','Compruebas el documento original y descartas el DOI si no es auténtico','Creas un DOI parecido'],1,'Solo se incluyen identificadores y referencias comprobados en las fuentes originales.'))+
card('NotebookLM: organiza y conversa con tus fuentes','<p><strong>NotebookLM</strong> puede ayudarte a organizar documentos que tú has seleccionado, resumirlos y hacer preguntas sobre su contenido. Sus respuestas deben contrastarse con los pasajes originales; no sustituye a un buscador académico ni garantiza que los documentos sean fiables.</p><div class="edu-m4-notebook-links"><a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer">Abrir NotebookLM</a><a href="https://www.youtube.com/watch?v=g9fwgx54dEo" target="_blank" rel="noopener noreferrer">Ver tutorial de NotebookLM en YouTube (español)</a></div>')+
card('Mi primera fuente','<p>Realiza los siguientes pasos con <strong>un documento real</strong> relacionado con tu tema. La guía guarda lo que escribes en este navegador.</p>'+
'<section class="edu-m4-step"><h4><span>1</span> Define las palabras clave</h4><p><strong>Si tu tema de investigación es:</strong></p><div class="edu-m4-topic" id="eduM4Topic">'+escapeHTML(topic.topic)+' · '+escapeHTML(topic.level)+' · '+escapeHTML(topic.countries)+'</div><p>Para buscar, combina el fenómeno, el nivel educativo y uno o más países. Prueba también sinónimos y filtra los resultados por fecha.</p><p class="edu-m4-search-example"><strong>Ejemplo de búsqueda:</strong> <code>'+escapeHTML(topic.query)+'</code></p>'+m4Input('sourceKeywords','Escribe las palabras clave que utilizarás','Ejemplo: dificultades de aprendizaje primaria Bolivia currículo',2)+'</section>'+
'<section class="edu-m4-step"><h4><span>2</span> Explora buscadores académicos</h4><p>Abre uno o varios buscadores. Busca un documento completo y relacionado con tu fenómeno y los criterios seleccionados.</p>'+m4Links()+'</section>'+
'<section class="edu-m4-step"><h4><span>3</span> Selecciona un documento</h4><p>Elige una fuente que hayas abierto. Copia su <strong>DOI o enlace web verificable</strong> y anota los datos que necesitarás para citarla.</p><label for="sourceUrl">DOI o dirección web del documento</label><input class="edu-input" id="sourceUrl" type="text" placeholder="https://doi.org/10.... o https://..."><label for="sourceTitle">Título del documento</label><input class="edu-input" id="sourceTitle" type="text" placeholder="Copia el título tal como aparece en la fuente"><label for="sourceLocator">Página, artículo o apartado donde aparece el fragmento</label><input class="edu-input" id="sourceLocator" type="text" placeholder="Ejemplo: p. 12, art. 5 o sección de resultados"></section>'+
'<section class="edu-m4-step"><h4><span>4</span> Selecciona un fragmento pertinente</h4><p>Lee el documento y elige un fragmento que ayude a responder tu pregunta. <strong>Cópialo fielmente y verifica su ubicación.</strong> Para tu informe, distingue siempre una cita textual de una paráfrasis propia.</p><label for="evidence">Fragmento del documento (cita textual)</label><textarea class="edu-input" id="evidence" rows="4" placeholder="Pega aquí el fragmento exacto, sin modificar sus palabras."></textarea></section>'+
'<section class="edu-m4-step"><h4><span>5</span> Introduce la cita y comenta su aporte</h4><p>Una cita necesita contexto y explicación. Lee las preguntas de cada bloque y redacta con tus propias palabras.</p>'+
'<div class="edu-m4-writing-block"><h5>Preámbulo: presenta la cita</h5><p>¿Quién escribió el documento? ¿De qué trata? ¿Por qué este fragmento es pertinente para tu investigación?</p><label for="preamble">Tu preámbulo</label><textarea class="edu-input" id="preamble" rows="4" placeholder="Introduce la fuente y explica por qué presentarás esta evidencia."></textarea></div>'+
'<div class="edu-m4-writing-block edu-m4-citation-block"><h5>Fragmento seleccionado</h5><p>Este es el texto que elegiste en el paso 4. Confirma que corresponde a la fuente y que anotaste su página o apartado.</p><blockquote id="eduM4Quote" class="edu-m4-quote">Tu fragmento aparecerá aquí cuando lo pegues en el paso 4.</blockquote><small id="eduM4QuoteLocation"></small></div>'+
'<div class="edu-m4-writing-block"><h5>Comentario: explica la cita</h5><p>¿Qué demuestra el fragmento? ¿Qué relación tiene con tu fenómeno o criterio? ¿Qué no podemos concluir solo con esta evidencia?</p><label for="commentary">Tu comentario</label><textarea class="edu-input" id="commentary" rows="4" placeholder="Explica con tus palabras qué aporta el fragmento a la investigación."></textarea></div>'+
'<button type="button" class="edu-primary" data-m4-review>Analizar preámbulo, cita y comentario</button><div id="eduM4Review" class="edu-m4-review" aria-live="polite" role="status"><p>Escribe los tres elementos y selecciona «Analizar» para recibir recomendaciones.</p></div><p class="field-tip">La retroalimentación comprueba señales básicas de claridad, pertinencia y documentación. No puede verificar automáticamente la fidelidad de la cita ni determinar toda su coherencia académica. Contrasta siempre la fuente y consulta al docente.</p></section>'+
'<section class="edu-m4-step"><h4><span>6</span> Redacta la referencia en APA 7.ª edición</h4><p>Usa los datos <strong>reales</strong> del documento. Selecciona el tipo de fuente, completa los campos y genera un borrador editable. Un artículo de revista, un informe y una página web no tienen exactamente el mismo formato.</p><label for="edu_sourceType">Tipo de documento</label><select class="edu-input" id="edu_sourceType" data-save="sourceType"><option value="">Selecciona el tipo</option><option value="article">Artículo de revista científica</option><option value="web">Página web</option><option value="report">Informe institucional</option><option value="law">Ley o norma jurídica (requiere formato especializado)</option></select>'+
m4Input('sourceAuthor','Autor o institución responsable','Ejemplo: Pérez, J. o Ministerio de Educación',2)+
m4Input('sourceYear','Año de publicación','Ejemplo: 2023',1)+
m4Input('sourceJournal','Nombre de la revista o sitio web','Completa según el tipo de documento',1)+
m4Input('sourceVolume','Volumen de la revista (si corresponde)','Ejemplo: 12',1)+
m4Input('sourceIssue','Número de la revista (si corresponde)','Ejemplo: 2',1)+
m4Input('sourcePages','Páginas del artículo (si corresponde)','Ejemplo: 45–60',1)+
m4Input('sourcePublisher','Editorial o institución editora (si corresponde)','Ejemplo: universidad o entidad editora',1)+
'<button type="button" class="edu-ghost" data-m4-apa>Generar borrador de referencia APA 7</button>'+
m4Input('sourceAPA','Revisa y corrige tu referencia bibliográfica','Aquí aparecerá el borrador, que puedes editar.',4)+
'<div id="eduM4APAFeedback" class="edu-m4-apa-feedback" role="status" aria-live="polite"></div>'+
'<p class="field-tip">En APA 7, cuando existe DOI, normalmente se presenta como enlace <code>https://doi.org/...</code>. Verifica autoría, puntuación, cursivas y el formato particular del documento. Para leyes, consulta las orientaciones jurídicas que correspondan.</p><a href="https://apastyle.apa.org/style-grammar-guidelines/references/examples" target="_blank" rel="noopener noreferrer">Consultar ejemplos de referencias APA 7 (sitio oficial)</a></section>')+
action(4);
}
function m4RenderQuote(){
const el=guide.querySelector('#eduM4Quote');if(el)el.textContent=(data.fields.evidence||'').trim()||'Tu fragmento aparecerá aquí cuando lo pegues en el paso 4.';
const loc=guide.querySelector('#eduM4QuoteLocation');if(loc)loc.textContent=(data.fields.sourceLocator||'').trim()?'Localización: '+data.fields.sourceLocator:'Localización todavía no indicada.';
}
function m4NormalizeURL(raw){
const value=String(raw||'').trim().replace(/^doi:\s*/i,'');
const found=value.match(/^(?:https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/\S+)$/i);
if(found)return 'https://doi.org/'+found[1];
if(/^https?:\/\/\S+\.\S+/.test(value))return value;
return '';
}
function m4Review(){
const el=guide.querySelector('#eduM4Review');if(!el)return;
const pre=(data.fields.preamble||'').trim(),quote=(data.fields.evidence||'').trim(),com=(data.fields.commentary||'').trim();
const loc=(data.fields.sourceLocator||'').trim(),link=m4NormalizeURL(data.fields.sourceUrl),topic=(data.fields.topic||'').trim();
const results=[
[pre.split(/\s+/).filter(Boolean).length>=12,'El preámbulo explica quién presenta la evidencia y por qué es relevante.'],
[quote.split(/\s+/).filter(Boolean).length>=6,'Has incorporado un fragmento suficientemente identificable. Comprueba que sea exacto.'],
[com.split(/\s+/).filter(Boolean).length>=15,'El comentario explica con detalle qué aporta la evidencia.'],
[Boolean(loc),'Indicaste la página o el apartado del documento para localizar la cita.'],
[Boolean(link),'Incluiste un DOI o enlace web con un formato reconocible. Debes abrirlo y verificarlo.'],
[Boolean(topic),'Tu tema está delimitado; comprueba que el fragmento realmente se relacione con él.']
];
const num=results.filter(x=>x[0]).length;
const warnings=[
!pre?'Redacta un preámbulo que presente al autor y la pertinencia de la cita.':null,
!quote?'Incorpora un fragmento textual del documento original.':null,
!com?'Escribe un comentario con tu interpretación y su relación con la pregunta comparativa.':null,
pre&&com&&pre.toLowerCase()===com.toLowerCase()?'El preámbulo y el comentario son idénticos: cumplen funciones distintas.':null,
quote&&com&&com.toLowerCase().includes(quote.toLowerCase())?'No copies toda la cita como comentario: interprétala con tus palabras.':null
].filter(Boolean);
el.innerHTML='<h5>Revisión orientativa: '+num+' de '+results.length+' aspectos comprobados</h5><ul>'+results.map(x=>'<li class="'+(x[0]?'edu-m4-ok':'edu-m4-improve')+'">'+(x[0]?'✓ ':'Por revisar: ')+escapeHTML(x[1])+'</li>').join('')+'</ul>'+(warnings.length?'<p><strong>Recomendaciones:</strong> '+warnings.map(x=>escapeHTML(x)).join(' ')+'</p>':'<p>La estructura está suficientemente completa para una revisión humana. Aún debes verificar la fidelidad, el significado y la pertinencia de la cita.</p>')+'<p><strong>Esta comprobación no sustituye al docente ni verifica automáticamente el contenido del documento.</strong></p>';
put('m4ReviewChecked','yes');
}
function m4DraftAPA(){
const type=get('sourceType'),author=get('sourceAuthor').trim(),year=get('sourceYear').trim(),title=(data.fields.sourceTitle||'').trim(),journal=get('sourceJournal').trim(),volume=get('sourceVolume').trim(),issue=get('sourceIssue').trim(),pages=get('sourcePages').trim(),publisher=get('sourcePublisher').trim(),link=m4NormalizeURL(data.fields.sourceUrl);
const info=guide.querySelector('#eduM4APAFeedback');
const missing=[];if(!type)missing.push('tipo de documento');if(!author)missing.push('autor o institución');if(!year)missing.push('año');if(!title)missing.push('título');if(!link)missing.push('DOI o enlace válido');if(type==='article'&&!journal)missing.push('nombre de la revista');
if(type==='law'){if(info)info.textContent='Las normas jurídicas requieren un formato específico según la jurisdicción. Registra el nombre de la ley, número, fecha, fuente oficial y URL; verifica la referencia con el docente. No se generará una cita jurídica potencialmente incorrecta.';return}
if(missing.length){if(info)info.textContent='Faltan datos: '+missing.join(', ')+'. Revisa el documento y complétalos antes de generar el borrador.';return}
let draft=author+' ('+year+'). '+title+'. ';
if(type==='article')draft+=journal+(volume?', '+volume+(issue?'('+issue+')':''):'')+(pages?', '+pages:'')+'. ';
if(type==='web'){if(journal&&journal.toLowerCase()!==author.toLowerCase())draft+=journal+'. ';}
if(type==='report'){if(publisher&&publisher.toLowerCase()!==author.toLowerCase())draft+=publisher+'. ';}
draft+=link;
const area=guide.querySelector('#edu_sourceAPA');if(area){area.value=draft;put('sourceAPA',draft)}
if(info)info.textContent='Borrador generado. Comprueba las cursivas del título o revista, las iniciales, el orden de autores y la puntuación. Las referencias finales deben ajustarse manualmente a APA 7.';
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
function header(n){return ''}
function nextUnlocked(){let n=0;while(n<8&&data.extra.moduleDone[n])n++;return n}
function progressText(){let count=0;for(let i=0;i<=8;i++)if(data.extra.moduleDone[i])count++;return count}
function stageHTML(n){
if(n===0)return welcome();
if(n===1)return '<div class="edu-stage-header"><span class="tag">Módulo 1 · Comprende</span><h2>¿Qué es la investigación comparativa?</h2><p>Una investigación comparativa examina dos o más elementos, como países, usando <strong>los mismos criterios</strong>: políticas educativas, currículo, formación docente, programas de apoyo, recursos o evaluación. No buscamos decir qué país es mejor, sino comprender sus semejanzas y diferencias a partir de evidencias.</p></div>'+moduleOneExtras();
if(n===2)return '<div class="edu-stage-header"><span class="tag">Módulo 2 · Delimita</span><h2>Convierte una idea general en un tema delimitado</h2><p>Elige el fenómeno educativo, tres países, el nivel, el período de los documentos y las dimensiones que deseas comparar.</p></div>'+moduleTwoExtras();
if(n===3)return '<div class="edu-stage-header"><span class="tag">Módulo 3 · Objetivos y criterios</span><h2>De tu pregunta a tus objetivos</h2><p>El objetivo general indica qué quieres lograr. Los objetivos específicos explican los pasos que necesitas seguir para conseguirlo.</p></div>'+moduleThreeExtras();
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
function compactLegacy(copy,n){const card=copy.querySelector('.card');if(!card)return;const start=card.querySelector('.mentor-note');if(!start)return;const children=[...card.children];let stop;if(n===1)stop=null;else if(n===2)stop=children.find(x=>x.classList.contains('country-explorer'));else stop=children.find(x=>x.tagName==='H3'&&x.textContent.includes('Redacta tus objetivos'));if(!stop&&n!==1)return;const d=document.createElement('details');d.className='learning-fold edu-accordion';const summary=document.createElement('summary');summary.textContent='Profundiza: explicación y fundamentos';d.append(summary);card.insertBefore(d,start);let node=start;while(node&&node!==stop){const next=node.nextElementSibling;d.append(node);node=next}}
function mount(n){
active=n;document.querySelectorAll('.sidebar [data-edunav]').forEach(b=>{const selected=Number(b.dataset.edunav)===n;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});const backupBtn=document.querySelector('.sidebar [data-edu-backup]');if(backupBtn)backupBtn.classList.remove('active');
guide.innerHTML=header(n)+'<div class="edu-module-content">'+stageHTML(n)+'</div>';if(n===0){const scene=document.querySelector('#home .guide-scene');const target=guide.querySelector('.edu-stage-header');if(scene&&target)target.append(scene.cloneNode(true))}
if(false){const section=originalStages[n];const target=guide.querySelector('.edu-stage-header');if(section){const copy=section.cloneNode(true);copy.removeAttribute('id');copy.hidden=false;copy.classList.add('edu-legacy');if(n===1){const button=copy.querySelector('[onclick="complete(1)"]');if(button)button.remove();const oldQ=copy.querySelector('#q1');if(oldQ){const oldP=oldQ.previousElementSibling;const oldH=oldP&&oldP.previousElementSibling;if(oldP&&oldP.tagName==='P')oldP.remove();if(oldH&&oldH.tagName==='H3')oldH.remove();oldQ.remove()}const feedback=copy.querySelector('#f1');if(feedback)feedback.remove();}if(n===2){const button=copy.querySelector('[onclick="complete(2)"]');if(button)button.remove();}if(n===3){const button=copy.querySelector('[onclick="complete(3)"]');if(button)button.remove();}compactLegacy(copy,n);target.insertAdjacentElement('afterend',copy);}}

guide.querySelectorAll('[data-save]').forEach(el=>{el.value=get(el.dataset.save)});
if(n===1){const el=guide.querySelector('#need');if(el)el.value=data.fields.need||''}
if(n===2)m2Init();
if(n===3){m3Init()}
if(n===4){['preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator'].forEach(id=>{const el=guide.querySelector('#'+id);if(el)el.value=data.fields[id]||''});m4RenderQuote()}
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
if(n===0&&(!get('studentName').trim()||get('likert')===''))return msg('Escribe tu nombre y selecciona tu nivel de conocimientos previos.',true);
if(n===1&&(!data.fields.need?.trim()||!get('researchPurpose')?.trim()||!get('ownDefinition')?.trim()||get('quiz_comparar')!=='1'||get('matchResult_concepts')!=='correct'||m1Practice.some(q=>get('quiz_'+q.id)!==String(q.answer))))return msg('Completa tu situación educativa, qué quieres investigar, las relaciones y las preguntas de repaso. Revisa las respuestas incorrectas.',true);
if(n===2){const blank=required[2].find(k=>!String(data.fields[k]||'').trim());if(blank)return msg('Completa los campos de tu delimitación: falta '+blank+'.',true);if(m2SelectedCountries().length!==3)return msg('Selecciona exactamente tres países.',true);if(get('quiz_delimit')!=='1'||get('quiz_question')!=='2')return msg('Revisa las dos actividades y sus explicaciones antes de continuar.',true)}
if(n===3){if(!data.fields.general?.trim()||m3SpecificKeys().length<2)return msg('Redacta el objetivo general y selecciona al menos dos objetivos específicos.',true);if(data.extra.criteria.length<2||data.extra.criteria.length>4)return msg('Selecciona de dos a cuatro criterios.',true);if(!get('m3ReviewViewed'))return msg('Realiza la revisión orientativa de tus objetivos antes de continuar.',true)}
if(n===4){const blank=required[4].find(k=>!String(data.fields[k]||'').trim());if(blank)return msg('Completa tu fuente, su localización, el fragmento, el preámbulo y el comentario.',true);if(!m4NormalizeURL(data.fields.sourceUrl))return msg('Introduce un DOI o enlace web con formato válido.',true);if(!get('sourceAPA').trim())return msg('Redacta la referencia bibliográfica en APA 7.',true);if(!get('sourceKeywords').trim())return msg('Escribe las palabras clave de tu búsqueda.',true);if(get('quiz_sources')!=='1'||get('quiz_ai')!=='1'||get('orderResult_search')!=='correct')return msg('Completa las actividades de búsqueda, orden y uso de IA.',true);if(!get('m4ReviewChecked'))return msg('Utiliza la revisión orientativa del preámbulo, cita y comentario.',true);data.extra.sources=data.extra.sources||[];const source={title:data.fields.sourceTitle,url:m4NormalizeURL(data.fields.sourceUrl),locator:data.fields.sourceLocator,idea:data.fields.evidence,note:data.fields.commentary,author:get('sourceAuthor'),year:get('sourceYear'),apa:get('sourceAPA')};const index=data.extra.sources.findIndex(x=>x.url===source.url);if(index>=0)data.extra.sources[index]=source;else data.extra.sources.push(source)}
if(n===5&&(countries().some(c=>!String(data.extra.descriptions[c]||'').trim())||get('orderResult_paragraph')!=='correct'||get('quiz_paraphrase')!=='1'))return msg('Completa la descripción de cada país y las prácticas del párrafo académico.',true);
if(n===6&&(!get('similarities').trim()||!get('differences').trim()||get('quiz_matrix')!=='1'||criteria().some(criterion=>countries().some(country=>!String((data.extra.matrix[criterion]||{})[country]||'').trim()))))return msg('Completa tu matriz por país y criterio, señala semejanzas y diferencias y revisa la práctica.',true);
if(n===7&&(!get('analysis').trim()||!get('limitations').trim()||!get('proposal').trim()||get('quiz_interpret')!=='1'))return msg('Incluye interpretación, limitaciones y propuesta, y revisa la práctica.',true);
if(n===8&&(!get('conclusion').trim()||get('orderResult_report')!=='correct'))return msg('Redacta tus conclusiones y revisa el orden del informe.',true);
if(n>0&&![1,2,3,4].includes(n)&&!get('rubric_'+n))return msg('Selecciona una opción de autoevaluación antes de continuar.',true);data.extra.moduleDone[n]=true;data.completed=Math.max(Number(data.completed)||0,n);persist();const nextBtn=document.querySelector('.sidebar [data-edunav="'+(n+1)+'"]');if(nextBtn)nextBtn.disabled=false;if(n<8){navigate(n+1)}else{msg('¡Ruta completada! Revisa tus respuestas y evidencias antes de presentar el informe.');}
}
function navigate(n){if(!Number.isInteger(n)||n<0||n>8||n>nextUnlocked())return;active=n;document.querySelectorAll('main > section').forEach(s=>{if(s!==guide)s.hidden=true});E('home').hidden=true;guide.hidden=false;mount(n);history.replaceState(null,'','#modulo-'+n);window.scrollTo({top:0,behavior:'instant'});if(typeof setupReveals==='function')requestAnimationFrame(setupReveals);const heading=guide.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}}
function returnToMap(){
  guide.hidden=true;E('home').hidden=true;
  document.querySelectorAll('main > section').forEach(s=>s.hidden=true);
  const site=E('map');site.hidden=false;
  const done=progressText(),pct=Math.round(done/9*100),current=nextUnlocked();
  site.innerHTML='<article class="card edu-route-map edu-island-map"><div class="edu-island-heading"><div><span class="tag">Ruta de investigación · EDU-113</span><h2>Mapa de progreso</h2><p>Visita las islas en orden. El personaje muestra dónde te quedaste y cada módulo se desbloquea al completar el anterior.</p></div><strong class="edu-island-meter">'+pct+'%<small>'+done+' de 9 apartados</small></strong></div><div class="edu-island-track" role="progressbar" aria-label="Progreso del curso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div><div class="edu-island-legend"><span>● Completado</span><span>● Etapa actual</span><span>● Bloqueado</span></div><div class="edu-island-list" id="eduIslandList"></div><div class="edu-island-next" id="eduIslandNext"></div></article>';
  const list=E('eduIslandList'),art=document.querySelector('#home .guide-character svg');
  labels.forEach((title,i)=>{
    const finished=!!data.extra.moduleDone[i],locked=i>current,isNow=!finished&&i===current;
    const stop=document.createElement('div');stop.className='edu-island-stage '+(finished?'done':locked?'locked':'current');
    const button=document.createElement('button');button.type='button';button.className='edu-island-button';button.disabled=locked;
    if(isNow)button.setAttribute('aria-current','step');
    const number=document.createElement('span');number.className='edu-island-number';number.textContent=finished?'✓':String(i);
    const content=document.createElement('span');content.className='edu-island-info';
    const titleEl=document.createElement('strong');titleEl.textContent=(i?'Módulo '+i+' · ':'')+title;
    const description=document.createElement('small');description.textContent=descriptions[i];
    const state=document.createElement('em');state.textContent=finished?'COMPLETADO':locked?'BLOQUEADO':'CONTINÚA AQUÍ';
    content.append(titleEl,description,state);button.append(number,content);
    if(!locked)button.onclick=()=>navigate(i);
    if(isNow&&art){const avatar=document.createElement('span');avatar.className='edu-island-avatar';avatar.setAttribute('aria-hidden','true');avatar.append(art.cloneNode(true));button.append(avatar)}
    stop.append(button);list.append(stop);
  });
  const bottom=E('eduIslandNext');const t=document.createElement('p');t.textContent=done===9?'¡Completaste la ruta! Puedes volver a revisar los módulos.':'Tu siguiente etapa: '+labels[current];bottom.append(t);
  if(done!==9){const b=document.createElement('button');b.type='button';b.textContent='Ir a mi etapa';b.onclick=()=>navigate(current);bottom.append(b)}
  history.replaceState(null,'','#mapa-de-progreso');window.scrollTo(0,0);
}
function matchCheck(id){const root=guide.querySelector('[data-match="'+id+'"]');if(!root)return;const selected=[...root.querySelectorAll('select')].map(x=>x.value);const expected=['Dificultades de lectura','Argentina, Bolivia y Perú','Currículo educativo'];const correct=selected.every((v,i)=>v===expected[i]);const msg=root.querySelector('[data-match-feedback]');msg.textContent=correct?'Correcto. El fenómeno es lo que estudias, los países son las unidades y el currículo es un criterio posible.':'Incorrecto. Recuerda: el fenómeno es la situación estudiada; las unidades son los países; el criterio es el aspecto que revisarás en todos.';msg.dataset.result=correct?'correct':'incorrect';put('matchResult_'+id,correct?'correct':'retry')}
function orderMove(li,offset){const ol=li.parentElement;const list=[...ol.children];const i=list.indexOf(li),j=i+offset;if(j<0||j>=list.length)return;if(offset<0)ol.insertBefore(li,list[j]);else ol.insertBefore(list[j],li);saveOrder(ol.closest('[data-order]'))}
function saveOrder(root){if(!root)return;put('order_'+root.dataset.order,[...root.querySelectorAll('li')].map(el=>Number(el.dataset.orderId)))}
function orderCheck(id){const root=guide.querySelector('[data-order="'+id+'"]');if(!root)return;const arr=[...root.querySelectorAll('li')].map(el=>Number(el.dataset.orderId));const result=arr.every((v,i)=>v===i);root.querySelector('[data-order-feedback]').textContent=result?'Secuencia correcta.':'La secuencia aún no sigue el procedimiento esperado. Revisa los pasos.';put('orderResult_'+id,result?'correct':'retry')}
let drag=null;
guide.addEventListener('dragstart',e=>{const li=e.target.closest('[data-order-id]');if(li){drag=li;e.dataTransfer.effectAllowed='move';}});
guide.addEventListener('dragover',e=>{const li=e.target.closest('[data-order-id]');if(drag&&li&&li!==drag)e.preventDefault()});
guide.addEventListener('drop',e=>{const li=e.target.closest('[data-order-id]');if(drag&&li&&li!==drag){e.preventDefault();li.parentElement.insertBefore(drag,li);saveOrder(li.closest('[data-order]'))}drag=null});
guide.addEventListener('input',e=>{const t=e.target;if(t.id==='edu_m3Question'){data.fields.question=t.value;persist();return}
if(t.dataset.m2Other){data.fields[t.dataset.m2Other]=t.value;persist();return}
if(t.id==='eduM2DimensionOther'){m2SaveDimensions();return}
if(t.dataset.save){put(t.dataset.save,t.value);return}if(t.dataset.countryDescription){data.extra.descriptions[t.dataset.countryDescription]=t.value;persist();return}if(t.dataset.matrixCriterion){data.extra.matrix[t.dataset.matrixCriterion]=data.extra.matrix[t.dataset.matrixCriterion]||{};data.extra.matrix[t.dataset.matrixCriterion][t.dataset.matrixCountry]=t.value;persist();return}if(t.id&&['need','topic','countries','level','period','dims','question','general','specific1','specific2','coherence','preamble','evidence','commentary','sourceTitle','sourceUrl','sourceLocator','sourceIdea','sourceNote'].includes(t.id)){data.fields[t.id]=t.value;persist();if(t.id==='evidence'||t.id==='sourceLocator')m4RenderQuote();if(t.id==='question'){const p=guide.querySelector('#questionMirror');if(p)p.textContent=t.value}}});
guide.addEventListener('change',e=>{const t=e.target;
if(t.dataset.m3Specific){m3SyncSpecific();return}
if(t.dataset.m2SelectCountry){const selected=guide.querySelectorAll('[data-m2-select-country]:checked');if(selected.length>3){t.checked=false;const msg=guide.querySelector('#eduM2CountryCount');if(msg)msg.textContent='Puedes seleccionar exactamente tres países.';return}m2SaveCountries();return}
if(t.dataset.m2Dimension){m2SaveDimensions();return}
if(t.dataset.m2Field){const id=t.dataset.m2Field;const other=guide.querySelector('#'+id+'Other');other.hidden=t.value!=='__other';data.fields[id]=t.value==='__other'?other.value.trim():t.value;persist();if(!other.hidden)other.focus();return}
if(t.dataset.save){put(t.dataset.save,t.value)}if(t.dataset.checkModule){const n=t.dataset.checkModule;data.extra.checks[n]=data.extra.checks[n]||{};data.extra.checks[n][t.dataset.checkIndex]=t.checked;persist()}if(t.dataset.criterion){if(t.checked&&!data.extra.criteria.includes(t.dataset.criterion))data.extra.criteria.push(t.dataset.criterion);if(!t.checked)data.extra.criteria=data.extra.criteria.filter(x=>x!==t.dataset.criterion);persist()}if(t.dataset.matchItem){const root=t.closest('[data-match]');const key='match_'+root.dataset.match;data.extra.responses[key]=data.extra.responses[key]||{};data.extra.responses[key][t.dataset.matchItem]=t.value;persist()}});
guide.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.m4Review!==undefined){m4Review();return}if(t.dataset.m4Apa!==undefined){m4DraftAPA();return}if(t.dataset.m2Flip!==undefined){const flipped=t.classList.toggle('is-flipped');t.setAttribute('aria-pressed',String(flipped));return}if(t.dataset.m3Review!==undefined){m3Review();return}
if(t.dataset.m3Suggest){m3Suggest(t.dataset.m3Suggest);return}
if(t.dataset.m2Country){guide.querySelectorAll('[data-m2-country]').forEach(b=>{const active=b===t;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});const info=guide.querySelector('#eduM2CountryInfo');if(info)info.innerHTML=m2CountryHTML(t.dataset.m2Country);return}
if(t.dataset.stage!==undefined){navigate(Number(t.dataset.stage));return}if(t.dataset.quiz===undefined&&t.dataset.answer!==undefined){const root=t.closest('[data-quiz]'),id=root.dataset.quiz;put('quiz_'+id,t.dataset.answer);root.querySelectorAll('[data-answer]').forEach(btn=>{btn.classList.toggle('chosen',btn===t);btn.setAttribute('aria-pressed',String(btn===t))});const fb=root.querySelector('[data-feedback]');const m2Item=id==='delimit'?{correct:'¡Bien hecho! Identificaste un fenómeno, tres países, nivel, período y dimensiones.',wrong:['La propuesta es demasiado amplia y no delimita países ni criterios.','','No especifica los elementos necesarios para comparar.']}:id==='question'?{correct:'¡Excelente! La pregunta compara las mismas dimensiones en los tres países y define el período.',wrong:['Supone que un país es mejor sin evidencia ni criterios.','Cada país se estudia desde un aspecto diferente; no hay criterios comunes.','','Presupone culpables y no define criterios verificables.']}:null;const m1Item=[...m1Practice,{id:'comparar',q:'',options:[],answer:1,correct:'Compara un mismo fenómeno (apoyo a la lectura) en dos países. Para investigar, aún habría que precisar el nivel y el período.',wrong:['Esta pregunta solo pide definir un concepto. No compara dos casos.','','Esta pregunta es demasiado general: no especifica los casos ni el criterio.']}].find(item=>item.id===id);const right=Number(t.dataset.answer)===Number(root.dataset.correct);fb.dataset.result=right?'correct':'incorrect';fb.textContent=m2Item?(right?'Correcto. '+m2Item.correct:'Incorrecto. '+(m2Item.wrong[Number(t.dataset.answer)]||'Revisa tu respuesta.')):m1Item?(right?'Correcto. '+m1Item.correct:'Incorrecto. '+(m1Item.wrong[Number(t.dataset.answer)]||'Revisa la explicación y vuelve a intentar.')):(right?'Correcto. Puedes continuar.':'Todavía no. Revisa el ejemplo y vuelve a intentarlo.');return}if(t.dataset.phenomenon!==undefined){const item=phenomenaM1[Number(t.dataset.phenomenon)];const field=guide.querySelector('#need');if(item&&field){field.value=item.idea;data.fields.need=field.value;guide.querySelectorAll('[data-phenomenon]').forEach(b=>{const selected=b===t;b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected))});persist();field.focus()}return}if(t.dataset.topic){const f=guide.querySelector('#topic');if(f){f.value=t.dataset.topic;data.fields.topic=t.dataset.topic;persist();f.focus()}return}if(t.id==='eduQuestionDraft'){const f=guide.querySelector('#question');if(f){const q='¿Qué semejanzas y diferencias existen en '+(data.fields.dims||'las estrategias')+' relacionadas con '+(data.fields.topic||'el fenómeno educativo')+' en '+(data.fields.countries||'los países seleccionados')+' durante '+(data.fields.period||'el período definido')+' en '+(data.fields.level||'el nivel seleccionado')+'?';f.value=q;data.fields.question=q;persist();f.focus()}return}if(t.dataset.matchCheck){matchCheck(t.dataset.matchCheck);return}if(t.dataset.orderCheck){orderCheck(t.dataset.orderCheck);return}if(t.dataset.move){orderMove(t.closest('li'),Number(t.dataset.move));return}if(t.dataset.addSource!==undefined){const source={title:data.fields.sourceTitle||'',url:data.fields.sourceUrl||'',locator:data.fields.sourceLocator||'',idea:data.fields.sourceIdea||'',note:data.fields.sourceNote||'',author:get('sourceAuthor'),year:get('sourceYear')};if(!source.title||!source.url||!source.idea||!/^https?:\/\//i.test(source.url)){const p=E('eduSourceBank');p.textContent='Completa título, enlace válido (https://...) e idea útil para guardar la ficha.';return}data.extra.sources=data.extra.sources||[];data.extra.sources.push(source);persist();drawBank();return}if(t.dataset.complete!==undefined){advance(Number(t.dataset.complete));return}if(t.dataset.export!==undefined){exportWord(Number(t.dataset.export));return}});
function changeMainNav(){const side=document.querySelector('.sidebar');if(side){side.querySelectorAll('button,.sidebar-label').forEach(x=>x.remove());const label=document.createElement('span');label.className='sidebar-label';label.textContent='Módulos de aprendizaje';side.append(label);labels.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+'. '+title;b.onclick=()=>{navigate(i);if(matchMedia('(max-width:850px)').matches)setSidebar(false)};b.dataset.edunav=i;b.disabled=i>nextUnlocked();side.append(b)});const divider=document.createElement('span');divider.className='sidebar-label';divider.textContent='Herramientas';side.append(divider);const backup=document.createElement('button');backup.type='button';backup.textContent='Respaldo de mi avance';backup.dataset.eduBackup='true';backup.onclick=()=>{openProgress();if(matchMedia('(max-width:850px)').matches)setSidebar(false)};side.append(backup)}const brand=E('eduRouteBrand');if(brand)brand.onclick=()=>{returnToMap();if(matchMedia('(max-width:850px)').matches)setSidebar(false)};const launch=document.querySelector('#home .cta');if(launch)launch.onclick=()=>navigate(0);}
function openProgress(){const b=document.querySelector('.sidebar [data-edu-backup]');if(b)b.classList.add('active');document.querySelectorAll('.sidebar [data-edunav]').forEach(x=>x.classList.remove('active'));guide.hidden=true;E('home').hidden=true;document.querySelectorAll('main > section').forEach(s=>s.hidden=true);E('progress').hidden=false;const label=E('summary2');if(label)label.textContent=progressText()+' de 9 apartados completados · '+Math.round(progressText()/9*100)+'%';const bar=E('bar2');if(bar)bar.style.width=Math.round(progressText()/9*100)+'%';}
const oldShow=show;
show=function(id){if(id==='home'||id==='map'||id==='progress'){if(id==='map')return returnToMap();if(id==='progress')return openProgress();return navigate(0)}if(/^s[1-8]$/.test(id))return navigate(Number(id.slice(1)));return oldShow(id)};
changeMainNav();
const bar=E('eduSaveNotice')||document.createElement('div');bar.id='eduSaveNotice';bar.className='edu-save-notice';bar.setAttribute('role','status');bar.textContent='Progreso guardado en este navegador';document.body.append(bar);
const past=location.hash.match(/^#modulo-(\d)$/);if(location.hash==='#mapa-de-progreso')returnToMap();else navigate(past?Math.min(nextUnlocked(),Number(past[1])):0);
})();
