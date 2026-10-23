
(() => {
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const HOY = iso(new Date());
const add = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'], M3 = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'], DIA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const fs = s => `${+s.slice(8)} ${M3[+s.slice(5, 7) - 1]}`;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toast = m => { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t.h); t.h = setTimeout(() => t.classList.remove('on'), 2400); };
const lunes = s => { const d = new Date(s + 'T12:00:00'); return add(s, -((d.getDay() + 6) % 7)); };

const PERS = {};
const EQ = () => Object.fromEntries(Object.entries(PERS).filter(([, p]) => !p.ext));
const PROY = [];
const A = [];
let AJ = [];
const buildAJ = () => [...A, ...IND.map(a => ({ ...a, p: '__ind' }))].filter(a => a.aj && a.aj.length && ['Requiere ajustes', 'Necesita revisión'].includes(a.st)).map(a => { const j = a.aj[a.aj.length - 1]; return { id: a.id, t: a.t, para: a.r, sol: j.sol, f: j.f, com: j.com, st: a.st === 'Requiere ajustes' ? 'Pendiente' : 'Enviado a revisión', p: a.p, ini: j.ini, fin: j.fin, n: a.aj.length }; });
// Innovación semanal: [responsable, herramienta, tarea que optimiza, ahorro estimado, estatus, subtareas]
const INN = [];
const S = { yo: null, wk: 0, view: 'ini' };
const av = (k, s = 26) => { const P = PERS[k] || { n: '?', c: '#8A9BA6' }; return `<span class="av" title="${esc(P.n)}" style="width:${s}px;height:${s}px;font-size:${s * .38}px;background:${P.c}">${P.foto ? `<img src="${esc(P.foto)}" alt="" loading="lazy">` : esc(P.n.split(' ').map(x => x[0]).slice(0, 2).join(''))}</span>`; };
const pj = id => PROY.find(p => p.id === id) || { id, n: 'Actividad individual', c: '#C25B76' };
const ptag = id => `<span class="tag pt" style="--c:${pj(id).c}"><i></i>${esc(pj(id).n)}</span>`;
const abierta = a => a.st !== 'Terminado';
const vencida = a => abierta(a) && !['Necesita revisión', 'Requiere ajustes'].includes(a.st) && a.f < HOY;

function renderInicio() {
  AJ = buildAJ();
  const yo = PERS[S.yo], mias = [...A.filter(a => a.r === S.yo), ...IND.filter(a => a.r === S.yo).map(a => ({ ...a, ind: true, p: '__ind', h: a.fH.slice(11, 16), ent: a.st === 'Terminado' ? a.ent : a.area }))];
  const proys = PROY.filter(p => p.est === 'Activo' && p.eq.includes(S.yo));
  const ws = add(lunes(HOY), S.wk * 7), we = add(ws, 6), lunesActual = lunes(HOY), domActual = add(lunesActual, 6);
  const ajs = A.length ? AJ.filter(j => yo.admin ? j.sol === S.yo : j.para === S.yo).sort((x, y) => (x.st === 'Pendiente' ? 0 : 1) - (y.st === 'Pendiente' ? 0 : 1) || x.f.localeCompare(y.f)) : [];
  const inns = INN.filter(n => n.r === S.yo && !['Adoptada', 'Descartada'].includes(n.est));
  const hoy = mias.filter(a => a.f === HOY).sort((x, y) => x.h.localeCompare(y.h));
  const venc = mias.filter(vencida).sort((x, y) => (x.f + x.h).localeCompare(y.f + y.h));
  const semana = mias.filter(a => abierta(a) && a.f >= lunesActual && a.f <= domActual).length;
  const avance = p => { const xs = A.filter(a => a.p === p.id); return xs.length ? Math.round(xs.filter(a => a.st === 'Terminado').length / xs.length * 100) : 0; };
  const d = new Date(), sal = d.getHours() < 12 ? 'Buenos días' : d.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';
  const item0 = (a, vencidaTag) => { const done = a.st === 'Terminado', rev = a.st === 'Necesita revisión';
    return `<div class="it"><button class="chk ${done || rev ? 'on' : ''}" data-a="${a.id}" aria-label="Marcar actividad"></button><div><div class="t ${done ? 'done' : ''}">${esc(a.t)}</div><div class="s">${ptag(a.p)}<span class="tag tp">${esc(a.tipo)}</span>${rev ? '<span class="tag rev">En revisión</span>' : ''}${vencidaTag ? `<span class="tag late">Venció el ${fs(a.f)}</span>` : ''}</div></div><span class="hr">${a.h}</span></div>`; };
  const IC = { b: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.9.7 1.5 1.7 1.5 2.8V17h4v-.3c0-1.1.6-2.1 1.5-2.8A6 6 0 0 0 12 3z"/></svg>', c: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>', s: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>' };
  const ppill = id => `<span class="ppill" style="--c:${pj(id).c}" title="${esc(pj(id).n)}"><i></i><span class="pn">${esc(pj(id).n)}</span></span>`;
  const rw = (a, venc) => { const done = a.st === 'Terminado', rev = a.st === 'Necesita revisión';
    return `<div class="rw"><button class="cb ${done ? 'on' : rev ? 'rv' : ''}" data-a="${a.id}" aria-label="Marcar actividad"></button><div style="min-width:0"><div class="t ${done ? 'done' : ''}">${esc(a.t)}</div><div class="m">${venc ? `<span class="lt">Venció ${fs(a.f)}</span> · ` : ''}<b>${a.h}</b>${a.ent ? ' · ' + esc(a.ent) : ''}${rev ? ' · <span class="rvt">En revisión</span>' : ''}</div></div>${ppill(a.p)}</div>`; };
  const it = (a, venc) => { const done = a.st === 'Terminado', rev = a.st === 'Necesita revisión';
    const tile = venc ? `<div class="tile red"><b>${+a.f.slice(8)}</b><small>${M3[+a.f.slice(5, 7) - 1]}</small></div>` : `<div class="tile"><b>${a.h}</b><small>hrs</small></div>`;
    return `<div class="it">${tile}<div><div class="t ${done ? 'done' : ''}">${esc(a.t)}</div><div class="s">${ptag(a.p)}<span class="tag tp">${esc(a.tipo)}</span>${venc ? `<span class="late">Venció el ${fs(a.f)} · ${a.h}</span>` : ''}${rev ? '<span class="tag rv">En revisión</span>' : ''}</div></div><button class="chk ${done || rev ? 'on' : ''}" data-a="${a.id}" aria-label="Marcar actividad"></button></div>`; };
  pintarCierre();
  document.getElementById('foot').innerHTML = `${av(S.yo, 40)}<div style="min-width:0"><b>${esc(yo.n)}</b><small>${esc(yo.rol)} · ${esc(yo.tipo)}</small></div>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Inicio</h1><span class="date">${DIA[d.getDay()].replace(/^./, c => c.toUpperCase())} ${d.getDate()} de ${MES[d.getMonth()]}, ${d.getFullYear()}</span>
      <div class="acts">
        ${yo.admin ? '<button class="btn" id="inact">Nueva actividad</button><button class="btn dark" id="inpro"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nuevo proyecto</button>' : ''}</div></div>
    <section class="band"><div><small>Innovación &amp; Disrupción · ${esc(yo.rol)}</small><h2>${sal}, ${esc(yo.n.split(' ')[0])}. Esto es lo que tienes en marcha.</h2></div>
      <div class="kp"><div class="kpi"><div class="l"><span>${IC.b}</span>Proyectos activos</div><b>${proys.length}</b><em>donde participas</em></div>
        <div class="kpi"><div class="l"><span>${IC.c}</span>Actividades abiertas</div><b>${mias.filter(abierta).length}</b><em>${venc.length} vencida(s)</em></div>
        <div class="kpi"><div class="l"><span>${IC.s}</span>Entregas</div><b>${semana}</b><em>esta semana</em></div></div></section>
    <div class="row3">
      <section class="feat"><div class="h"><h3>Mis proyectos activos</h3><button class="pl">Ver proyectos</button></div><div class="big">${proys.length}</div>
        ${proys.map(p => { const v = avance(p), ab = A.filter(a => a.p === p.id && a.r === S.yo && abierta(a)).length; return `<div class="fp"><i style="background:${p.c}"></i><span>${esc(p.n)}<small class="mini">${ab} actividad(es) mías · compromiso ${fs(p.comp)}</small></span><b>${v}%</b><div class="fbar"><i style="width:${Math.max(v, 3)}%;background:${p.c}"></i></div></div>`; }).join('') || '<p style="color:#B4C8D4">No participas en proyectos activos.</p>'}</section>
      <section class="card"><div class="ch"><h3>Mis actividades de hoy</h3><span class="badge id r">${hoy.filter(a => a.st !== 'Terminado').length} por cerrar</span></div><span class="hint">${yo.admin ? 'Al marcarla, se cierra' : 'Al marcarla, se envía a revisión'}</span>
        ${hoy.length ? `<div class="rows">${hoy.slice(0, 5).map(a => rw(a, false)).join('')}</div>${hoy.length > 5 ? `<a class="more">Ver las ${hoy.length} actividades de hoy</a>` : ''}` : '<div class="empty">No tienes actividades para hoy.</div>'}</section>

    </div>
    <div class="row2">
      <section class="card" style="border-top:5px solid var(--bad)"><div class="ch"><h3>Actividades vencidas</h3><span class="badge bad r">${venc.length} vencida(s)</span></div><span class="hint">Atiéndelas o pide reprogramarlas</span>
        ${venc.length ? `<div class="rows">${venc.slice(0, 4).map(a => rw(a, true)).join('')}</div>${venc.length > 4 ? `<a class="more">Ver las ${venc.length} vencidas</a>` : ''}` : '<div class="empty">Sin actividades vencidas.</div>'}</section>
      <section class="card adj"><div class="ch"><h3>Requerimientos de ajuste</h3><span class="badge r" style="background:color-mix(in srgb,var(--warn) 15%,transparent);color:color-mix(in srgb,var(--warn) 75%,var(--ink))">${ajs.filter(j => j.st === 'Pendiente').length} pendiente(s)</span></div>
        <span class="hint" style="text-align:left">${yo.admin ? 'Ajustes que solicitaste después de revisar; da seguimiento a que se atiendan.' : 'Retroalimentación de tu supervisión: corrige y envía de nuevo a revisión.'}</span>
        ${ajs.length ? ajs.slice(0, 3).map(j => `<div class="aj"><div class="aj-h"><div class="t">${esc(j.t)}</div>${ppill(j.p)}</div>
          <div class="aj-q"><b>${yo.admin ? `Solicitaste a ${esc(PERS[j.para].n)}` : `${esc(PERS[j.sol].n)} · ${esc(PERS[j.sol].rol)}`} · ${fs(j.f)}</b>${esc(j.com)}</div>
          <div class="aj-f"><span class="st ${j.st === 'Pendiente' ? 'p' : 'r'}">${j.st}</span><span>Ajuste ${j.n} · ${j.ini ? `iniciado ${fs(j.ini.slice(0, 10))}` : 'sin iniciar'}</span>
          ${yo.admin ? '' : j.st === 'Pendiente' ? `<button class="btn2" data-ajv="${j.id}">${j.ini ? 'Registrar entrega del ajuste' : 'Registrar inicio del ajuste'}</button>` : '<span class="btn2 ok">Enviado a revisión</span>'}</div></div>`).join('') + (ajs.length > 3 ? `<a class="more">Ver los ${ajs.length} ajustes</a>` : '') : '<div class="empty">Sin ajustes pendientes.</div>'}</section>

    </div>
<section class="card inn-card"><div class="ch"><h3><span class="star"><svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg></span>Innovación</h3><span class="est r">Semana del ${fs(lunes(HOY))}</span></div>
        <span class="hint" style="text-align:left">Cada lunes propones una herramienta o idea para optimizar tus tareas. <a class="golink" id="goinn">Ir a Innovación</a></span>
        <div class="innlist">${inns.map(n => { const hechos = n.sub.filter(x => x.d).length, pct = Math.round(hechos / n.sub.length * 100); return `<div class="inn"><div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:1;min-width:0"><div class="t">${esc(n.n)}</div><div class="m">${yo.admin && n.r !== S.yo ? esc(PERS[n.r].n) + ' · ' : ''}Optimiza: ${esc(n.tarea)} · Ahorro estimado: ${n.ahorroE} h por semana</div></div><span class="est">${esc(n.est)}</span></div>
          <div class="gb"><i style="width:${Math.max(pct, 3)}%"></i></div><div class="pr"><span>${hechos} de ${n.sub.length} subtareas</span><b>${pct}%</b></div>
          ${n.r === S.yo ? `<details class="sts" ${S.open && S.open[n.id] ? 'open' : ''} data-det="${n.id}"><summary>Subtareas</summary>${n.sub.map((x, k) => `<label><input type="checkbox" data-sub="${n.id}:${k}" ${x.d ? 'checked' : ''}><span class="${x.d ? 'done' : ''}">${esc(x.x)}</span></label>`).join('')}</details>` : ''}</div>`; }).join('')}</div>${inns.length ? '' : '<div class="empty">Aún no registras tu innovación de la semana.</div>'}</section>
    <section class="card"><div class="ch"><h3>Calendario de la semana</h3><span class="sub">${fs(ws)} – ${fs(we)}</span><div class="wk r"><button class="ib" id="wp" aria-label="Semana anterior">‹</button><button class="pill ${S.wk ? '' : 'on'}" id="wt">Esta semana</button><button class="ib" id="wn" aria-label="Semana siguiente">›</button></div></div>
      <div class="week">${Array.from({ length: 7 }, (_, i) => add(ws, i)).map(f => { const xs = mias.filter(a => a.f === f).sort((x, y) => x.h.localeCompare(y.h)), dd = new Date(f + 'T12:00:00');
        return `<div class="day ${f === HOY ? 'hoy' : ''}"><div class="dh"><span>${DIA[dd.getDay()].slice(0, 3)}</span><b>${dd.getDate()}</b>${f === HOY ? '<em>HOY</em>' : ''}</div>${xs.slice(0, 3).map(a => `<div class="ev ${a.st === 'Terminado' ? 'done' : ''} ${vencida(a) ? 'lt' : ''}" style="--c:${vencida(a) ? 'var(--bad)' : pj(a.p).c}"><b>${esc(a.t)}</b><small>${a.h}${a.ent ? ' · ' + esc(a.ent) : ''}</small></div>`).join('') || '<div class="dempty">Sin actividades</div>'}${xs.length > 3 ? `<small class="sub" style="text-align:center">+${xs.length - 3} más</small>` : ''}</div>`; }).join('')}</div></section>
    <p class="note">Maqueta con datos de ejemplo. Usa "Ver como" para revisar el Inicio de cada persona. Los botones de proyecto y "Usuarios y permisos" solo aparecen para administradoras.</p>`;
  document.querySelectorAll('[data-ajv]').forEach(b => b.onclick = () => IND.some(x => x.id === b.dataset.ajv) ? indDetalle(b.dataset.ajv) : actividad(b.dataset.ajv));
  document.querySelectorAll('.feat .pl').forEach(b => b.onclick = () => { S.view = 'proy'; render(); });
  if (document.getElementById('goinn')) document.getElementById('goinn').onclick = () => { S.view = 'inn'; render(); };
  document.querySelectorAll('[data-det]').forEach(d => d.ontoggle = () => { S.open = S.open || {}; S.open[d.dataset.det] = d.open; });
  document.querySelectorAll('[data-sub]').forEach(c => c.onchange = () => { const [id, k] = c.dataset.sub.split(':'); const n = INN.find(x => x.id === id); n.sub[+k].d = c.checked; if (n.est === 'Propuesta') n.est = 'En prueba'; if (n.sub.every(x => x.d)) { n.est = 'Por retroalimentar'; toast('Completaste las subtareas: retroalimenta la herramienta en Innovación.'); } else if (n.est === 'Por retroalimentar') n.est = 'En prueba'; render(); });
  (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; S.wk = 0; render(); };
  document.getElementById('wp').onclick = () => { S.wk--; render(); }; document.getElementById('wn').onclick = () => { S.wk++; render(); }; document.getElementById('wt').onclick = () => { S.wk = 0; render(); };
  if (document.getElementById('inpro')) document.getElementById('inpro').onclick = () => proyectoForm();
  if (document.getElementById('inact')) document.getElementById('inact').onclick = () => elegirDestino();
  document.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
    if (IND.some(x => x.id === b.dataset.a)) { indDetalle(b.dataset.a); return; }
    const a = A.find(x => x.id === b.dataset.a);
    if (a.st === 'Requiere ajustes') { toast('Esta actividad tiene ajustes pendientes: atiéndelos en Requerimientos de ajuste.'); return; }
    const puedeCerrar = PERS[S.yo].admin && (a.sup === S.yo || a.r === S.yo);
    if (puedeCerrar) { a.st = a.st === 'Terminado' ? 'Pendiente' : 'Terminado'; a.fdone = a.st === 'Terminado' ? HOY : null; toast(a.st === 'Terminado' ? 'Actividad cerrada' : 'Actividad reabierta'); }
    else { a.st = a.st === 'Necesita revisión' ? 'En progreso' : 'Necesita revisión'; toast(a.st === 'Necesita revisión' ? `Enviada a revisión de ${PERS[a.sup].n}.` : 'Revisión cancelada'); }
    guardar(() => DB.estado('actividades', a.id, a.st));
    render();
  });
}

/* =====================================================================
   PROYECTOS
   ===================================================================== */
const avance = p => { const xs = A.filter(a => a.p === p.id); return xs.length ? Math.round(xs.filter(a => a.st === 'Terminado').length / xs.length * 100) : 0; };
const TIPOS = ['Investigación', 'Implementación', 'Automatización', 'Desarrollo de Recursos'];
const INSTS = ['Exponencial', 'Exponencial B2B', 'IBERO', 'UDLAP', 'IADA', 'UVM B2C', 'UVM B2C Carrusel', 'UVM B2B'];
const AREAS = ['Dirección General', 'Comercial B2B', 'Comercial B2C', 'Académico', 'Marketing', 'Chief of Staff'];
const COLS = [['Pendiente', '#8A9BA6'], ['En progreso', '#D99A12'], ['Necesita revisión', '#3C74D6'], ['Requiere ajustes', '#E86A17'], ['Terminado', '#2E9E62']];
const PAL = ['#E86A17', '#8C2341', '#5145CD', '#D99A12', '#2E9E62', '#D94F86', '#3C74D6', '#1F2A30'];
const FP = { tab: 'Activo', tipo: '', inst: '', area: '', mes: '' };
const mesL = f => `${MES[+f.slice(5, 7) - 1].replace(/^./, c => c.toUpperCase())} ${f.slice(0, 4)}`;
const ultimoAj = a => a.aj && a.aj.length ? a.aj[a.aj.length - 1] : null;
const nAj = a => a.aj ? a.aj.length : 0;
const fdt = s => s ? `${fs(s.slice(0, 10))} · ${s.slice(11, 16)}` : '—';
const visibles = () => PERS[S.yo].admin ? PROY : PERS[S.yo].ext ? proysArea(S.yo) : PROY.filter(p => p.eq.includes(S.yo));
const notifica = (k, msg) => toast(`Notificación enviada a ${PERS[k].n}: ${msg}`);

function openSheet(html, wide) { const sh = document.getElementById('sheet'); sh.innerHTML = html; sh.classList.toggle('wide', !!wide); sh.classList.add('on'); document.getElementById('scrim').classList.add('on'); sh.scrollTop = 0; sh.querySelectorAll('[data-close]').forEach(b => b.onclick = closeSheet); }
function closeSheet() { document.getElementById('sheet').classList.remove('on'); document.getElementById('scrim').classList.remove('on'); }
document.getElementById('scrim').onclick = closeSheet;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
const X = '<button class="x" data-close aria-label="Cerrar">✕</button>';

function renderProy() {
  const yo = PERS[S.yo], base = visibles();
  const meses = [...new Set(base.map(p => p.fsol.slice(0, 7)))].sort().reverse();
  const list = base.filter(p => p.est === FP.tab && (!FP.tipo || p.tipo === FP.tipo) && (!FP.inst || p.inst === FP.inst) && (!FP.area || p.area === FP.area) && (!FP.mes || p.fsol.slice(0, 7) === FP.mes)).sort((a, b) => a.comp.localeCompare(b.comp));
  const sel = (id, label, val, opts) => `<select class="fsel" id="${id}"><option value="">${label}: todos</option>${opts.map(o => `<option value="${esc(o[0])}" ${val === o[0] ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>${yo.ext ? 'Mis proyectos' : 'Proyectos'}</h1><span class="date">${base.length} proyecto(s)${yo.admin ? '' : yo.ext ? ` del área ${esc(yo.area)}` : ' en los que participas'}</span>
      <div class="acts">
        ${yo.admin ? '<button class="btn dark" id="pnew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nuevo proyecto</button>' : ''}</div></div>
    <div class="tools"><div class="seg" id="ptab">${['Activo', 'Terminado'].map(t => `<button data-t="${t}" class="${FP.tab === t ? 'on' : ''}">${t === 'Activo' ? 'Activos' : 'Terminados'} · ${base.filter(p => p.est === t).length}</button>`).join('')}</div>
      ${sel('ftipo', 'Tipo', FP.tipo, TIPOS.map(x => [x, x]))}${sel('finst', 'Institución', FP.inst, INSTS.map(x => [x, x]))}${sel('farea', 'Área', FP.area, AREAS.map(x => [x, x]))}${sel('fmes', 'Mes de solicitud', FP.mes, meses.map(m => [m, mesL(m + '-01')]))}</div>
    ${list.length ? `<div class="pgal">${list.map(p => { const v = avance(p), xs = A.filter(a => a.p === p.id), aj = xs.filter(a => a.st === 'Requiere ajustes').length;
      return `<button class="pcard" data-pj="${p.id}"><div class="pcov" style="--c:${p.c}"><span class="chip">${esc(p.tipo)}</span>${aj ? `<span class="chip warn">${aj} con ajustes</span>` : ''}<span class="pavs">${p.eq.map(k => av(k, 26)).join('')}</span></div>
        <div class="pbody"><div class="pt2">${esc(p.n)}</div><div class="pinst">${esc(p.inst)}</div>
          <div class="pgrid"><div><small>Área solicitante</small><b>${esc(p.area)}</b></div><div><small>Solicitud</small><b>${fs(p.fsol)}</b></div><div><small>Compromiso</small><b>${fs(p.comp)}</b></div></div>
          <div class="pfoot"><span>${xs.filter(a => a.st === 'Terminado').length} de ${xs.length} actividades</span><b>${v}%</b></div><div class="pbar"><i style="width:${Math.max(v, 2)}%;background:${p.c}"></i></div></div></button>`; }).join('')}</div>`
      : `<div class="empty">${base.length ? 'No hay proyectos con estos filtros.' : 'Aún no participas en proyectos.'}</div>`}
    <p class="note">${PERS[S.yo].ext ? `Ves los proyectos donde participa el área ${esc(PERS[S.yo].area)}, con el mismo avance que ve el equipo. La revisión de entregables se hace desde "Por revisar" o desde la ficha del proyecto.` : ''}</p><p class="note" style="${PERS[S.yo].ext ? 'display:none' : ''}">Maqueta con datos de ejemplo. Los usuarios solo ven los proyectos en los que participan; crear, editar y terminar proyectos es exclusivo de administradoras.</p>`;
  (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  document.querySelectorAll('#ptab button').forEach(b => b.onclick = () => { FP.tab = b.dataset.t; render(); });
  [['ftipo', 'tipo'], ['finst', 'inst'], ['farea', 'area'], ['fmes', 'mes']].forEach(([id, k]) => document.getElementById(id).onchange = e => { FP[k] = e.target.value; render(); });
  document.querySelectorAll('[data-pj]').forEach(b => b.onclick = () => proyecto(b.dataset.pj));
  if (document.getElementById('pnew')) document.getElementById('pnew').onclick = () => proyectoForm();
}

function proyectoForm(p) {
  const e = p ? { ...p, eq: [...p.eq] } : { n: '', tipo: TIPOS[0], inst: INSTS[0], area: AREAS[0], fsol: HOY, comp: add(HOY, 30), eq: [S.yo], c: PAL[PROY.length % PAL.length] };
  openSheet(`<div class="sh-h"><h2>${p ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>${X}</div>
    <div class="fg"><label class="f full"><span>Proyecto</span><input class="in" id="fn" value="${esc(e.n)}" placeholder="Nombre del proyecto"></label>
      <label class="f"><span>Tipo de proyecto</span><select class="in" id="ft">${TIPOS.map(x => `<option ${e.tipo === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="f"><span>Institución</span><select class="in" id="fi">${INSTS.map(x => `<option ${e.inst === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="f full"><span>Área solicitante</span><select class="in" id="fa">${AREAS.map(x => `<option ${e.area === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="f"><span>Fecha de solicitud</span><input class="in" type="date" id="fs" value="${e.fsol}"></label>
      <label class="f"><span>Fecha compromiso</span><input class="in" type="date" id="fc" value="${e.comp}"></label>
      <div class="f full"><span>Equipo involucrado</span><div class="opts" id="feq">${Object.entries(EQ()).map(([k, x]) => `<button type="button" class="opt ${e.eq.includes(k) ? 'on' : ''}" data-k="${k}">${x.n}</button>`).join('')}</div></div>
      <div class="f full"><span>Foto del proyecto</span><div class="upl"><div class="upl-p"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-8 7"/></svg></div><button type="button" class="btn">Subir foto</button><span class="sub">JPG o PNG. Se adapta sola al escritorio y al celular.</span></div></div>
      <div class="f full"><span>Color</span><div class="sws">${PAL.map(c => `<button type="button" class="sw ${e.c === c ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div></div></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="fok">${p ? 'Guardar cambios' : 'Crear proyecto'}</button></div>`);
  document.querySelectorAll('#feq .opt').forEach(b => b.onclick = () => b.classList.toggle('on'));
  document.querySelectorAll('.sw').forEach(b => b.onclick = () => { e.c = b.dataset.c; document.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
  document.getElementById('fok').onclick = () => {
    const n = document.getElementById('fn').value.trim(); if (!n) { toast('Escribe el nombre del proyecto.'); return; }
    const eq = [...document.querySelectorAll('#feq .opt.on')].map(b => b.dataset.k); if (!eq.length) { toast('Selecciona al menos a una persona.'); return; }
    const row = { n, tipo: document.getElementById('ft').value, inst: document.getElementById('fi').value, area: document.getElementById('fa').value, fsol: document.getElementById('fs').value, comp: document.getElementById('fc').value, eq, c: e.c };
    let it = p; if (p) Object.assign(p, row); else { it = { id: uid(), est: 'Activo', ...row }; PROY.push(it); }
    guardar(() => DB.proyecto(it, !p), p ? 'Proyecto actualizado' : 'Proyecto creado'); closeSheet(); render(); proyecto(it.id);
  };
}

function gantt(p, xs) {
  if (!xs.length) return '<div class="empty">Agrega actividades para ver el cronograma.</div>';
  const segs = a => (a.aj || []).map(j => [j.f, (j.fin || j.ini && a.st === 'Requiere ajustes' && HOY || (a.st === 'Requiere ajustes' ? HOY : j.f)).slice(0, 10)]);
  const ini = xs.map(a => a.ini).sort()[0], end = [p.comp, HOY, ...xs.map(a => a.f), ...xs.flatMap(a => segs(a).map(s => s[1]))].sort().pop();
  const span = (new Date(end) - new Date(ini)) / 864e5 + 1, pos = f => ((new Date(f) - new Date(ini)) / 864e5) / span * 100, w = (a, b) => Math.max(1.2, ((new Date(b) - new Date(a)) / 864e5 + 1) / span * 100);
  return `<div class="gnt">${[...xs].sort((a, b) => a.ini.localeCompare(b.ini)).map(a => `<div class="gr"><div class="gl">${av(a.r, 22)}<div style="min-width:0"><b>${esc(a.t)}</b><small>${fs(a.ini)} – ${fs(a.f)}${nAj(a) ? ` · ${nAj(a)} ajuste${nAj(a) > 1 ? 's' : ''}` : ''}</small></div></div>
      <div class="gtr"><i class="gb ${a.st === 'Terminado' ? '' : 'soft'}" style="left:${pos(a.ini)}%;width:${w(a.ini, a.f)}%;--c:${p.c}"></i>${segs(a).map(([a0, a1]) => `<i class="gx" style="left:${pos(a0)}%;width:${w(a0, a1)}%"></i>`).join('')}
      ${HOY >= ini && HOY <= end ? `<b class="gtoday" style="left:${pos(HOY)}%"></b>` : ''}<b class="gcomp" style="left:${pos(p.comp)}%"></b></div></div>`).join('')}
    <div class="gleg"><span><i class="lg1" style="--c:${p.c}"></i>Planeado</span><span><i class="lg2"></i>Tiempo extra por ajustes</span><span><i class="lg3"></i>Hoy</span><span><i class="lg4"></i>Compromiso</span></div></div>`;
}

function proyecto(id) {
  const p = PROY.find(x => x.id === id); if (!p) return;
  const yo = PERS[S.yo], xs = A.filter(a => a.p === id), v = avance(p), totAj = xs.reduce((n, a) => n + nAj(a), 0);
  const card = a => { const u = ultimoAj(a), mia = a.sup === S.yo && a.st === 'Necesita revisión';
    return `<button class="kc ${a.st === 'Requiere ajustes' ? 'prio' : ''} ${mia ? 'rev' : ''}" data-ver="${a.id}"><div class="kc-h">${av(a.r, 22)}<span>${esc(PERS[a.r].n)}</span><span class="kd ${a.st !== 'Terminado' && a.f < HOY ? 'late' : ''}">${fs(a.f)} · ${a.h}</span></div>
      <div class="kt">${esc(a.t)}</div>${a.val ? `<div class="kval">${a.ext ? EXC[extEst(a)][1] : 'Validación del área'}</div>` : ''}<div class="km">Supervisa ${esc(PERS[a.sup].n)}${nAj(a) ? ` · <b class="kn">${nAj(a)} ajuste${nAj(a) > 1 ? 's' : ''}</b>` : ''}</div>
      ${a.st === 'Requiere ajustes' && u ? `<div class="kaj"><b>Prioridad · ajuste ${nAj(a)}</b>${esc(u.com)}<small>${u.ini ? `Inicio ${fdt(u.ini)}` : 'Sin iniciar'}${u.fin ? ` · entrega ${fdt(u.fin)}` : ''}</small></div>` : ''}
      ${mia ? '<div class="krev">Te toca revisar</div>' : ''}</button>`; };
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.tipo)}</span><span class="chip">${esc(p.inst)}</span><span class="chip ${p.est === 'Activo' ? 'id' : 'ok'}">${p.est}</span>${p.est === 'Terminado' && yo.admin ? `<span class="vchip ${p.imp && p.imp.final ? 'ok' : ''}">${p.imp && p.imp.final ? 'Impacto validado' : 'Impacto por validar'}</span>` : ''}${X}</div>
    <div class="ban" style="--c:${p.c}"></div>
    <h2 class="ptitle">${esc(p.n)}</h2>
    <div class="dl"><div><small>Área solicitante</small><b>${esc(p.area)}</b></div><div><small>Fecha de solicitud</small><b>${fs(p.fsol)}</b></div><div><small>Fecha compromiso</small><b>${fs(p.comp)}</b></div><div><small>Ajustes solicitados</small><b>${totAj}</b></div></div>
    <div class="adv"><b>${v}%</b><div><div class="pbar"><i style="width:${Math.max(v, 2)}%;background:${p.c}"></i></div><small>${xs.filter(a => a.st === 'Terminado').length} de ${xs.length} actividades terminadas</small></div></div>
    <h3 class="sh3">Equipo involucrado</h3><div class="people">${p.eq.map(k => { const ab = xs.filter(a => a.r === k && a.st !== 'Terminado').length, aj = xs.filter(a => a.r === k).reduce((n, a) => n + nAj(a), 0); return `<div class="person">${av(k, 32)}<div><b>${esc(PERS[k].n)}</b><small>${esc(PERS[k].rol)} · ${ab} abierta(s)${aj ? ` · <span class="kn">${aj} ajuste${aj > 1 ? 's' : ''} recibido${aj > 1 ? 's' : ''}</span>` : ''}</small></div></div>`; }).join('')}</div>
    ${esExt(S.yo) ? extBloque(p) : ''}
    <div class="sh3 row"><h3 class="sh3" style="margin:0">Cronograma general</h3><span class="sub">La línea marca hoy; la punteada, el compromiso</span></div>${gantt(p, xs)}
    <div class="sh3 row"><h3 class="sh3" style="margin:0">Actividades</h3><span class="sub">${esExt(S.yo) ? 'Avance del equipo por actividad. Abre una actividad para ver su detalle.' : 'Abre una actividad para actualizar su estatus, revisarla o registrar ajustes.'}</span>${yo.admin ? '<button class="btn dark sm" id="anew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nueva actividad</button>' : ''}</div>
    <div class="board">${COLS.map(([k, c]) => { const ys = xs.filter(a => a.st === k); return `<div class="bc ${k === 'Requiere ajustes' ? 'adjcol' : ''}" style="--c:${c}"><div class="bh"><i></i>${k}<span>${ys.length}</span></div>${ys.map(card).join('') || '<div class="bempty">Sin actividades</div>'}</div>`; }).join('')}</div>
    ${yo.admin ? `<div class="sh-f"><button class="btn" id="pedit">Editar proyecto</button><button class="btn dark" id="pend">${p.est === 'Activo' ? 'Marcar como terminado' : 'Reactivar proyecto'}</button></div>` : ''}`, true);
  document.getElementById('sheet').querySelectorAll('[data-ver]').forEach(b => b.onclick = () => actividad(b.dataset.ver));
  document.querySelectorAll('#sheet [data-acr]').forEach(b => b.onclick = () => acRevisar(b.dataset.acr));
  document.querySelectorAll('#sheet [data-acf]').forEach(b => b.onclick = () => acRetro(b.dataset.acf));
  if (document.getElementById('pedit')) document.getElementById('pedit').onclick = () => proyectoForm(p);
  if (document.getElementById('pend')) document.getElementById('pend').onclick = () => { if (p.est === 'Activo' && !confirm('¿Marcar el proyecto como terminado? Pasará a Impacto validado para registrar la retroalimentación.')) return; p.est = p.est === 'Activo' ? 'Terminado' : 'Activo'; if (p.est === 'Terminado') { p.fter = HOY; } delete p.imp; guardar(() => DB.estadoProyecto(p)); toast(p.est === 'Terminado' ? 'Proyecto terminado. Ya aparece en Impacto validado para registrar la retroalimentación.' : 'Proyecto reactivado'); render(); proyecto(id); };
  if (document.getElementById('anew')) document.getElementById('anew').onclick = () => actividadForm(p);
}

const campos = (a, editable, p) => `
  <label class="f"><span>Responsable</span>${editable && PERS[S.yo].admin ? `<select class="in" id="xr">${p.eq.map(k => `<option value="${k}" ${a.r === k ? 'selected' : ''}>${PERS[k].n}</option>`).join('')}</select>` : `<div class="ro">${av(a.r, 22)} ${esc(PERS[a.r].n)}</div>`}</label>
  <label class="f"><span>Supervisor de la actividad</span><select class="in" id="xs" ${editable ? '' : 'disabled'}>${Object.entries(EQ()).map(([k, x]) => `<option value="${k}" ${a.sup === k ? 'selected' : ''}>${x.n} · ${x.rol}</option>`).join('')}</select></label>
  <label class="f"><span>Inicio</span><input class="in" type="date" id="xi" value="${a.ini}" ${editable ? '' : 'disabled'}></label>
  <label class="f"><span>Fecha de entrega</span><input class="in" type="date" id="xf" value="${a.f}" ${editable ? '' : 'disabled'}></label>
  <label class="f"><span>Hora de entrega</span><input class="in" type="time" id="xh" value="${a.h}" ${editable ? '' : 'disabled'}></label>
  <label class="f"><span>Entregable</span><input class="in" id="xe" value="${esc(a.ent || '')}" ${editable ? '' : 'disabled'}></label>
  <label class="f full"><span>¿Dónde está el entregable?</span><input class="in" id="xu" value="${esc(a.ubi || '')}" placeholder="Liga o ruta: Drive, Dropbox, plataforma" ${editable ? '' : 'disabled'}></label>
  <label class="f full"><span>Notas</span><textarea class="in" id="xn" rows="3" ${editable ? '' : 'disabled'}>${esc(a.notas || '')}</textarea></label>
  <label class="f full chk2"><input type="checkbox" id="xv" ${a.val ? 'checked' : ''} ${editable && PERS[S.yo].admin ? '' : 'disabled'}><span>Requiere validación del área solicitante (${esc(p.area)})${a.ext ? ` · estado: ${EXC[extEst(a)][1].toLowerCase()}` : ''}</span></label>`;
const leer = a => { const g = id => document.getElementById(id); if (g('xr')) a.r = g('xr').value; a.sup = g('xs').value; a.ini = g('xi').value; a.f = g('xf').value; a.h = g('xh').value; a.ent = g('xe').value.trim(); a.ubi = g('xu').value.trim(); a.notas = g('xn').value.trim(); if (g('xv')) a.val = g('xv').checked; };

function actividad(id) {
  const a = A.find(x => x.id === id), p = pj(a.p), yo = PERS[S.yo];
  const esResp = a.r === S.yo, esSup = a.sup === S.yo, edit = (esResp || yo.admin) && a.st !== 'Terminado' && a.st !== 'Requiere ajustes';
  const u = ultimoAj(a);
  let bloque = '';
  if (a.st === 'Necesita revisión' && esSup) bloque = `<section class="revbox"><h3>Revisión</h3><p class="sub">${esc(PERS[a.r].n)} envió esta actividad a revisión${nAj(a) ? ` (vuelta ${nAj(a) + 1})` : ''}. Revisa el entregable y decide.</p>
      <details class="drop" id="ajd"><summary>Requiere ajustes</summary><label class="f full"><span>Ajustes necesarios</span><textarea class="in" id="ajt" rows="5" placeholder="Anota todos los ajustes: qué corregir y cómo saber que quedó bien."></textarea></label><div class="sh-f" style="margin-top:10px"><button class="btn warn" id="dev">Devolver</button></div></details>
      <div class="sh-f"><button class="btn ok" id="term">Marcar como terminado</button></div></section>`;
  else if (a.st === 'Necesita revisión') bloque = `<section class="revbox info"><h3>En revisión</h3><p class="sub">Esperando la revisión de ${esc(PERS[a.sup].n)}.</p></section>`;
  if (a.st === 'Requiere ajustes' && u) bloque = `<section class="revbox adj"><h3>Requiere ajustes · ajuste ${nAj(a)}</h3><blockquote><cite>${esc(PERS[u.sol].n)} el ${fs(u.f)}</cite>${esc(u.com)}</blockquote>
      ${esResp ? `<div class="fg"><label class="f"><span>Inicio del ajuste (fecha y hora)</span><input class="in" type="datetime-local" id="aji" value="${u.ini || ''}"></label><label class="f"><span>Entrega del ajuste (fecha y hora)</span><input class="in" type="datetime-local" id="ajf" value="${u.fin || ''}"></label></div>
      <p class="sub">Al guardar con la fecha de entrega, la actividad regresa a revisión y se notifica a ${esc(PERS[a.sup].n)}.</p><div class="sh-f"><button class="btn dark" id="ajg">Guardar</button></div>` : `<p class="sub">${u.ini ? `Inicio: ${fdt(u.ini)}` : 'El responsable aún no registra el inicio del ajuste.'}${u.fin ? ` · Entrega: ${fdt(u.fin)}` : ''}</p>`}</section>`;
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.n)}</span>${nAj(a) ? `<span class="chip warn">${nAj(a)} ajuste${nAj(a) > 1 ? 's' : ''}</span>` : ''}${X}</div><h2 class="ptitle">${esc(a.t)}</h2>
    ${bloque}
    <div class="fg">
      <label class="f full"><span>Estatus</span>${edit && esResp || edit && yo.admin ? `<div class="opts" id="xst">${['Pendiente', 'En progreso', 'Necesita revisión'].map(s => `<button type="button" class="opt ${a.st === s ? 'on' : ''}" data-s="${s}">${s}</button>`).join('')}</div>` : `<div class="ro">${a.st}</div>`}</label>
      ${campos(a, edit, p)}</div>
    <h3 class="sh3">Historial de ajustes · ${nAj(a)}</h3>${nAj(a) ? `<div class="hist">${a.aj.map((j, i) => `<div class="hi"><b>Ajuste ${i + 1}${j.area ? ' del área solicitante' : ''} · ${esc(PERS[j.sol].n)}, ${fs(j.f)}</b><p>${esc(j.com)}</p><small>Inicio ${fdt(j.ini)} · Entrega ${fdt(j.fin)}</small></div>`).join('')}</div>` : '<div class="empty">Esta actividad no ha requerido ajustes.</div>'}
    <div class="sh-f"><button class="btn" id="back">Volver al proyecto</button>${edit ? '<button class="btn dark" id="save">Guardar</button>' : ''}</div>`, true);
  const g = id2 => document.getElementById(id2);
  document.querySelectorAll('#xst .opt').forEach(b => b.onclick = () => document.querySelectorAll('#xst .opt').forEach(x => x.classList.toggle('on', x === b)));
  g('back').onclick = () => proyecto(p.id);
  if (g('save')) g('save').onclick = () => { const antes = a.st; leer(a); const st = document.querySelector('#xst .opt.on'); if (st) a.st = st.dataset.s; guardar(() => DB.actividad(a));
    if (a.st === 'Necesita revisión' && antes !== 'Necesita revisión') notifica(a.sup, `"${a.t}" está lista para revisión.`); else toast('Actividad guardada');
    render(); proyecto(p.id); };
  if (g('term')) g('term').onclick = () => { a.st = 'Terminado'; a.fdone = HOY; guardar(() => DB.estado('actividades', a.id, 'Terminado')); if (a.val) { a.ext = { st: 'Por validar', fenv: HOY }; const k = Object.keys(PERS).find(x => PERS[x].ext && PERS[x].area === p.area); toast(`Aprobada internamente y enviada a revisión de ${k ? PERS[k].n : 'el área'} (${p.area}).`); } else notifica(a.r, `"${a.t}" fue aprobada y marcada como terminada.`); render(); proyecto(p.id); };
  if (g('dev')) g('dev').onclick = () => { const com = g('ajt').value.trim(); if (!com) { toast('Anota los ajustes necesarios antes de devolver.'); return; }
    a.aj = a.aj || []; const nj = { id: uid(), com, sol: S.yo, f: HOY, ini: null, fin: null }; a.aj.push(nj); a.st = 'Requiere ajustes';
    guardar(async () => { await DB.ajuste(nj, 'actividad_id', a.id); await DB.estado('actividades', a.id, 'Requiere ajustes'); });
    notifica(a.r, `"${a.t}" regresó con ajustes. Atiéndela con prioridad.`); render(); proyecto(p.id); };
  if (g('ajg')) g('ajg').onclick = () => { u.ini = g('aji').value || null; u.fin = g('ajf').value || null;
    if (u.fin && !u.ini) { toast('Registra también el inicio del ajuste.'); return; }
    guardar(async () => { await DB.ajusteFechas(u); if (u.fin) await DB.estado('actividades', a.id, 'Necesita revisión'); });
    if (u.fin) { a.st = 'Necesita revisión'; notifica(a.sup, `"${a.t}" tiene el ajuste ${nAj(a)} listo para revisión.`); } else toast('Inicio del ajuste guardado');
    render(); u.fin ? proyecto(p.id) : actividad(a.id); };
}

function actividadForm(p) {
  const a = { r: p.eq.find(k => !PERS[k].admin) || p.eq[0], sup: S.yo, ini: HOY, f: add(HOY, 5), h: '17:00', ent: '', ubi: '', notas: '' };
  openSheet(`<div class="sh-h"><h2>Nueva actividad</h2>${X}</div><p class="sub">${esc(p.n)} · inicia como Pendiente.</p>
    <div class="fg"><label class="f full"><span>Actividad</span><input class="in" id="at"></label>
      <label class="f"><span>Responsable</span><select class="in" id="xr">${p.eq.map(k => `<option value="${k}" ${a.r === k ? 'selected' : ''}>${PERS[k].n}</option>`).join('')}</select></label>
      ${campos(a, true, p).replace(/<label class="f"><span>Responsable<\/span>[\s\S]*?<\/label>/, '')}</div>
    <div class="sh-f"><button class="btn" id="ac">Cancelar</button><button class="btn dark" id="aok">Agregar actividad</button></div>`);
  document.getElementById('ac').onclick = () => proyecto(p.id);
  document.getElementById('aok').onclick = () => { const t = document.getElementById('at').value.trim(); if (!t) { toast('Escribe la actividad.'); return; }
    const n = { id: uid(), p: p.id, t, st: 'Pendiente', aj: [] }; leer(n); A.push(n); guardar(() => DB.actividad(n, true), 'Actividad agregada como Pendiente'); render(); proyecto(p.id); };
}


/* =====================================================================
   PROGRAMAS EN CURSO (solo administradoras)
   ===================================================================== */
const mk = (n, d0, nSes, salto, profs) => { const ses = nSes ? Array.from({ length: nSes }, (_, i) => add(HOY, d0 + i * salto)) : []; return { n, ses, profs, ini: nSes ? ses[0] : add(HOY, d0), fin: nSes ? ses[ses.length - 1] : add(HOY, d0 + salto) }; };
const PROGS = [];
const FG = { tab: 'En curso', inst: '', mo: 0 };
function progAv(g) {
  const ms = [...g.mods].sort((a, b) => a.ini.localeCompare(b.ini));
  const hechos = ms.filter(m => m.fin < HOY).length, cur = ms.find(m => m.ini <= HOY && m.fin >= HOY), sig = ms.find(m => m.ini > HOY);
  return { pct: ms.length ? Math.round(hechos / ms.length * 100) : 0, cur, sig, ms, hechos, rango: ms.length ? [ms[0].ini, ms.map(m => m.fin).sort().pop()] : null };
}
function eventosDia(f, progs) {
  const out = [];
  progs.forEach(g => g.mods.forEach(m => {
    if (g.porSes && m.ses.length) {
      m.ses.forEach((d, i) => { if (d === f) out.push({ g, m, tipo: i === 0 && m.ses.length > 1 ? 'ini' : i === m.ses.length - 1 && m.ses.length > 1 ? 'fin' : 'ses', txt: m.ses.length === 1 ? 'Sesión' : i === 0 ? `Inicia · sesión 1` : i === m.ses.length - 1 ? `Termina · sesión ${i + 1}` : `Sesión ${i + 1}` }); });
    } else { if (m.ini === f) out.push({ g, m, tipo: 'ini', txt: 'Inicia' }); if (m.fin === f && m.fin !== m.ini) out.push({ g, m, tipo: 'fin', txt: 'Termina' }); }
  }));
  return out;
}
function renderProg() {
  const list = PROGS.filter(g => g.est === FG.tab && (!FG.inst || g.inst === FG.inst));
  const base = new Date(HOY.slice(0, 8) + '01T12:00:00'); base.setMonth(base.getMonth() + FG.mo);
  const y = base.getFullYear(), mo = base.getMonth(), primero = iso(base), ult = iso(new Date(y, mo + 1, 0, 12));
  const desde = add(primero, -((base.getDay() + 6) % 7)), semanas = Math.ceil(((new Date(ult) - new Date(desde)) / 864e5 + 1) / 7);
  const progsCal = PROGS.filter(g => !FG.inst || g.inst === FG.inst);
  const delMes = progsCal.filter(g => g.mods.some(m => m.fin >= primero && m.ini <= ult));
  const cal = `<section class="mcal"><div class="ch"><h3>${MES[mo].replace(/^./, c => c.toUpperCase())} ${y}</h3><span class="msub">Sesiones, inicios y cierres de módulos</span><div class="wk r"><button class="ib" id="mp" aria-label="Mes anterior">‹</button><button class="pill ${FG.mo ? '' : 'on'}" id="mt">Este mes</button><button class="ib" id="mn" aria-label="Mes siguiente">›</button></div></div>
    <div class="mgrid">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<div class="mhd">${d}</div>`).join('')}
    ${Array.from({ length: semanas * 7 }, (_, i) => add(desde, i)).map(f => { const es = eventosDia(f, progsCal), fuera = f.slice(0, 7) !== primero.slice(0, 7);
      return `<div class="mday ${fuera ? 'out' : ''} ${f === HOY ? 'hoy' : ''} ${es.length ? 'has' : ''}"><div class="mnum">${+f.slice(8)}</div>
        ${es.slice(0, 3).map(e => `<button class="mev ${e.tipo}" data-pg="${e.g.id}" style="--c:${e.g.c}" title="${esc(e.g.n)} · ${esc(e.m.n)}"><b>${e.txt}</b>${esc(e.m.n)}</button>`).join('')}${es.length > 3 ? `<small class="more2">+${es.length - 3} más</small>` : ''}</div>`; }).join('')}</div>
    <div class="mcal-list">${Array.from({ length: +ult.slice(8) }, (_, i) => add(primero, i)).map(f => ({ f, es: eventosDia(f, progsCal) })).filter(x => x.es.length).map(x => `<div class="mcl-d ${x.f === HOY ? 'hoy' : ''}"><b>${DIA[new Date(x.f + 'T12:00:00').getDay()].slice(0, 3)} ${+x.f.slice(8)}</b><div>${x.es.map(e => `<button class="mev ${e.tipo}" data-pg="${e.g.id}" style="--c:${e.g.c}"><b>${e.txt}</b>${esc(e.m.n)}<small>${esc(e.g.n)}</small></button>`).join('')}</div></div>`).join('') || '<div class="dempty">Sin eventos este mes</div>'}</div>
    <div class="mleg">${delMes.map(g => `<span><i style="background:${g.c}"></i>${esc(g.n)}</span>`).join('') || '<span>Sin programas este mes</span>'}<span class="ky"><em class="k1"></em>Inicio</span><span class="ky"><em class="k2"></em>Sesión</span><span class="ky"><em class="k3"></em>Cierre</span></div></section>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Programas en curso</h1><span class="date">${PROGS.filter(g => g.est === 'En curso').length} en operación</span>
      <div class="acts">
        <button class="btn dark" id="gnew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nuevo programa</button></div></div>
    ${cal}
    <div class="tools"><div class="seg" id="gtab">${['En curso', 'Terminado'].map(t => `<button data-t="${t}" class="${FG.tab === t ? 'on' : ''}">${t === 'En curso' ? 'En curso' : 'Terminados'} · ${PROGS.filter(g => g.est === t).length}</button>`).join('')}</div>
      <select class="fsel" id="ginst"><option value="">Institución: todas</option>${INSTS.map(x => `<option ${FG.inst === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    ${list.length ? `<div class="pgal">${list.map(g => { const a = progAv(g); return `<button class="pcard" data-pg="${g.id}"><div class="pcov" style="--c:${g.c}"><span class="chip">${esc(g.cli)}</span><span class="chip">${g.mods.length} módulos</span>${g.porSes ? `<span class="chip">${g.nSes} sesión${g.nSes > 1 ? 'es' : ''} por módulo</span>` : ''}${g.grupos > 1 ? `<span class="chip">${g.grupos} grupos</span>` : ''}</div>
      <div class="pbody"><div class="pt2">${esc(g.n)}</div><div class="pinst">${esc(g.inst)}</div><div class="sub" style="font-size:12px">${a.rango ? `${fs(a.rango[0])} – ${fs(a.rango[1])}` : 'Sin fechas'}</div>
        <div class="pfoot"><span>Avance</span><b>${a.pct}%</b></div><div class="pbar"><i style="width:${Math.max(a.pct, 2)}%;background:${g.c}"></i></div>
        <div class="pnext">${a.cur ? `<b>En curso:</b> ${esc(a.cur.n)} · termina ${fs(a.cur.fin)}` : a.sig ? `<b>Próximo:</b> ${esc(a.sig.n)} · inicia ${fs(a.sig.ini)}` : 'Todos los módulos concluidos'}</div></div></button>`; }).join('')}</div>`
      : '<div class="empty">No hay programas en esta vista.</div>'}
    <p class="note">Solo administradoras ven esta sección. Cada módulo y cada sesión generan avisos.</p>`;
  (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  document.querySelectorAll('#gtab button').forEach(b => b.onclick = () => { FG.tab = b.dataset.t; render(); });
  document.getElementById('ginst').onchange = e => { FG.inst = e.target.value; render(); };
  document.getElementById('mp').onclick = () => { FG.mo--; render(); }; document.getElementById('mn').onclick = () => { FG.mo++; render(); }; document.getElementById('mt').onclick = () => { FG.mo = 0; render(); };
  document.querySelectorAll('[data-pg]').forEach(b => b.onclick = () => programa(b.dataset.pg));
  document.getElementById('gnew').onclick = () => programaForm();
}
function programa(id) {
  const g = PROGS.find(x => x.id === id), a = progAv(g), ms = a.ms;
  const ini = a.rango ? a.rango[0] : HOY, fin = a.rango ? a.rango[1] : HOY;
  const span = Math.max(1, (new Date(fin) - new Date(ini)) / 864e5 + 1), pos = f => ((new Date(f) - new Date(ini)) / 864e5) / span * 100;
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${g.c}">${esc(g.cli)}</span><span class="chip">${esc(g.inst)}</span><span class="chip ${g.est === 'En curso' ? 'id' : 'ok'}">${g.est}</span>${X}</div>
    <div class="ban" style="--c:${g.c}"></div><h2 class="ptitle">${esc(g.n)}</h2>
    <div class="dl"><div><small>Cliente</small><b>${esc(g.cli)}</b></div><div><small>Horas</small><b>${g.horas}</b></div><div><small>Grupos</small><b>${g.grupos}</b></div><div><small>Sesiones</small><b>${g.porSes ? `${g.nSes} por módulo` : 'No se divide'}</b></div><div><small>Periodo</small><b>${fs(ini)} – ${fs(fin)}</b></div></div>
    <div class="adv"><b>${a.pct}%</b><div><div class="pbar"><i style="width:${Math.max(a.pct, 2)}%;background:${g.c}"></i></div><small>${a.hechos} de ${ms.length} módulos concluidos${a.cur ? ` · en curso: ${esc(a.cur.n)}` : ''}</small></div></div>
    <div class="sh3 row"><h3 class="sh3" style="margin:0">Cronograma</h3><span class="sub">${g.porSes ? 'Los puntos marcan las sesiones; la línea, hoy' : 'La línea marca hoy'}</span></div>
    <div class="gnt">${ms.map(m => `<div class="gr"><div class="gl"><span class="mdot" style="background:${g.c}"></span><div style="min-width:0"><b>${esc(m.n)}</b><small>${fs(m.ini)} – ${fs(m.fin)}</small></div></div><div class="gtr"><i class="gb soft" style="left:${pos(m.ini)}%;width:${Math.max(1.5, ((new Date(m.fin) - new Date(m.ini)) / 864e5 + 1) / span * 100)}%;--c:${g.c}"></i>${(g.porSes ? m.ses : []).map(d => `<span class="sdot" style="left:calc(${pos(d)}% + ${50 / span}%);--c:${g.c}" title="${fs(d)}"></span>`).join('')}${HOY >= ini && HOY <= fin ? `<b class="gtoday" style="left:${pos(HOY)}%"></b>` : ''}</div></div>`).join('')}</div>
    <h3 class="sh3">Módulos</h3><div class="mods">${ms.map(m => { const st = m.fin < HOY ? ['Concluido', 'ok'] : m.ini <= HOY ? ['En curso', 'id'] : ['Próximo', '']; return `<div class="mod" style="--c:${g.c}"><div><b>${esc(m.n)}</b><small>${fs(m.ini)} – ${fs(m.fin)}</small>
      ${g.porSes && m.ses.length ? `<div class="sesl">${m.ses.map((d, i) => `<span class="${d < HOY ? 'past' : d === HOY ? 'today' : ''}">Sesión ${i + 1} · ${fs(d)}</span>`).join('')}</div>` : ''}
      <div class="profs">${m.profs.map((p, i) => `<span>${g.grupos > 1 ? `<b>Grupo ${i + 1}</b> ` : '<b>Profesor</b> '}${esc(p || 'Por asignar')}</span>`).join('')}</div></div><span class="chip ${st[1]}">${st[0]}</span></div>`; }).join('')}</div>
    <div class="sh-f"><button class="btn" id="gst">${g.est === 'En curso' ? 'Marcar como terminado' : 'Reactivar'}</button><button class="btn dark" id="ged">Editar programa</button></div>`, true);
  document.getElementById('ged').onclick = () => programaForm(g);
  document.getElementById('gst').onclick = () => { g.est = g.est === 'En curso' ? 'Terminado' : 'En curso'; guardar(() => DB.programa(g)); toast(g.est === 'Terminado' ? 'Programa terminado' : 'Programa reactivado'); render(); programa(g.id); };
}
function programaForm(g) {
  const e = g ? JSON.parse(JSON.stringify(g)) : { n: '', cli: '', inst: INSTS[0], horas: '', grupos: 1, porSes: false, nSes: 2, c: PAL[(PROGS.length + 2) % PAL.length], mods: [] };
  const ajusta = () => { const ng = Math.max(1, +e.grupos || 1), ns = Math.max(1, +e.nSes || 1);
    e.mods.forEach(m => { m.profs = Array.from({ length: ng }, (_, i) => (m.profs || [])[i] || ''); if (e.porSes) m.ses = Array.from({ length: ns }, (_, i) => (m.ses || [])[i] || ''); }); };
  const draw = () => {
    ajusta(); const ng = Math.max(1, +e.grupos || 1);
    openSheet(`<div class="sh-h"><h2>${g ? 'Editar programa' : 'Nuevo programa'}</h2>${X}</div>
      <div class="fg"><label class="f full"><span>Nombre del programa</span><input class="in" id="gn" value="${esc(e.n)}"></label>
        <label class="f"><span>Cliente</span><input class="in" id="gc" value="${esc(e.cli)}"></label>
        <label class="f"><span>Institución</span><select class="in" id="gi">${INSTS.map(x => `<option ${e.inst === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <label class="f"><span>Horas totales</span><input class="in" type="number" min="0" id="gh" value="${e.horas}"></label>
        <label class="f"><span>Grupos</span><input class="in" type="number" min="1" max="20" id="gg" value="${e.grupos}"></label>
        <div class="f"><span>¿El programa se divide por sesiones?</span><div class="opts" id="gses"><button type="button" class="opt ${e.porSes ? 'on' : ''}" data-v="1">Sí</button><button type="button" class="opt ${e.porSes ? '' : 'on'}" data-v="0">No</button></div></div>
        ${e.porSes ? `<label class="f"><span>Número de sesiones por módulo</span><input class="in" type="number" min="1" max="20" id="gns" value="${e.nSes}"></label>` : '<div></div>'}
        <div class="f full"><span>Foto del programa</span><div class="upl"><div class="upl-p"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-8 7"/></svg></div><button type="button" class="btn">Subir foto</button></div></div>
        <div class="f full"><span>Color</span><div class="sws">${PAL.map(c => `<button type="button" class="sw ${e.c === c ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div></div></div>
      <h3 class="sh3">Módulos</h3>${e.mods.length ? e.mods.map((m, i) => `<div class="mcard"><div class="mc-h"><input class="in" data-m="${i}" data-k="n" value="${esc(m.n)}" placeholder="Nombre del módulo"><button class="x" data-md="${i}" aria-label="Quitar módulo">✕</button></div>
          ${e.porSes ? `<div class="mc-l">Fechas de las sesiones</div><div class="mc-g">${m.ses.map((d, j) => `<label class="f"><span>Sesión ${j + 1}</span><input class="in" type="date" data-ses="${i}:${j}" value="${d}"></label>`).join('')}</div>`
            : `<div class="mc-g"><label class="f"><span>Inicio</span><input class="in" type="date" data-m="${i}" data-k="ini" value="${m.ini || ''}"></label><label class="f"><span>Fin</span><input class="in" type="date" data-m="${i}" data-k="fin" value="${m.fin || ''}"></label></div>`}
          <div class="mc-l">${ng > 1 ? 'Profesores por grupo' : 'Profesor'}</div><div class="mc-g">${m.profs.map((p, j) => `<label class="f"><span>${ng > 1 ? `Grupo ${j + 1}` : 'Nombre'}</span><input class="in" data-prof="${i}:${j}" value="${esc(p)}" placeholder="Profesor"></label>`).join('')}</div></div>`).join('')
        : '<div class="empty">Agrega los módulos; cada uno generará avisos de inicio y fin.</div>'}
      <button class="btn sm" id="madd" style="margin-top:10px">+ Agregar módulo</button>
      <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="gok">${g ? 'Guardar cambios' : 'Crear programa'}</button></div>`, true);
    const v = id => document.getElementById(id);
    const sync = () => { e.n = v('gn').value; e.cli = v('gc').value; e.inst = v('gi').value; e.horas = v('gh').value; e.grupos = Math.max(1, +v('gg').value || 1); if (v('gns')) e.nSes = Math.max(1, +v('gns').value || 1);
      document.querySelectorAll('[data-m]').forEach(i => e.mods[+i.dataset.m][i.dataset.k] = i.value);
      document.querySelectorAll('[data-ses]').forEach(i => { const [a, b] = i.dataset.ses.split(':'); e.mods[+a].ses[+b] = i.value; });
      document.querySelectorAll('[data-prof]').forEach(i => { const [a, b] = i.dataset.prof.split(':'); e.mods[+a].profs[+b] = i.value; }); };
    v('gg').onchange = () => { sync(); draw(); }; if (v('gns')) v('gns').onchange = () => { sync(); draw(); };
    document.querySelectorAll('#gses .opt').forEach(b => b.onclick = () => { sync(); e.porSes = b.dataset.v === '1'; draw(); });
    document.querySelectorAll('.sw').forEach(b => b.onclick = () => { e.c = b.dataset.c; document.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
    v('madd').onclick = () => { sync(); const last = e.mods[e.mods.length - 1], d0 = last && last.fin ? add(last.fin, 1) : HOY;
      e.mods.push({ n: `Módulo ${e.mods.length + 1}`, ini: d0, fin: add(d0, 6), ses: e.porSes ? Array.from({ length: e.nSes }, (_, j) => add(d0, j * 7)) : [], profs: [] }); draw(); };
    document.querySelectorAll('[data-md]').forEach(b => b.onclick = () => { sync(); e.mods.splice(+b.dataset.md, 1); draw(); });
    v('gok').onclick = () => { sync(); if (!e.n.trim()) { toast('Escribe el nombre del programa.'); return; }
      if (e.porSes && e.mods.some(m => m.ses.some(d => !d))) { toast('Captura la fecha de cada sesión.'); return; }
      if (!e.porSes && e.mods.some(m => !m.ini || !m.fin)) { toast('Cada módulo necesita fecha de inicio y fin.'); return; }
      e.mods.forEach(m => { if (e.porSes) { const s2 = [...m.ses].sort(); m.ses = s2; m.ini = s2[0]; m.fin = s2[s2.length - 1]; } else m.ses = []; });
      const row = { n: e.n.trim(), cli: e.cli.trim(), inst: e.inst, horas: +e.horas || 0, grupos: e.grupos, porSes: e.porSes, nSes: e.porSes ? e.nSes : 0, c: e.c, mods: e.mods };
      let it = g; if (g) Object.assign(g, row); else { it = { id: uid(), est: 'En curso', ...row }; PROGS.push(it); }
      guardar(() => DB.programa(it, !g));
      toast(g ? 'Programa actualizado' : 'Programa creado. Te avisaremos de cada sesión, inicio y fin de módulo.'); render(); programa(g ? g.id : PROGS[PROGS.length - 1].id); };
  };
  draw();
}


/* =====================================================================
   INNOVACIÓN
   ===================================================================== */
const ESTI = { 'Propuesta': ['#8A9BA6', 'Propuesta'], 'En prueba': ['#C9962B', 'En prueba'], 'Por retroalimentar': ['#3C74D6', 'Por retroalimentar'], 'Adoptada': ['#2E9E62', 'Se queda'], 'Descartada': ['#8A8A86', 'No se queda'] };
const FI = { tab: 'Activas', per: '', est: '' };
const cerrada = n => ['Adoptada', 'Descartada'].includes(n.est);
const pctI = n => n.sub.length ? Math.round(n.sub.filter(x => x.d).length / n.sub.length * 100) : 0;
const chipI = n => `<span class="ichip" style="--c:${ESTI[n.est][0]}">${ESTI[n.est][1]}</span>`;
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>';

function renderInn() {
  const yo = PERS[S.yo], mias = INN.filter(n => n.r === S.yo), base = yo.admin ? INN : mias, sem = lunes(HOY);
  const activas = base.filter(n => !cerrada(n)), adopt = base.filter(n => n.est === 'Adoptada'), cerr = base.filter(cerrada);
  const horas = adopt.reduce((a, n) => a + (+n.fb?.real || 0), 0), porRet = base.filter(n => n.est === 'Por retroalimentar').length;
  const list = base.filter(n => (FI.tab === 'Activas' ? !cerrada(n) : cerrada(n)) && (!FI.per || n.r === FI.per) && (!FI.est || n.est === FI.est)).sort((a, b) => b.sem.localeCompare(a.sem));
  const equipo = Object.keys(EQ()), propSem = k => INN.some(n => n.r === k && n.sem === sem);
  const kpi = (l, v, s) => `<div class="kpi"><div class="l">${l}</div><b>${v}</b><em>${s}</em></div>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Innovación</h1><span class="date">Semana del ${fs(sem)}</span>
      <div class="acts">
        <button class="btn gold" id="inew">${STAR}Nueva herramienta</button></div></div>
    <section class="iband"><div><span class="medal">${STAR}</span><div><h2>${yo.admin ? 'Innovación del equipo' : 'Tus herramientas de innovación'}</h2><p>${yo.admin ? 'Cada lunes, cada integrante propone una herramienta para optimizar sus tareas. Aquí ves su avance, su retroalimentación y si se quedó en el trabajo diario.' : 'Propón una herramienta cada lunes, registra sus avances y, al final, decide si se queda en tu trabajo diario.'}</p></div></div>
      <div class="kp">${yo.admin
        ? kpi('Propuestas esta semana', `${equipo.filter(propSem).length}/${equipo.length}`, 'integrantes') + kpi('En prueba', activas.length, `${porRet} por retroalimentar`) + kpi('Se quedaron', adopt.length, `${cerr.length ? Math.round(adopt.length / cerr.length * 100) : 0}% de adopción`) + kpi('Horas ahorradas', horas, 'por semana, en total')
        : kpi('Activas', activas.length, `${porRet} por retroalimentar`) + kpi('Se quedaron', adopt.length, 'en tu trabajo diario') + kpi('Horas ahorradas', horas, 'por semana') + kpi('Esta semana', propSem(S.yo) ? 'Lista' : 'Pendiente', propSem(S.yo) ? 'ya propusiste' : 'propón una herramienta')}</div></section>
    ${yo.admin ? `<section class="card monday"><div class="ch"><h3>Sesión del lunes · semana del ${fs(sem)}</h3><span class="sub r">Quién ya propuso su herramienta</span></div><div class="mlist">${equipo.map(k => { const n = INN.find(x => x.r === k && x.sem === sem); return `<button class="mp ${n ? 'ok' : ''}" ${n ? `data-in="${n.id}"` : ''}>${av(k, 30)}<div><b>${esc(PERS[k].n)}</b><small>${n ? esc(n.n) : 'Pendiente de proponer'}</small></div></button>`; }).join('')}</div></section>` : ''}
    <div class="tools"><div class="seg" id="itab">${['Activas', 'Cerradas'].map(t => `<button data-t="${t}" class="${FI.tab === t ? 'on' : ''}">${t} · ${t === 'Activas' ? activas.length : cerr.length}</button>`).join('')}</div>
      ${yo.admin ? `<select class="fsel" id="iper"><option value="">Persona: todas</option>${equipo.map(k => `<option value="${k}" ${FI.per === k ? 'selected' : ''}>${PERS[k].n}</option>`).join('')}</select>` : ''}
      <select class="fsel" id="iest"><option value="">Estado: todos</option>${Object.keys(ESTI).map(k => `<option value="${k}" ${FI.est === k ? 'selected' : ''}>${ESTI[k][1]}</option>`).join('')}</select></div>
    ${list.length ? `<div class="igal">${list.map(n => { const pc = pctI(n); return `<button class="icard ${n.est === 'Adoptada' ? 'won' : ''}" data-in="${n.id}"><div class="ic-h">${yo.admin ? av(n.r, 26) : ''}<span class="sub">Semana del ${fs(n.sem)}</span>${chipI(n)}</div>
      <div class="ic-t">${esc(n.n)}</div><div class="ic-m">Para ${esc(n.tarea.toLowerCase())}</div>
      <div class="gb"><i style="width:${Math.max(pc, 3)}%"></i></div><div class="pr"><span>${n.sub.filter(x => x.d).length} de ${n.sub.length} subtareas · ${n.av.length} avance(s)</span><b>${pc}%</b></div>
      <div class="ic-f">${n.fb ? `<span>Ahorro real: <b>${n.fb.real} h/sem</b></span>` : `<span>Ahorro estimado: <b>${n.ahorroE} h/sem</b></span>`}${n.est === 'Por retroalimentar' && n.r === S.yo ? '<span class="cta">Retroalimentar</span>' : ''}</div></button>`; }).join('')}</div>`
      : `<div class="empty">${FI.tab === 'Activas' ? 'No hay herramientas activas. Propón una con "Nueva herramienta".' : 'Aún no hay herramientas cerradas.'}</div>`}`;
  (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  document.querySelectorAll('#itab button').forEach(b => b.onclick = () => { FI.tab = b.dataset.t; render(); });
  if (document.getElementById('iper')) document.getElementById('iper').onchange = e => { FI.per = e.target.value; render(); };
  document.getElementById('iest').onchange = e => { FI.est = e.target.value; render(); };
  document.querySelectorAll('[data-in]').forEach(b => b.onclick = () => innDetalle(b.dataset.in));
  document.getElementById('inew').onclick = () => innForm();
}

function innForm() {
  const mias = A.filter(a => a.r === S.yo && a.st !== 'Terminado');
  openSheet(`<div class="sh-h"><span class="medal sm">${STAR}</span><h2>Nueva herramienta de innovación</h2>${X}</div><p class="sub">Propón una herramienta o idea que haga más rápida alguna de tus tareas.</p>
    <div class="fg"><label class="f full"><span>Herramienta o idea</span><input class="in" id="nn" placeholder="Ej. Plantillas automáticas para cargar contenidos"></label>
      <label class="f full"><span>¿Qué tarea optimiza?</span><select class="in" id="nt">${mias.map(a => `<option>${esc(a.t)}</option>`).join('')}<option value="__otra">Otra tarea</option></select></label>
      <label class="f full hidden" id="ntw"><span>Describe la tarea</span><input class="in" id="nto"></label>
      <label class="f full"><span>Objetivo</span><textarea class="in" id="no" rows="2" placeholder="Qué quieres lograr y cómo sabrás que funcionó"></textarea></label>
      <label class="f"><span>Semana</span><input class="in" type="date" id="ns" value="${lunes(HOY)}"></label>
      <label class="f"><span>Ahorro estimado (horas por semana)</span><input class="in" type="number" min="0" step="0.5" id="na" value="1"></label>
      <label class="f full"><span>Subtareas (una por línea)</span><textarea class="in" id="nsb" rows="4" placeholder="Investigar opciones&#10;Probar con un caso real&#10;Presentar resultados el lunes"></textarea></label></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn gold" id="nok">${STAR}Proponer herramienta</button></div>`);
  const g = id => document.getElementById(id);
  g('nt').onchange = () => g('ntw').classList.toggle('hidden', g('nt').value !== '__otra');
  g('nok').onclick = () => { const n = g('nn').value.trim(), tarea = g('nt').value === '__otra' ? g('nto').value.trim() : g('nt').value; const sub = g('nsb').value.split('\n').map(x => x.trim()).filter(Boolean);
    if (!n) { toast('Escribe el nombre de la herramienta.'); return; } if (!tarea) { toast('Indica qué tarea optimiza.'); return; } if (!sub.length) { toast('Agrega al menos una subtarea.'); return; }
    const it = { id: uid(), r: S.yo, n, tarea, obj: g('no').value.trim(), sem: g('ns').value, ahorroE: +g('na').value || 0, est: 'Propuesta', sub: sub.map(x => ({ x, d: false })), av: [], com: [] };
    INN.push(it); guardar(() => DB.innovacion(it, true)); toast('Herramienta propuesta. Preséntala en la sesión del lunes.'); render(); innDetalle(it.id); };
}

function innDetalle(id) {
  const n = INN.find(x => x.id === id), yo = PERS[S.yo], mio = n.r === S.yo, pc = pctI(n);
  const fbForm = mio && !cerrada(n) && (n.est === 'Por retroalimentar' || S.fbOpen === id);
  openSheet(`<div class="sh-h"><span class="medal sm">${STAR}</span>${chipI(n)}<span class="chip">Semana del ${fs(n.sem)}</span>${X}</div>
    <h2 class="ptitle">${esc(n.n)}</h2>
    <div class="dl"><div><small>Responsable</small><b>${esc(PERS[n.r].n)}</b></div><div><small>Tarea que optimiza</small><b>${esc(n.tarea)}</b></div><div><small>Ahorro estimado</small><b>${n.ahorroE} h por semana</b></div>${n.fb ? `<div><small>Ahorro real</small><b>${n.fb.real} h por semana</b></div>` : ''}</div>
    ${n.obj ? `<p class="iobj"><b>Objetivo:</b> ${esc(n.obj)}</p>` : ''}
    <div class="adv gold"><b>${pc}%</b><div><div class="gb"><i style="width:${Math.max(pc, 3)}%"></i></div><small>${n.sub.filter(x => x.d).length} de ${n.sub.length} subtareas completadas</small></div></div>
    <div class="icols">
      <section><h3 class="sh3">Subtareas</h3><div class="sublist">${n.sub.map((x, k) => `<label class="${x.d ? 'd' : ''}"><input type="checkbox" data-isub="${k}" ${x.d ? 'checked' : ''} ${mio && !cerrada(n) ? '' : 'disabled'}><span>${esc(x.x)}</span></label>`).join('')}</div>
        ${mio && !cerrada(n) ? '<div class="addrow"><input class="in" id="nsub" placeholder="Agregar subtarea"><button class="btn sm" id="nsubok">Agregar</button></div>' : ''}</section>
      <section><h3 class="sh3">Avances</h3>${n.av.length ? `<div class="avl">${[...n.av].reverse().map(a => `<div class="avi"><b>${fs(a.f)}</b><p>${esc(a.t)}</p></div>`).join('')}</div>` : '<div class="empty">Aún no hay avances registrados.</div>'}
        ${mio && !cerrada(n) ? '<div class="addrow"><input class="in" id="navv" placeholder="¿Qué avanzaste? Ej. Probé la plantilla con el bloque 3"><button class="btn sm" id="navok">Registrar</button></div>' : ''}</section>
    </div>
    ${n.fb ? `<section class="fbbox ${n.est === 'Adoptada' ? 'won' : 'lost'}"><h3>${n.est === 'Adoptada' ? 'Se queda en el trabajo diario' : 'No se queda en el trabajo diario'}</h3>
        <div class="dl"><div><small>¿Cumplió el objetivo?</small><b>${esc(n.fb.cumple)}</b></div><div><small>Ahorro real</small><b>${n.fb.real} h por semana</b></div><div><small>Fecha de decisión</small><b>${fs(n.fb.f)}</b></div></div>
        <p><b>Aprendizaje:</b> ${esc(n.fb.aprendi)}</p><p><b>Motivo de la decisión:</b> ${esc(n.fb.motivo)}</p></section>`
      : fbForm ? `<section class="fbbox"><h3>Retroalimentación final</h3><p class="sub">Evalúa la herramienta y decide si se queda en tu trabajo diario.</p>
        <div class="fg"><div class="f full"><span>¿Cumplió el objetivo?</span><div class="opts" id="fbc">${['Sí', 'Parcialmente', 'No'].map(x => `<button type="button" class="opt" data-x="${x}">${x}</button>`).join('')}</div></div>
          <label class="f"><span>Ahorro real (horas por semana)</span><input class="in" type="number" min="0" step="0.5" id="fbr" value="${n.ahorroE}"></label><div></div>
          <label class="f full"><span>¿Qué aprendiste?</span><textarea class="in" id="fba" rows="3"></textarea></label>
          <div class="f full"><span>Decisión</span><div class="opts" id="fbd"><button type="button" class="opt" data-x="Adoptada">Se queda en mi trabajo diario</button><button type="button" class="opt" data-x="Descartada">No se queda</button></div></div>
          <label class="f full"><span>Motivo de la decisión</span><textarea class="in" id="fbm" rows="2"></textarea></label></div>
        <div class="sh-f"><button class="btn gold" id="fbok">${STAR}Guardar retroalimentación</button></div></section>`
      : mio && !cerrada(n) ? `<div class="sh-f" style="justify-content:flex-start"><button class="btn" id="fbopen">Retroalimentar y decidir ahora</button><span class="sub">Al completar todas las subtareas se te pedirá la retroalimentación.</span></div>` : ''}
    <h3 class="sh3">Comentarios de supervisión</h3>${n.com.length ? `<div class="avl">${n.com.map(c => `<div class="avi">${av(c.k, 22)}<div><b>${esc(PERS[c.k].n)} · ${fs(c.f)}</b><p>${esc(c.t)}</p></div></div>`).join('')}</div>` : '<div class="empty">Sin comentarios.</div>'}
    ${yo.admin && !mio ? '<div class="addrow"><input class="in" id="ncom" placeholder="Deja un comentario o sugerencia"><button class="btn sm" id="ncomok">Comentar</button></div>' : ''}
    <div class="sh-f"><button class="btn" data-close>Cerrar</button></div>`, true);
  const g = x => document.getElementById(x);
  document.querySelectorAll('[data-isub]').forEach(c => c.onchange = () => { n.sub[+c.dataset.isub].d = c.checked; if (n.est === 'Propuesta') n.est = 'En prueba';
    if (n.sub.every(x => x.d)) { n.est = 'Por retroalimentar'; toast('Completaste las subtareas: ahora retroalimenta la herramienta.'); } else if (n.est === 'Por retroalimentar') n.est = 'En prueba'; guardar(() => DB.innovacion(n)); render(); innDetalle(id); });
  if (g('nsubok')) g('nsubok').onclick = () => { const t = g('nsub').value.trim(); if (!t) return; n.sub.push({ x: t, d: false }); if (n.est === 'Por retroalimentar') n.est = 'En prueba'; guardar(() => DB.innovacion(n)); render(); innDetalle(id); };
  if (g('navok')) g('navok').onclick = () => { const t = g('navv').value.trim(); if (!t) return; n.av.push({ f: HOY, t }); if (n.est === 'Propuesta') n.est = 'En prueba'; guardar(() => DB.innovacion(n)); toast('Avance registrado'); render(); innDetalle(id); };
  if (g('fbopen')) g('fbopen').onclick = () => { S.fbOpen = id; innDetalle(id); };
  document.querySelectorAll('#fbc .opt,#fbd .opt').forEach(b => b.onclick = () => b.parentElement.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === b)));
  if (g('fbok')) g('fbok').onclick = () => { const c = document.querySelector('#fbc .on'), d = document.querySelector('#fbd .on');
    if (!c || !d) { toast('Indica si cumplió el objetivo y tu decisión.'); return; } if (!g('fba').value.trim() || !g('fbm').value.trim()) { toast('Escribe tu aprendizaje y el motivo de la decisión.'); return; }
    n.fb = { cumple: c.dataset.x, real: +g('fbr').value || 0, aprendi: g('fba').value.trim(), motivo: g('fbm').value.trim(), f: HOY }; n.est = d.dataset.x; S.fbOpen = null; guardar(() => DB.innovacion(n));
    toast(n.est === 'Adoptada' ? 'La herramienta se queda en tu trabajo diario.' : 'Retroalimentación guardada. La herramienta se cerró.'); render(); innDetalle(id); };
  if (g('ncomok')) g('ncomok').onclick = () => { const t = g('ncom').value.trim(); if (!t) return; n.com.push({ k: S.yo, f: HOY, t }); guardar(() => DB.comentarioInn(n, t)); toast(`Comentario enviado a ${PERS[n.r].n}`); innDetalle(id); };
}


/* =====================================================================
   IMPACTO VALIDADO (solo administradoras)
   ===================================================================== */
const FIV = { tab: 'Por validar', area: '', inst: '' };
const MEDIOS = ['Reunión', 'Correo', 'Llamada', 'Encuesta', 'Mensaje'];
const VALOR = { 'Sí': ['#2E9E62', 'Sí sirvió'], 'Parcialmente': ['#D99A12', 'Sirvió parcialmente'], 'No': ['#D6453D', 'No sirvió'] };
const diasEntre = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const estadoImp = p => p.imp && p.imp.final ? 'Validado' : p.imp ? 'En seguimiento' : 'Pendiente';
function renderImp() {
  const term = PROY.filter(p => p.est === 'Terminado'), val = term.filter(p => p.imp && p.imp.final), pend = term.filter(p => !(p.imp && p.imp.final));
  const prom = val.length ? Math.round(val.reduce((a, p) => a + diasEntre(p.fter, p.imp.frec), 0) / val.length) : 0;
  const list = (FIV.tab === 'Por validar' ? pend : val).filter(p => (!FIV.area || p.area === FIV.area) && (!FIV.inst || p.inst === FIV.inst)).sort((a, b) => FIV.tab === 'Por validar' ? a.fter.localeCompare(b.fter) : b.imp.frec.localeCompare(a.imp.frec));
  const porArea = AREAS.map(a => ({ a, t: term.filter(p => p.area === a).length, v: val.filter(p => p.area === a).length })).filter(x => x.t);
  const kpi = (l, v, s, c) => `<div class="kpi"><div class="l">${l}</div><b style="${c ? `color:${c}` : ''}">${v}</b><em>${s}</em></div>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Impacto validado</h1><span class="date">${term.length} proyecto(s) terminados</span>
      <div class="acts"></div></div>
    <section class="band vband"><div><small>Indicador del área</small><h2>Lo que entregamos, ¿sirvió?</h2><p class="sub" style="margin:6px 0 0">Cada proyecto terminado se valida con la retroalimentación del área solicitante.</p></div>
      <div class="kp" style="grid-template-columns:repeat(4,1fr)">${kpi('Impacto validado', val.length, `de ${term.length} terminados`, 'var(--good)')}${kpi('Por validar', pend.length, `${pend.filter(p => diasEntre(p.fter, HOY) > 15).length} con más de 15 días`, pend.length ? 'var(--warn)' : '')}${kpi('Tasa de validación', `${term.length ? Math.round(val.length / term.length * 100) : 0}%`, 'meta sugerida: 100%')}${kpi('Días para validar', prom, 'promedio desde el cierre')}</div></section>
    <div class="vgrid">
      <div>
        <div class="tools"><div class="seg" id="vtab">${['Por validar', 'Validados'].map(t => `<button data-t="${t}" class="${FIV.tab === t ? 'on' : ''}">${t} · ${t === 'Por validar' ? pend.length : val.length}</button>`).join('')}</div>
          <select class="fsel" id="varea"><option value="">Área solicitante: todas</option>${AREAS.map(x => `<option ${FIV.area === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
          <select class="fsel" id="vinst"><option value="">Institución: todas</option>${INSTS.map(x => `<option ${FIV.inst === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
        ${list.length ? `<div class="vlist">${list.map(p => { const st = estadoImp(p), d = diasEntre(p.fter, HOY);
          return `<article class="vcard ${st === 'Validado' ? 'ok' : ''}" style="--c:${p.c}"><div class="vc-h"><span class="vbar"></span><div style="flex:1;min-width:0"><div class="pt2">${esc(p.n)}</div><div class="sub" style="font-size:12px">${esc(p.area)} · ${esc(p.inst)} · ${esc(p.tipo)}</div></div>
            ${st === 'Validado' ? `<span class="vchip ok">Impacto validado</span>` : st === 'En seguimiento' ? '<span class="vchip seg">En seguimiento</span>' : `<span class="vchip ${d > 15 ? 'late' : ''}">Pendiente · ${d} día${d === 1 ? '' : 's'}</span>`}</div>
            <div class="vmeta"><span>Terminado el <b>${fs(p.fter)}</b></span>${p.imp ? `<span>Retroalimentación: <b>${fs(p.imp.frec)}</b> · ${esc(p.imp.medio)}</span>` : '<span>Sin retroalimentación registrada</span>'}${p.imp && p.imp.valor ? `<span class="vval" style="--c:${VALOR[p.imp.valor][0]}">${VALOR[p.imp.valor][1]}</span>` : ''}</div>
            ${p.imp ? `<blockquote class="vq"><cite>${esc(p.imp.quien)}</cite>${esc(p.imp.com)}</blockquote>` : ''}
            <div class="vact">${st === 'Validado' ? `<button class="btn sm" data-vver="${p.id}">Ver detalle</button>` : `<button class="btn dark sm" data-vreg="${p.id}">${p.imp ? 'Continuar registro' : 'Registrar retroalimentación'}</button>`}<button class="btn sm" data-vproy="${p.id}">Ver proyecto</button></div></article>`; }).join('')}</div>`
          : `<div class="empty">${FIV.tab === 'Por validar' ? 'Todos los proyectos terminados tienen su impacto validado.' : 'Aún no hay proyectos con impacto validado.'}</div>`}
      </div>
      <aside class="card vside"><h3>Por área solicitante</h3><p class="sub" style="margin:2px 0 10px">Proyectos validados de los terminados</p>
        ${porArea.length ? porArea.map(x => `<div class="va"><div class="va-h"><span>${esc(x.a)}</span><b>${x.v}/${x.t}</b></div><div class="pbar"><i style="width:${Math.max(x.v / x.t * 100, 3)}%;background:var(--good)"></i></div></div>`).join('') : '<div class="empty">Sin proyectos terminados.</div>'}</aside>
    </div>`;
  (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  document.querySelectorAll('#vtab button').forEach(b => b.onclick = () => { FIV.tab = b.dataset.t; render(); });
  document.getElementById('varea').onchange = e => { FIV.area = e.target.value; render(); };
  document.getElementById('vinst').onchange = e => { FIV.inst = e.target.value; render(); };
  document.querySelectorAll('[data-vreg]').forEach(b => b.onclick = () => impForm(b.dataset.vreg));
  document.querySelectorAll('[data-vver]').forEach(b => b.onclick = () => impVer(b.dataset.vver));
  document.querySelectorAll('[data-vproy]').forEach(b => b.onclick = () => proyecto(b.dataset.vproy));
}
function impForm(id) {
  const p = PROY.find(x => x.id === id), e = p.imp || { frec: HOY, quien: '', medio: 'Reunión', com: '', valor: '' };
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.area)}</span><span class="chip">Terminado el ${fs(p.fter)}</span>${X}</div>
    <h2 class="ptitle">Retroalimentación del área solicitante</h2><p class="sub">${esc(p.n)}</p>
    <div class="fg"><label class="f"><span>Fecha en que se recibió</span><input class="in" type="date" id="vf" value="${e.frec}"></label>
      <label class="f"><span>Medio</span><select class="in" id="vm">${MEDIOS.map(m => `<option ${e.medio === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
      <label class="f full"><span>¿Quién dio la retroalimentación?</span><input class="in" id="vq" value="${esc(e.quien)}" placeholder="Nombre y puesto en ${esc(p.area)}"></label>
      <div class="f full"><span>¿Lo que entregamos sirvió?</span><div class="opts" id="vv">${Object.keys(VALOR).map(k => `<button type="button" class="opt ${e.valor === k ? 'on' : ''}" data-x="${k}">${VALOR[k][1]}</button>`).join('')}</div></div>
      <label class="f full"><span>Fecha en que el área comenzó a implementarlo (si ya lo implementa)</span><input class="in" type="date" id="vi" value="${e.impl || ''}"></label>
      <label class="f full"><span>Comentarios del área solicitante</span><textarea class="in" id="vc" rows="5" placeholder="Qué opinaron del entregable, qué resultados observaron y qué sugieren mejorar">${esc(e.com)}</textarea></label></div>
    <p class="sub">"Guardar" deja el registro en seguimiento. "Finalizar" lo cuenta como <b>Impacto validado</b> y ya no se puede editar.</p>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn" id="vsave">Guardar</button><button class="btn ok" id="vfin">Finalizar</button></div>`);
  const g = x => document.getElementById(x);
  document.querySelectorAll('#vv .opt').forEach(b => b.onclick = () => document.querySelectorAll('#vv .opt').forEach(x => x.classList.toggle('on', x === b)));
  const leerV = () => ({ impl: g('vi').value || null, frec: g('vf').value, medio: g('vm').value, quien: g('vq').value.trim(), com: g('vc').value.trim(), valor: document.querySelector('#vv .on')?.dataset.x || '' });
  g('vsave').onclick = () => { const r = leerV(); if (!r.frec) { toast('Indica la fecha en que se recibió.'); return; } p.imp = { ...r, final: false, por: S.yo }; guardar(() => DB.impacto(p)); toast('Retroalimentación guardada en seguimiento'); closeSheet(); render(); };
  g('vfin').onclick = () => { const r = leerV();
    if (!r.frec || !r.com || !r.quien || !r.valor) { toast('Para finalizar captura fecha, quién la dio, si sirvió y los comentarios.'); return; }
    if (r.frec < p.fter) { toast('La fecha de retroalimentación no puede ser anterior al cierre del proyecto.'); return; }
    p.imp = { ...r, final: true, por: S.yo, ffin: HOY }; guardar(() => DB.impacto(p)); toast('Impacto validado'); closeSheet(); FIV.tab = 'Validados'; render(); };
}
function impVer(id) {
  const p = PROY.find(x => x.id === id), i = p.imp;
  openSheet(`<div class="sh-h"><span class="vchip ok">Impacto validado</span><span class="chip">${esc(p.area)}</span>${X}</div><h2 class="ptitle">${esc(p.n)}</h2>
    <div class="dl"><div><small>Terminado</small><b>${fs(p.fter)}</b></div><div><small>Retroalimentación recibida</small><b>${fs(i.frec)} · ${esc(i.medio)}</b></div><div><small>Días para validar</small><b>${diasEntre(p.fter, i.frec)}</b></div><div><small>¿Sirvió?</small><b style="color:${VALOR[i.valor][0]}">${VALOR[i.valor][1]}</b></div></div>
    <blockquote class="vq" style="margin-top:12px"><cite>${esc(i.quien)}</cite>${esc(i.com)}</blockquote>
    <p class="sub">Registró ${esc(PERS[i.por].n)} y se finalizó el ${fs(i.ffin)}.</p><div class="sh-f"><button class="btn" data-close>Cerrar</button></div>`);
}


/* =====================================================================
   INICIATIVAS (trimestrales, con todo el equipo)
   ===================================================================== */
const trim = f => `${f.slice(0, 4)}-T${Math.floor((+f.slice(5, 7) - 1) / 3) + 1}`;
const trimLabel = t => `${['Primer', 'Segundo', 'Tercer', 'Cuarto'][+t.slice(-1) - 1]} trimestre ${t.slice(0, 4)}`;
const trimRango = t => { const y = +t.slice(0, 4), q = +t.slice(-1); return [iso(new Date(y, (q - 1) * 3, 1, 12)), iso(new Date(y, q * 3, 0, 12))]; };
const trimMove = (t, n) => { let y = +t.slice(0, 4), q = +t.slice(-1) + n; while (q > 4) { q -= 4; y++; } while (q < 1) { q += 4; y--; } return `${y}-T${q}`; };
const KPIS = ['KPI por definir'];
const ac = (a, r, dlim, res, w, fel, ok, obt) => ({ a, r, lim: add(HOY, dlim), res, w, fel: fel === null ? null : add(HOY, fel), ok, obt: obt || '' });
const INI = [];
const FN = { t: trim(HOY) };
const wAcc = i => i.acc.length ? Math.round(100 / i.acc.length * 10) / 10 : 0;
const pctTxt = v => `${String(v).replace('.', '.')}%`;
const avIni = i => i.acc.length ? Math.round(i.acc.filter(x => x.ok === true).length / i.acc.length * 100) : 0;
const sumW = i => 100;
const okIcon = ok => ok === true ? '<span class="okc yes" title="Se cumplió">✓</span>' : ok === false ? '<span class="okc no" title="No se cumplió">✕</span>' : '<span class="okc pen" title="Por evaluar">–</span>';

function renderIni() {
  const yo = PERS[S.yo], [d0, d1] = trimRango(FN.t), list = INI.filter(i => i.t === FN.t), actual = FN.t === trim(HOY);
  const dias = actual ? Math.max(0, Math.min(100, Math.round((new Date(HOY) - new Date(d0)) / (new Date(d1) - new Date(d0)) * 100))) : (FN.t < trim(HOY) ? 100 : 0);
  const misAcc = list.flatMap(i => i.acc.map((x, k) => ({ i, x, k })).filter(m => m.x.r === S.yo));
  const meses = [0, 1, 2].map(k => MES[+d0.slice(5, 7) - 1 + k]);
  const pasados = [-1, -2, -3].map(n => trimMove(trim(HOY), n)).map(t => ({ t, xs: INI.filter(i => i.t === t) }));
  const seg = i => `<div class="segbar">${i.acc.map(x => `<i class="${x.ok === true ? 'y' : x.ok === false ? 'n' : !x.fel && x.lim < HOY ? 'l' : x.fel ? 'e' : ''}" style="flex:1" title="${esc(x.a)} · ${pctTxt(wAcc(i))}"></i>`).join('')}</div>`;
  const slot = (i, n) => { if (!i) return `<button class="islot empty2" ${yo.admin ? 'id="nnew2"' : ''}><span class="inum">${n}</span><b>Iniciativa por definir</b><small>${yo.admin ? 'Toca para crearla' : 'La definirán la directora y la supervisora'}</small></button>`;
    const pa = avIni(i), sig = i.acc.filter(x => x.ok === null).sort((a, b) => a.lim.localeCompare(b.lim))[0], eq = [...new Set(i.acc.map(x => x.r))], ok = i.acc.filter(x => x.ok === true).length, ritmo = actual ? pa - dias : 0;
    return `<button class="icv" data-idet="${i.id}" style="--c:${i.c}"><div class="icv-top"><span class="inum">${n}</span><span class="kpi-chip">${esc(i.kpi)}</span>${actual ? `<span class="pace ${ritmo >= 0 ? 'ok' : ritmo > -15 ? 'mid' : 'bad'}">${ritmo >= 0 ? 'En ritmo' : ritmo > -15 ? 'Ligeramente atrasada' : 'Atrasada'}</span>` : ''}</div>
      <div class="icv-body"><div class="icv-ring" style="--p:${pa}"><div><b>${pa}%</b><small>avance</small></div></div>
        <div class="icv-txt"><h3>${esc(i.n)}</h3><p>${esc(i.meta)}</p><div class="team">${eq.map(k => av(k, 26)).join('')}</div></div></div>
      ${seg(i)}<div class="icv-f"><span><b>${ok}</b> de ${i.acc.length} acciones cumplidas</span>${sig ? `<span>Siguiente: <b>${esc(sig.a)}</b> · ${fs(sig.lim)}</span>` : '<span>Sin acciones pendientes</span>'}</div>
      <span class="icv-go">Ver desglose ›</span></button>`; };
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Iniciativas</h1><span class="date">${trimLabel(FN.t)}</span>
      <div class="acts">
        ${yo.admin ? '<button class="btn dark" id="nnew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nueva iniciativa</button>' : ''}</div></div>
    <section class="qhero"><div class="qh-l"><span class="qlab">Iniciativas del área</span><h2>${trimLabel(FN.t)}</h2><p>${list.length} de 2 iniciativas definidas · ${fs(d0)} al ${fs(d1)}</p>
        <div class="wk"><button class="ib" id="tp" aria-label="Trimestre anterior">‹</button><button class="pill ${actual ? 'on' : ''}" id="tt">Trimestre actual</button><button class="ib" id="tn" aria-label="Trimestre siguiente">›</button></div></div>
      <div class="qh-r"><div class="qtime"><div class="qt-h"><span>Tiempo del trimestre</span><b>${dias}%</b></div><div class="qbar"><i style="width:${dias}%"></i>${actual ? `<b style="left:${dias}%"></b>` : ''}</div><div class="qmeses">${meses.map(m => `<span>${m.replace(/^./, c => c.toUpperCase())}</span>`).join('')}</div></div>
        <div class="qstats">${list.map(i => `<div><i style="background:${i.c}"></i><span>${esc(i.n)}</span><b>${avIni(i)}%</b></div>`).join('') || '<div><span>Sin iniciativas definidas</span></div>'}</div></div></section>
    <div class="islots">${slot(list[0], 1)}${slot(list[1], 2)}${list.slice(2).map((i, k) => slot(i, k + 3)).join('')}</div>
    ${misAcc.length ? `<section class="card"><div class="ch"><h3>Mis acciones del trimestre</h3><span class="badge id r">${misAcc.filter(m => m.x.fel).length} de ${misAcc.length} elaboradas</span></div>
      <div class="rows">${misAcc.sort((a, b) => a.x.lim.localeCompare(b.x.lim)).map(({ i, x, k }) => `<div class="rw"><span>${okIcon(x.ok)}</span><div style="min-width:0"><div class="t">${esc(x.a)}</div><div class="m"><span class="${!x.fel && x.lim < HOY ? 'lt' : ''}">Límite ${fs(x.lim)}</span> · ${esc(x.res)} · <b>${pctTxt(wAcc(i))}</b></div></div><button class="ppill" style="--c:${i.c}" data-idet="${i.id}"><i></i><span class="pn">${esc(i.n)}</span></button></div>`).join('')}</div></section>` : ''}
    <section class="card"><div class="ch"><h3>Trimestres anteriores</h3></div><div class="qpast">${pasados.map(({ t, xs }) => `<button class="qp" data-qt="${t}"><b>${trimLabel(t)}</b>${xs.length ? xs.map(i => `<div class="qp-r"><span>${esc(i.n)}</span><div class="pbar"><i style="width:${Math.max(avIni(i), 2)}%;background:${i.c}"></i></div><em>${avIni(i)}%</em></div>`).join('') : '<small class="sub">Sin iniciativas registradas</small>'}</button>`).join('')}</div></section>`;
  const g = x => document.getElementById(x);
  (g('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  g('tp').onclick = () => { FN.t = trimMove(FN.t, -1); render(); }; g('tn').onclick = () => { FN.t = trimMove(FN.t, 1); render(); }; g('tt').onclick = () => { FN.t = trim(HOY); render(); };
  if (g('nnew')) g('nnew').onclick = () => iniForm(); if (g('nnew2')) g('nnew2').onclick = () => iniForm();
  document.querySelectorAll('[data-idet]').forEach(b => b.onclick = () => iniDetalle(b.dataset.idet));
  document.querySelectorAll('[data-qt]').forEach(b => b.onclick = () => { FN.t = b.dataset.qt; render(); });
}
function iniDetalle(id) {
  const i = INI.find(x => x.id === id), yo = PERS[S.yo], [d0, d1] = trimRango(i.t), actual = i.t === trim(HOY), pa = avIni(i), sw = sumW(i);
  const dias = actual ? Math.max(0, Math.min(100, Math.round((new Date(HOY) - new Date(d0)) / (new Date(d1) - new Date(d0)) * 100))) : 100;
  const span = (new Date(d1) - new Date(d0)) / 864e5, pos = f => Math.max(0, Math.min(100, (new Date(f) - new Date(d0)) / 864e5 / span * 100));
  const stTxt = x => x.ok === true ? ['Se cumplió', 'y'] : x.ok === false ? ['No se cumplió', 'n'] : !x.fel && x.lim < HOY ? ['Vencida', 'l'] : x.fel ? ['Elaborada · por evaluar', 'e'] : ['En curso', ''];
  openSheet(`<div class="idet-cover" style="--c:${i.c}"><div class="sh-h" style="margin:0"><span class="chip">${trimLabel(i.t)}</span><span class="chip">${esc(i.kpi)}</span>${X}</div>
      <div class="idc-b"><div class="icv-ring big" style="--p:${pa}"><div><b>${pa}%</b><small>avance</small></div></div><div><h2>${esc(i.n)}</h2><p>${esc(i.obj)}</p></div></div></div>
    <div class="dl" style="margin-top:12px"><div><small>Meta de la iniciativa</small><b>${esc(i.meta)}</b></div><div><small>KPI que impacta</small><b>${esc(i.kpi)}</b></div><div><small>Avance vs. tiempo</small><b>${pa}% de avance · ${dias}% del trimestre</b></div><div><small>Acciones</small><b>${i.acc.filter(x => x.ok === true).length} cumplidas de ${i.acc.length} · cada una vale ${pctTxt(wAcc(i))}</b></div></div>
    
    <div class="sh3 row"><h3 class="sh3" style="margin:0">Ruta de acciones</h3><span class="sub">Cada acción en su fecha límite dentro del trimestre</span></div>
    <div class="iroute"><div class="ir-line"><i style="width:${dias}%"></i></div>${actual ? `<span class="ir-today" style="left:${dias}%">Hoy</span>` : ''}${i.acc.map((x, k) => `<button class="ir-pt ${stTxt(x)[1]}" style="left:${pos(x.lim)}%" data-iac="${i.id}:${k}" title="${esc(x.a)} · ${fs(x.lim)}">${x.ok === true ? '✓' : x.ok === false ? '✕' : k + 1}</button>`).join('')}
      <div class="ir-m">${[0, 1, 2].map(k => `<span>${MES[+d0.slice(5, 7) - 1 + k].replace(/^./, c => c.toUpperCase())}</span>`).join('')}</div></div>
    <div class="sh3 row"><h3 class="sh3" style="margin:0">Desglose de acciones</h3>${yo.admin ? `<button class="btn dark sm" data-iadd="${i.id}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Agregar acción</button>` : ''}</div>
    <div class="acards">${i.acc.map((x, k) => { const st = stTxt(x); return `<div class="acard ${st[1]} ${x.r === S.yo ? 'mine' : ''}"><div class="ac-n">${k + 1}</div><div class="ac-b"><div class="ac-h"><b>${esc(x.a)}</b><span class="ac-w">${pctTxt(wAcc(i))}</span></div>
        <div class="ac-g"><span class="who">${av(x.r, 22)}${esc(PERS[x.r].n)}</span><span>Límite <b class="${st[1] === 'l' ? 'latet' : ''}">${fs(x.lim)}</b></span><span>Elaborada <b>${x.fel ? fs(x.fel) : '—'}</b></span></div>
        <div class="ac-r"><div><small>Resultado esperado</small><b>${esc(x.res)}</b></div><div><small>Resultado obtenido</small><b>${x.obt ? esc(x.obt) : '—'}</b></div></div></div>
        <div class="ac-s">${okIcon(x.ok)}<small>${st[0]}</small>${yo.admin || x.r === S.yo ? `<button class="btn sm" data-iac="${i.id}:${k}">${yo.admin ? 'Actualizar' : 'Registrar'}</button>` : ''}</div></div>`; }).join('') || '<div class="empty">Agrega las acciones de la iniciativa.</div>'}</div>
    <div class="sh-f">${yo.admin ? `<button class="btn" data-iedit="${i.id}">Editar iniciativa</button>` : ''}<button class="btn" data-close>Cerrar</button></div>`, true);
  const sh = document.getElementById('sheet');
  sh.querySelectorAll('[data-iac]').forEach(b => b.onclick = () => { const [iid, k] = b.dataset.iac.split(':'); if (yo.admin || i.acc[+k].r === S.yo) accForm(i, +k); });
  sh.querySelectorAll('[data-iadd]').forEach(b => b.onclick = () => accForm(i));
  sh.querySelectorAll('[data-iedit]').forEach(b => b.onclick = () => iniForm(i));
}
function iniForm(i) {
  const e = i ? { ...i } : { n: '', obj: '', kpi: KPIS[0], meta: '', t: FN.t, c: PAL[INI.length % PAL.length] };
  if (!i && INI.filter(x => x.t === FN.t).length >= 2) toast('Este trimestre ya tiene dos iniciativas; puedes agregar otra si es necesario.');
  openSheet(`<div class="sh-h"><h2>${i ? 'Editar iniciativa' : 'Nueva iniciativa'}</h2>${X}</div><p class="sub">${trimLabel(e.t)}</p>
    <div class="fg"><label class="f full"><span>Nombre de la iniciativa</span><input class="in" id="in1" value="${esc(e.n)}"></label>
      <label class="f full"><span>Objetivo general</span><textarea class="in" id="in2" rows="3">${esc(e.obj)}</textarea></label>
      <label class="f"><span>KPI que se quiere impactar</span><select class="in" id="in3">${KPIS.map(k => `<option ${e.kpi === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
      <label class="f"><span>Meta de la iniciativa</span><input class="in" id="in4" value="${esc(e.meta)}" placeholder="Ej. Reducir 30% los ajustes por actividad"></label>
      <div class="f full"><span>Color</span><div class="sws">${PAL.map(c => `<button type="button" class="sw ${e.c === c ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div></div></div>
    <p class="sub">El catálogo de KPIs se cargará cuando se definan; mientras tanto queda como "KPI por definir".</p>
    <div class="sh-f">${i ? '<button class="btn" id="idel" style="margin-right:auto;color:var(--bad)">Eliminar</button>' : ''}<button class="btn" data-close>Cancelar</button><button class="btn dark" id="iok">${i ? 'Guardar' : 'Crear iniciativa'}</button></div>`);
  const g = x => document.getElementById(x);
  document.querySelectorAll('.sw').forEach(b => b.onclick = () => { e.c = b.dataset.c; document.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
  if (g('idel')) g('idel').onclick = () => { if (confirm('¿Eliminar esta iniciativa y sus acciones?')) { INI.splice(INI.indexOf(i), 1); guardar(() => DB.borrarIniciativa(i)); closeSheet(); render(); } };
  g('iok').onclick = () => { const row = { n: g('in1').value.trim(), obj: g('in2').value.trim(), kpi: g('in3').value, meta: g('in4').value.trim(), c: e.c };
    if (!row.n || !row.obj || !row.meta) { toast('Captura nombre, objetivo y meta.'); return; }
    let it = i; if (i) Object.assign(i, row); else { it = { id: uid(), t: FN.t, acc: [], ...row }; INI.push(it); }
    guardar(() => DB.iniciativa(it, !i));
    toast(i ? 'Iniciativa actualizada' : 'Iniciativa creada. Agrega sus acciones.'); render(); iniDetalle(it.id); };
}
function accForm(i, k) {
  const yo = PERS[S.yo], x = k === undefined ? { a: '', r: Object.keys(EQ()).find(k => !PERS[k].off) || S.yo, lim: add(HOY, 14), res: '', fel: null, ok: null, obt: '' } : i.acc[k];
  const soloResp = !yo.admin;
  openSheet(`<div class="sh-h"><h2>${k === undefined ? 'Nueva acción' : soloResp ? 'Registrar mi acción' : 'Actualizar acción'}</h2>${X}</div><p class="sub">${esc(i.n)}</p>
    <div class="fg"><label class="f full"><span>Acción</span><input class="in" id="a1" value="${esc(x.a)}" ${soloResp ? 'disabled' : ''}></label>
      <label class="f"><span>Responsable</span><select class="in" id="a2" ${soloResp ? 'disabled' : ''}>${Object.entries(EQ()).map(([kk, p]) => `<option value="${kk}" ${x.r === kk ? 'selected' : ''}>${p.n}</option>`).join('')}</select></label>
      <label class="f"><span>Fecha límite</span><input class="in" type="date" id="a3" value="${x.lim}" ${soloResp ? 'disabled' : ''}></label>
      <label class="f full"><span>Resultado esperado (cuantitativo)</span><input class="in" id="a4" value="${esc(x.res)}" placeholder="Ej. 3 proyectos con checklist aplicado" ${soloResp ? 'disabled' : ''}></label>
      <div class="f"><span>Porcentaje de la acción</span><div class="ro">${pctTxt(k === undefined ? Math.round(100 / (i.acc.length + 1) * 10) / 10 : wAcc(i))} <small class="sub" style="font-weight:500">calculado por la plataforma</small></div></div>
      <label class="f"><span>Fecha en que se elaboró</span><input class="in" type="date" id="a6" value="${x.fel || ''}"></label>
      <label class="f full"><span>Resultado obtenido</span><input class="in" id="a7" value="${esc(x.obt)}" placeholder="Ej. 2 de 3 proyectos"></label>
      ${yo.admin ? `<div class="f full"><span>¿Se cumplió?</span><div class="opts" id="a8"><button type="button" class="opt ${x.ok === true ? 'on' : ''}" data-v="1">✓ Sí se cumplió</button><button type="button" class="opt ${x.ok === false ? 'on' : ''}" data-v="0">✕ No se cumplió</button><button type="button" class="opt ${x.ok === null ? 'on' : ''}" data-v="">Por evaluar</button></div></div>` : '<p class="sub full">La supervisión marcará si se cumplió al revisar tu resultado.</p>'}</div>
    <div class="sh-f">${yo.admin && k !== undefined ? '<button class="btn" id="adel" style="margin-right:auto;color:var(--bad)">Quitar acción</button>' : ''}<button class="btn" id="acan">Volver</button><button class="btn dark" id="aok">Guardar</button></div>`);
  document.getElementById('acan').onclick = () => iniDetalle(i.id);
  const g = y => document.getElementById(y);
  document.querySelectorAll('#a8 .opt').forEach(b => b.onclick = () => document.querySelectorAll('#a8 .opt').forEach(z => z.classList.toggle('on', z === b)));
  if (g('adel')) g('adel').onclick = () => { const xa = i.acc[k]; i.acc.splice(k, 1); guardar(() => DB.borrarAccion(xa)); render(); iniDetalle(i.id); };
  g('aok').onclick = () => {
    const row = { a: g('a1').value.trim(), r: g('a2').value, lim: g('a3').value, res: g('a4').value.trim(), fel: g('a6').value || null, obt: g('a7').value.trim() };
    if (yo.admin) { const v = document.querySelector('#a8 .on')?.dataset.v; row.ok = v === '1' ? true : v === '0' ? false : null; }
    if (!row.a || !row.res) { toast('Captura la acción y el resultado esperado.'); return; }
    let xa; if (k === undefined) { xa = { id: uid(), ok: null, ...row }; i.acc.push(xa); } else { xa = i.acc[k]; Object.assign(xa, row); }
    guardar(() => DB.accion(i, xa, k === undefined, i.acc.indexOf(xa)));
    toast(`Acción guardada. Cada acción vale ${pctTxt(wAcc(i))} de la iniciativa.`);
    if (!yo.admin && row.fel) toast('Acción registrada. Se notificó a la supervisión para evaluarla.');
    render(); iniDetalle(i.id); };
}


/* =====================================================================
   EQUIPO (solo administradoras)
   ===================================================================== */
const FE = { wk: 0 };
const hashN = str => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
// Tiempo con la plataforma abierta (simulado en la maqueta; en el sitio real lo registra la plataforma)
const horasDia = (k, f) => { const t = (TIEMPO[k] || {})[f]; return t ? Math.round(t.s / 360) / 10 : 0; };
const horasPost = (k, f) => { const t = (TIEMPO[k] || {})[f]; return t ? Math.round(t.post / 360) / 10 : 0; };
const integrantes = () => Object.keys(EQ()).filter(k => k !== S.yo && !PERS[k].off);
function semanaDe(k, ws) {
  const we = add(ws, 6), dias = Array.from({ length: 7 }, (_, i) => add(ws, i));
  const xs = A.filter(a => a.r === k), prog = xs.filter(a => a.f >= ws && a.f <= we), hechas = prog.filter(a => a.st === 'Terminado');
  const ajW = xs.flatMap(a => (a.aj || []).filter(j => j.f >= ws && j.f <= we).map(j => ({ a, j })));
  const horas = dias.map(f => horasDia(k, f)), tot = horas.reduce((s, h) => s + h, 0);
  const proys = PROY.filter(p => p.est === 'Activo' && p.eq.includes(k)).length, abiertas = xs.filter(a => a.st !== 'Terminado').length;
  const porRev = xs.filter(a => a.st === 'Necesita revisión').length, venc = xs.filter(vencida).length;
  return { dias, horas, tot, prog, hechas, ajW, ajAct: new Set(ajW.map(x => x.a.id)).size, proys, abiertas, porRev, venc, av: prog.length ? Math.round(hechas.length / prog.length * 100) : 0, ajTot: xs.reduce((s, a) => s + nAj(a), 0) };
}
const hfmt = h => { const m = Math.round(h * 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`; };
function renderEq() {
  const ws = add(lunes(HOY), FE.wk * 7), we = add(ws, 6), prev = add(ws, -7), gente = integrantes();
  const corte = FE.wk === 0 ? (new Date(HOY + 'T12:00:00').getDay() + 6) % 7 : 6;
  const datos = gente.map(k => { const pr = semanaDe(k, prev); pr.tot = pr.horas.slice(0, corte + 1).reduce((a, h) => a + h, 0); return { k, s: semanaDe(k, ws), p: pr }; });
  const T = datos.reduce((t, d) => ({ h: t.h + d.s.tot, prog: t.prog + d.s.prog.length, hechas: t.hechas + d.s.hechas.length, aj: t.aj + d.s.ajAct }), { h: 0, prog: 0, hechas: 0, aj: 0 });
  const DS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Equipo</h1><span class="date">Semana del ${fs(ws)} al ${fs(we)}</span>
      <div class="acts">
        <div class="wk"><button class="ib" id="ep" aria-label="Semana anterior">‹</button><button class="pill ${FE.wk ? '' : 'on'}" id="et">Esta semana</button><button class="ib" id="en" aria-label="Semana siguiente">›</button></div>
        <button class="btn dark" id="eadd"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Agregar integrante</button></div></div>
    <section class="band"><div><small>Resultados de la semana</small><h2>${FE.wk === 0 ? 'Así va el equipo esta semana' : FE.wk < 0 ? 'Así cerró el equipo esa semana' : 'Semana próxima'}</h2></div>
      <div class="kp" style="grid-template-columns:repeat(4,1fr)">
        <div class="kpi"><div class="l">Tiempo en plataforma</div><b>${hfmt(T.h)}</b><em>suma del equipo</em></div>
        <div class="kpi"><div class="l">Actividades de la semana</div><b>${T.hechas}/${T.prog}</b><em>terminadas</em></div>
        <div class="kpi"><div class="l">Con ajustes</div><b style="color:${T.aj ? '#E86A17' : ''}">${T.aj}</b><em>actividades devueltas</em></div>
        <div class="kpi"><div class="l">Cumplimiento</div><b>${T.prog ? Math.round(T.hechas / T.prog * 100) : 0}%</b><em>de lo programado</em></div></div></section>
    <div class="egal">${datos.map(({ k, s, p }) => { const P = PERS[k], dh = s.tot - p.tot, mx = Math.max(10, ...s.horas);
      const prox = A.filter(a => a.r === k && a.st !== 'Terminado').sort((a, b) => (a.f + a.h).localeCompare(b.f + b.h)).slice(0, 3);
      return `<button class="ecard" data-eq="${k}" style="--c:${P.c}"><div class="ec-h">${av(k, 46)}<div style="flex:1;min-width:0"><b>${esc(P.n)}</b><small>${esc(P.rol)} · ${esc(P.tipo)}</small></div><span class="btn sm" data-eedit="${k}">Editar</span></div>
        <div class="ec-st"><div><b>${s.proys}</b><small>Proyectos activos</small></div><div><b>${s.abiertas}</b><small>Actividades abiertas</small></div><div><b class="${s.porRev ? 'blue' : ''}">${s.porRev}</b><small>Por revisar</small></div><div><b class="${s.ajAct ? 'orange' : ''}">${s.ajAct}</b><small>Con ajustes en la semana</small></div></div>
        <div class="ec-time"><div class="et-h"><span>Tiempo en plataforma</span><b>${hfmt(s.tot)}</b>${FE.wk <= 0 ? `<em class="${dh >= 0 ? 'up' : 'down'}">${dh >= 0 ? '▲' : '▼'} ${hfmt(Math.abs(dh))} vs. ${FE.wk === 0 ? 'mismo corte de la semana anterior' : 'semana anterior'}</em>` : ''}</div>
          <div class="et-bars">${s.horas.map((h, i) => `<div class="${s.dias[i] === HOY ? 'today' : ''}"><i style="height:${h / mx * 100}%" title="${hfmt(h)}"></i><span>${DS[i]}</span></div>`).join('')}</div></div>
        <div class="ec-rep"><span>Reporte de hoy</span>${repChip(k, HOY)}<em>${(() => { const r = repSemana(k, ws); return `Semana: ${r.env} enviado(s) · ${r.auto} sin enviar`; })()}</em></div>
        <div class="ec-av"><div><span>Avance de la semana</span><b>${s.av}%</b></div><div class="pbar"><i style="width:${Math.max(s.av, 2)}%;background:${P.c}"></i></div><small>${s.hechas.length} de ${s.prog.length} actividades programadas · ${s.ajTot} ajuste(s) recibidos en total</small></div>
        <div class="ec-list">${prox.map(a => `<div class="ec-it"><i style="background:${pj(a.p).c}"></i><div><b>${esc(a.t)}</b><small>${esc(pj(a.p).n)} · ${a.st}</small></div><span class="kd ${vencida(a) ? 'late' : ''}">${a.f === HOY ? 'Hoy' : fs(a.f)} · ${a.h}</span></div>`).join('') || '<div class="sub">Sin actividades abiertas.</div>'}</div>
        <span class="icv-go">Ver desglose ›</span></button>`; }).join('')}</div>
    <p class="note">El tiempo en plataforma cuenta todo el tiempo que la plataforma permanece abierta en la computadora de cada colaborador, aunque no haya actividad. Los días con más de 12 horas se marcan para revisión.</p>`;
  const g = x => document.getElementById(x);
  (g('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  g('ep').onclick = () => { FE.wk--; render(); }; g('en').onclick = () => { FE.wk++; render(); }; g('et').onclick = () => { FE.wk = 0; render(); };
  g('eadd').onclick = () => eqForm();
  document.querySelectorAll('[data-eedit]').forEach(b => b.onclick = ev => { ev.stopPropagation(); eqForm(b.dataset.eedit); });
  document.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => eqDetalle(b.dataset.eq));
}
function eqDetalle(k) {
  const P = PERS[k], ws = add(lunes(HOY), FE.wk * 7), we = add(ws, 6), s = semanaDe(k, ws), mx = Math.max(10, ...s.horas), DS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const xs = A.filter(a => a.r === k);
  const ev = [];
  xs.forEach(a => { (a.aj || []).forEach((j, n) => { ev.push({ f: j.f, t: 'aj', txt: `Recibió el ajuste ${n + 1} en "${a.t}"`, d: j.com }); if (j.ini) ev.push({ f: j.ini.slice(0, 10), t: 'ini', txt: `Inició el ajuste ${n + 1} de "${a.t}"` }); if (j.fin) ev.push({ f: j.fin.slice(0, 10), t: 'fin', txt: `Entregó el ajuste ${n + 1} de "${a.t}"` }); });
    if (a.st === 'Terminado') ev.push({ f: a.f, t: 'ok', txt: `Terminó "${a.t}"` }); if (a.st === 'Necesita revisión') ev.push({ f: a.f, t: 'rev', txt: `Envió a revisión "${a.t}"` }); });
  INN.filter(n => n.r === k).forEach(n => n.av.forEach(x => ev.push({ f: x.f, t: 'inn', txt: `Avance en innovación: ${n.n}`, d: x.t })));
  INI.forEach(i => i.acc.filter(x => x.r === k && x.fel).forEach(x => ev.push({ f: x.fel, t: 'ini2', txt: `Elaboró la acción "${x.a}"`, d: i.n })));
  const evS = ev.filter(e => e.f >= ws && e.f <= we).sort((a, b) => b.f.localeCompare(a.f));
  const ICO = { aj: ['↺', '#E86A17'], ini: ['▶', '#E86A17'], fin: ['■', '#3C74D6'], ok: ['✓', '#2E9E62'], rev: ['⟳', '#3C74D6'], inn: ['★', '#C9962B'], ini2: ['◎', '#3C74D6'] };
  openSheet(`<div class="ed-cover" style="--c:${P.c}"><div class="sh-h" style="margin:0"><span class="chip">${esc(P.tipo)}</span><span class="chip">Semana del ${fs(ws)} al ${fs(we)}</span>${X}</div>
      <div class="ed-b">${av(k, 64)}<div><h2>${esc(P.n)}</h2><p>${esc(P.rol)}</p></div></div></div>
    <div class="dl" style="margin-top:12px"><div><small>Tiempo en plataforma</small><b>${hfmt(s.tot)}</b></div><div><small>Actividades de la semana</small><b>${s.hechas.length} de ${s.prog.length} terminadas</b></div><div><small>Con ajustes en la semana</small><b>${s.ajAct} actividad(es)</b></div><div><small>Ajustes recibidos en total</small><b>${s.ajTot}</b></div><div><small>Vencidas</small><b style="color:${s.venc ? 'var(--bad)' : ''}">${s.venc}</b></div></div>
    <div class="ed-cols">
      <section><h3 class="sh3">Tiempo por día</h3><p class="sub" style="font-size:11.5px;margin:-4px 0 8px">El conteo del día se detiene al enviar el reporte. Si vuelve a abrir la plataforma después, ese tiempo se muestra aparte como "después del cierre".</p><div class="ed-time">${s.horas.map((h, i) => `<div class="${s.dias[i] === HOY ? 'today' : ''}"><b>${h ? hfmt(h) : '—'}</b><span class="eb"><i style="height:${h / mx * 100}%;background:${P.c}"></i></span><small>${DS[i]} ${+s.dias[i].slice(8)}</small></div>`).join('')}</div></section>
      <section><h3 class="sh3">Actividades programadas en la semana</h3>${s.prog.length ? `<div class="rows">${s.prog.sort((a, b) => (a.f + a.h).localeCompare(b.f + b.h)).map(a => `<div class="rw"><span class="okc ${a.st === 'Terminado' ? 'yes' : 'pen'}">${a.st === 'Terminado' ? '✓' : '–'}</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m"><b>${DS[(new Date(a.f + 'T12:00:00').getDay() + 6) % 7]} ${fs(a.f)} · ${a.h}</b> · ${a.st}${nAj(a) ? ` · <span style="color:#B5530B;font-weight:600">${nAj(a)} ajuste(s)</span>` : ''}</div></div><span class="ppill" style="--c:${pj(a.p).c}"><i></i><span class="pn">${esc(pj(a.p).n)}</span></span></div>`).join('')}</div>` : '<div class="empty">Sin actividades programadas en esta semana.</div>'}</section>
    </div>
    <h3 class="sh3">Reportes de cierre del día</h3><div class="rlog">${Array.from({ length: 5 }, (_, i) => add(ws, i)).map(f => `<div class="rl"><b>${DS[(new Date(f + 'T12:00:00').getDay() + 6) % 7]} ${fs(f)}</b>${f > HOY ? '<span class="rchip na">Próximo</span>' : repChip(k, f)}${repDe(k, f) && repDe(k, f).com ? `<p>${esc(repDe(k, f).com)}</p>` : ''}${repDe(k, f) && repDe(k, f).bloq ? `<p class="blq">Apoyo: ${esc(repDe(k, f).bloq)}</p>` : ''}</div>`).join('')}</div>
    <h3 class="sh3">Avances de la semana</h3>${evS.length ? `<div class="tlx">${evS.map(e => `<div class="tx"><span class="tx-i" style="background:${ICO[e.t][1]}">${ICO[e.t][0]}</span><div><b>${esc(e.txt)}</b>${e.d ? `<p>${esc(e.d)}</p>` : ''}</div><small>${fs(e.f)}</small></div>`).join('')}</div>` : '<div class="empty">Sin avances registrados en esta semana.</div>'}
    <h3 class="sh3">Todas sus actividades abiertas</h3><div class="board" style="grid-template-columns:repeat(4,minmax(180px,1fr))">${['Pendiente', 'En progreso', 'Necesita revisión', 'Requiere ajustes'].map(st => { const ys = xs.filter(a => a.st === st); const c = COLS.find(x => x[0] === st)[1]; return `<div class="bc" style="--c:${c}"><div class="bh"><i></i>${st}<span>${ys.length}</span></div>${ys.map(a => `<div class="kc ${st === 'Requiere ajustes' ? 'prio' : ''}"><div class="kc-h"><span class="kd ${vencida(a) ? 'late' : ''}">${fs(a.f)} · ${a.h}</span></div><div class="kt">${esc(a.t)}</div><div class="km">${esc(pj(a.p).n)}</div></div>`).join('') || '<div class="bempty">Sin actividades</div>'}</div>`; }).join('')}</div>
    <div class="sh-f"><button class="btn" data-close>Cerrar</button></div>`, true);
}
const genClave = () => { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; const a = new Uint32Array(10); crypto.getRandomValues(a); return Array.from(a, x => c[x % c.length]).join('').replace(/^(.{4})(.{3})(.{3})$/, '$1-$2-$3'); };
function eqForm(k) {
  const P = k ? PERS[k] : { n: '', rol: '', c: PAL[Object.keys(EQ()).length % PAL.length], t: 'usuario', area: AREAS.find(a => a === 'Académico') || AREAS[0] }, maestra = !!PERS[S.yo].maestra;
  const tipos = [['usuario', 'Usuario'], ['admin', 'Administradora'], ['area', 'Área solicitante']];
  openSheet(`<div class="sh-h"><h2>${k ? 'Editar usuario' : 'Crear usuario'}</h2>${X}</div>
    <div class="fg"><label class="f"><span>Nombre</span><input class="in" id="qn" value="${esc(P.n)}" ${k ? 'disabled' : ''}></label><label class="f"><span>Rol o puesto</span><input class="in" id="qr" value="${esc(P.rol)}" ${maestra ? '' : 'disabled'}></label>
      ${k ? `<div class="f full"><span>Correo</span><div class="ro">${esc(P.email || '')}</div></div>` : '<label class="f full"><span>Correo</span><input class="in" type="email" id="qe" placeholder="nombre@grupoexponencial.com" autocomplete="off"></label>'}
      <label class="f"><span>Tipo de usuario</span><select class="in" id="qt" ${maestra && !(k && P.maestra) ? '' : 'disabled'}>${k && P.maestra ? '<option>Administradora maestra</option>' : tipos.map(([v, l]) => `<option value="${v}" ${P.t === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="f" id="qaw" style="${P.t === 'area' ? '' : 'display:none'}"><span>Área</span><select class="in" id="qa">${AREAS.map(a => `<option ${P.area === a ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select></label>
      ${maestra && !(k && P.maestra) ? `<div class="f full"><span>${k ? 'Nueva contraseña (déjala vacía para no cambiarla)' : 'Contraseña'}</span><div class="pwrow"><input class="in" type="text" id="qp" autocomplete="new-password" placeholder="Mínimo 8 caracteres" value="${k ? '' : genClave()}"><button type="button" class="btn sm" id="qgen">Generar</button><button type="button" class="btn sm" id="qcopy">Copiar</button></div></div>` : ''}
      ${maestra && !(k && P.maestra) ? fotoCampo(k, 'qfoto', k ? 'Se guarda al elegirla.' : 'Se guarda al crear el usuario.') : ''}
      ${k ? '' : `<div class="f full"><span>Color</span><div class="sws">${PAL.map(c => `<button type="button" class="sw ${P.c === c ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div></div>`}</div>
    ${maestra ? `<p class="sub">${k ? 'Si cambias la contraseña, compártela tú con la persona; no se le envía correo.' : 'Comparte el correo y la contraseña directamente con la persona; no se le envía correo.'}</p>` : '<p class="sub">Solo la administradora maestra puede crear usuarios, cambiar contraseñas y tipos de usuario.</p>'}
    <div class="sh-f"><button class="btn" data-close>Cancelar</button>${maestra && !(k && P.maestra) ? `<button class="btn dark" id="qok">${k ? 'Guardar' : 'Crear usuario'}</button>` : ''}</div>`);
  const g = x => document.getElementById(x);
  if (g('qt')) g('qt').onchange = () => { g('qaw').style.display = g('qt').value === 'area' ? '' : 'none'; };
  document.querySelectorAll('.sw').forEach(b => b.onclick = () => { P.c = b.dataset.c; document.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
  let fotoNueva = null;
  enlazarFoto('qfoto', async (blob, prev) => {
    if (k) { toast('Subiendo foto…'); await guardar(() => subirFoto(k, blob), 'Foto actualizada'); closeSheet(); render(); eqForm(k); }
    else { fotoNueva = blob; const pv = g('qfotoprev'); if (pv) pv.innerHTML = `<img src="${prev}" alt="">`; document.querySelector('[data-foto="qfoto"]').textContent = 'Cambiar foto'; }
  });
  if (g('qfotodel')) g('qfotodel').onclick = async () => { await guardar(() => quitarFoto(k), 'Foto eliminada'); closeSheet(); render(); eqForm(k); };
  if (g('qgen')) g('qgen').onclick = () => { g('qp').value = genClave(); };
  if (g('qcopy')) g('qcopy').onclick = async () => { const v = g('qp').value; if (!v) return; try { await navigator.clipboard.writeText(v); toast('Contraseña copiada'); } catch (e) { g('qp').select(); toast('Selecciónala y cópiala manualmente'); } };
  if (g('qok')) g('qok').onclick = async () => {
    const n = g('qn').value.trim(), rol = g('qr').value.trim(), t = g('qt').value, area = g('qa').value, pw = g('qp') ? g('qp').value.trim() : '';
    if (!n) { toast('Escribe el nombre.'); return; }
    if ((!k || pw) && pw.length < 8) { toast('La contraseña debe tener al menos 8 caracteres.'); return; }
    const b = g('qok'); b.disabled = true;
    try {
      if (k) { Object.assign(P, { rol, t, area: t === 'area' ? area : null }); await DB.perfilAdmin(k, P); if (pw) await DB.funcion('invitar', { accion: 'contrasena', id: k, password: pw }); toast(pw ? 'Usuario actualizado y contraseña cambiada' : 'Usuario actualizado'); }
      else { const email = g('qe').value.trim(); if (!email) { toast('Escribe el correo.'); b.disabled = false; return; } const r = await DB.funcion('invitar', { accion: 'crear', email, password: pw, nombre: n, rol, tipo: t, area, color: P.c });
        if (fotoNueva && r && r.id) { PERS[r.id] = PERS[r.id] || { n, c: P.c }; try { await subirFoto(r.id, fotoNueva); } catch (e) { toast('Usuario creado, pero la foto no se pudo subir: ' + e.message); } }
        toast(`Usuario creado. Comparte con ${n} su correo y contraseña.`); }
      closeSheet(); await recargar();
    } catch (e) { b.disabled = false; toast(e.message); }
  };
}
function miClave() {
  openSheet(`<div class="sh-h"><h2>Cambiar mi contraseña</h2>${X}</div>
    <div class="fg"><label class="f full"><span>Nueva contraseña</span><input class="in" type="password" id="mp1" autocomplete="new-password"></label><label class="f full"><span>Confirma la contraseña</span><input class="in" type="password" id="mp2" autocomplete="new-password"></label></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="mpok">Guardar</button></div>`);
  document.getElementById('mpok').onclick = async () => { const a = document.getElementById('mp1').value, b = document.getElementById('mp2').value;
    if (a.length < 8) { toast('Mínimo 8 caracteres.'); return; } if (a !== b) { toast('Las contraseñas no coinciden.'); return; }
    const { error } = await SB.auth.updateUser({ password: a }); if (error) { toast(error.message); return; } closeSheet(); toast('Contraseña actualizada'); };
}


/* =====================================================================
   DASHBOARD (solo administradoras)
   ===================================================================== */
// Actividades individuales (se detallarán en su propia pestaña)
const LOGO = 'data:image/webp;base64,UklGRsANAABXRUJQVlA4ILQNAACwPACdASqAAIAAPmEokEWkIiGWyTawQAYEsQBcFwCsnzS/fecDbv9dwCxv4ZH6p9gDoe88p5zl9CVrTxF8lHmr2vzlX3X/Of2P90POk7i37d6CP4r/J/7f+XH9rzxf2e+g/5/+4/kxzxeIB+YXGfUAPz1/nfZb/n//L/n/Oh+c/4T/uf5L4Bv5d/U/9t/d/aG9iH7g+y7+yP/3S3pHaRSyzC8KoMYa1+Z/0n5+YB/8b4eikd5rIXa2lRdnz4AyjMJNpu5/xHyX+LJK9JYbFeXSH8eZKrpSpk0b55ZnMDMnSzjdWl0YC2JZFkVdA3rSSQiq/tOwyC1128VHb4v/lV5B2PsNIt6qPZSw4CVHQ8uBxQ7oynT5lL/zzBJ+eTsSfQf/vj31TJ5QtwXYFb5jpSTj3D3R/nz5gBpnqJnDiBNbd2tdlmZtmeMfZCyZlCMJFIgTARrmv/lzLbYREYL/pBJz//0h/gWA2NZi+A6MmkTMZLZC3LqSm8MQwHDnsUOZai3kBlR9wz0hnKVdFr++lhuCY7yGcyLDjrCVizlmvsb0iE9PVGFOsqL7e2wQoqv/PE9mcYkbkFAfm3rv72E//p9icpXGUCdvlSy9Shnk47dcYvhuO9Oz1QDhcYSVqRhIFQQTLgcy1LKb2uvQ3buLWAD+/qB5oJomNa/5Mdz9CHCuJD+og7rU1QQpl4KrYZbUlYu4e9jHwgGb3TMOAclyrcmEYOhbcJlYYUtNGMQrs0kZL/oRmWtj2+oay8mrrYcTCXWBMaLjHPz9SiojHYqsKDlkwvadVib0+Fcv+mWZI8FbGvbCfGRnPgvu3vyaGlAcsjezgQoVZQwQu2t3ljnrjOmImB+X7b40SsH+6vnO5bK5UFxeqSqK9BhzsItXGNV6emwm1tWLWFIfM1Ygb9kgE9dd65/w2jPElRFXerXdOm3ToqQoUS6NRQnrSHND2KdXTX4Xs17vOxuNj5FE85V46UJ56v8oAOAKfvQpEfqnAInu4PPOhcqp7lP0rGd8R+9bb+VWBa7kF7x63S4Y/8CKmQFFUKA2hKmA2AJTRs3FT3HMPsHVPvWPE3gWeagerQ0ZVf+qaDdpMbazcjTu2NnHzSW/EIFRfFnjcwEMgnRV8BOBXfAiMS/QDyunupijEqXGTw1ij2uTSHunluimsXRrkGo//OcZXIGQSNIZ9fKSJJVR0KSzRpfUrzMkEF9YtGreZjj97wX5x9v2z5HYTuyllaSw1h81c3NZVPqUCe2gjFx3LWekmEkHpOX5tRXb1AMLJTRlzmOJxVnR7IHSf2SIgOm3+LGMff18Syxvf5efb+dGmBolM1grh7MVE+o1MWyI1mHQK4fwJv8u2mcb5EQXsSmHeCYmX7wxBJ5eZ6MWWXHKofZat1uZV9i7YpdHKn46oD9ial+DuuqpHib7ZL4u+sGO1kYSc7IB8MgYgfD/6BJPEMRVNwtPk9JxvVectwPQ3X9zR659L+of8jS3D8br6UB5vQ5DV65MCFQST+Ar5eaJIhH1gAWVkQg81nY6W06EMrvo/8kvjgz7b/55oc5vDme/QuL3QVqb0/9qFEs+H+w5Zw+w542jGma1Rnl5dYbnaWVAEyabRILU7crvPk4cUx5nYAbGKIloLwKlWc0SYe3RzhsOjBWR8dF2UxlIPeOQaZJkrlm44Q0kp49LLCinfhVDzMe4ag4yR59Oz8kizLXFtJPcDAQTH4nhM5zsi1XXlLZX6mHbXQ78b4A0XLVGkwmJOJ0IxM+X2cBzkNhz+NYJRAIETJIF3WQyPkCy5MGb0Vj0EbkNV226zJjsXG+pdCbYgukalKDo2mZwEqKC1JY7E0gG0AXKLLUZ2UrdEu1wqGMrU476l2C5uTzCiocPLnyZfeeA52XA0Aj0AZsGAopBQs0nH4+PE/37lKj+6jQnzbocKsVPMOYv/X4TjSHnmfsOa/870IE+74HIXMRQAzYx0qjRqZtBGLZAOKQw+kfxLdsODbo05bTdxpaBw1c6lUzQQ+jHGV3/ey9DNiJeUJZJd/O6xOeMdeFmJ03gQCe5kxsOvbzocTTT12CvK3GR08EAuAVbvkZR5CRQuDpEz0yyUoyHIz7INGYojgaZxE01ZA3UNcoZZbyEXtxtBpZR1n+NtJxMcDPnqNBw7mNxF116YXY7olr7mvR2botrt7j5pxho8aQzRCbIgBTDsAd1v3w4snyTlikGHDLf/ucp/N9RHRQTcT4YIESeYxnUHBFbfpFny5MEjMsH/mg7/w6+I6tj3xy+WH7q2bFNTvf4cyPMFZ2SYjDla/WGY2+m7odjElxgrG/YBN7ZSfbjHLxHQ2AgWyCxWDWUOarj9O9fV9unDwEkJCon8Sd9Xir9vha0WW0NUgyj13VlqE/zkzqW5kjQSrvv5WuY0TTg3LGAhDbwuL8XLHQyrjxr9/0wUZtkcFfDBMpZ8eiUo06t2Tp2xQH/I7EPF2CTZtEC2XebatwWL0Z7riqAerLtGF8Vf4yhXYf3rlHfcAocc2/WdfbOz1fVUywOz4Jtp1i/PpEOKNWTHO4/fcdZUf8F2vJg+UW4zVopFACeme2QvL0pVO9eqYvkPGaZP5Osk96a/s7xjrCNQvmT8GlTFCYUq/AayRiRNJ7glAwrcFKmpxtYVq1V/i1Ta/tPl7E6ogFh7IHFE5uUny9mrgTe/4Ml+0QQzuKre8/j8NR352X7/B+FZG9xfin976F2e2uiSlMcJXIqBRL6nEg4KRRwprSCu1jsYy/ReVRgFRDz9kf9LZBWfjt/MZ+ECh6di8/Gh8T5KqBYIWIy4VTDJA01ksFHmFvWqW6QThuQ6ahkj4C1xzZHmdS7LXkaukMN1nv+Gm/atYzCD38y8hbwTcQvKeS3BerOUs1vaeXaPl1lzkl/TLVa/Ku1X2h9I0FNZNpTdLQKHn/C+DFi9CVu6b5f/IcvPsyr80JgloKbJ5UM8zFUVW8VsR4beqDjz3RHQQj7nB1aFyAV3lL1omd9X8SJZX9bPF8f8S2wN2h09bhgIyYqsye/SxDPgfyGiGPzip0go95uZY+DFcG2kylntsqMaVznQNYYrPA21P4Vin2CC3Xjx450pVdYLnx7JDdFVLoGbGRGa8t0ZeNUNM61nhRXvsBP/U1WGvtsEO3iy9bRoolO8X3M+j37qxvxit2L8b5YFNYLKu86jw2NE0yySgMbjFhfaCNI+eqElizp14o9dEc1W53d2G3ezVtbzOu6mBsoBH/+Q7MdzNevYTVzzPogPSVzwMAS4S1zJmg7q2XhzQNSesoK11ps+WJ7O3xLk7hh8DXbqWjGRjWyX0geJTcNZS2V6pSZYwcdMSmXzJmvxuXo0pt0duvukqyiid3rAlg8FywLfuygn4DaS3+1SKsCsPKgjTsL0XXdmDPXOXcHe7aMVtQUhuV7q89Coe9gMd+U8HSffgTr/HvISVJTj3XeupmcveH82gblHCosTrjPY+3ol9lcCL/lJHbz/CZgVBeKpyG9gtyt2KSNja6uXpzzoEDc7huav8UweaDgoET3Nga5egEFPBobR5Jw3QRt3huSnfWEfWe46P35K0Ttl+UamU/EILCk8qfWqR5Cw6Rj7wYUNlPyJDucBSWhJhPDud4Qfuy+huXq/8WstFqiwK0WK9w7I9E6qNlndzkiXHdjTdDeKs3A2hpe0lPRaWevvt4ryQ3sDnxo7eJRolczZUPHOh3LaGFrEHwK1eNpieC9kCibKTC4B+w++vK2sud1L8cCzKI3DBM9BuCGFRq+OBzs4HXVv+PGz7c2JrubrIQzLnDigSyrfeEDPwG+dFJwLiEao8N36zeQx22/7zrMMPjm6l0ASt1/V98CMrKLobLWTw0/XRSnsORmZoJ8BAZwImy/zQnL66OwORvqppMNc1/YhjQ7r/hZiTbqBe5QbSxY1h7BEpzFQDTc1iQhx/QH3NG2rVw6nCv35JmIPsoPDL9H3MGT1jy6rm5faak2AswwfZArF6M3+uV37XDxUXMLeiZ4VlaPumSc94lrtns8Aw2AcwIVRSIV8CFH7BQlQ88POX8z0VtI+XAy0SK0/YW74ymsr2L6hsdyyGmcvejBq/BRqRKGokghVZDCU34XzLSUybL131Nybaik8keqEy5asGe/Xszzun9mr6NPB8w+7GDKsmgOV4uNIM3xfPdXnzLY771hJH5OaR93HtKs/b5QLrq31YwZyzWm3oWGvvf0w/FWsMlZWj5NqakNOkK/6yvY471XofDpsbCLBR6oX0C+uDdn8Rpw76GMqmDzlCFp8L3SV6c9aGnYXsuO8iP0773/+ILUxcOum1aK66uYox0MEyZWZ0gk3rqCX5CEa0V0gfyR7JPFxYm9csJTvrS+BCV4OTbQdt/XgIPfOY9dZass/fEYbPZIeerY8HeaZ2gAH/GN5HTdTLGQtupDsSx3KxnWjAurjWrJx0vyx5fMiUVhomsRd3kk0rxGFTi76Nn3T1sb2Aun2infefUe+ru6OFxpIsrCXCqkaCV5O0NyHCD0WL5fj04TNsbDItpEKyJqYUgV8/dIpsDwBprmIp9/7o+//ZqTHikLvm+DQ1Es2i9CgzAWM8kkx9Aizw6CmylKFXOpNTa81eNBqtNYFhSLNaf5f12Jbgg//Wt17fLr8GFJh81X1PQDNrg30Bro5qcdt6vA6SRmrmxzXs1pvi9Y3QAA';
const IND = [];
const TIPOS5 = [...TIPOS, 'Actividades individuales'];
const TCOL = { 'Investigación': '#7A4CE0', 'Implementación': '#8C2341', 'Automatización': '#3C74D6', 'Desarrollo de Recursos': '#E86A17', 'Actividades individuales': '#C25B76' };
const FD = { mo: 0 };
const metaTag = (v, m) => v >= m + 2 ? ['Arriba de la meta', 'up'] : v >= m - 2 ? ['En la meta', 'on'] : ['Debajo de la meta', 'down'];
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const enMes = (f, m0, m1) => f && f >= m0 && f <= m1;
function calcDash() {
  const base = new Date(HOY.slice(0, 8) + '01T12:00:00'); base.setMonth(base.getMonth() + FD.mo);
  const m0 = iso(base), m1 = iso(new Date(base.getFullYear(), base.getMonth() + 1, 0, 12)), R = m1 < HOY ? m1 : HOY;
  const acts = [...A.map(a => ({ ...a, ind: false })), ...IND.map(a => ({ ...a, ind: true, fdone: a.st === 'Terminado' ? (a.doneH && a.doneH > a.fH ? add(a.f, 1) : a.f) : undefined }))];
  // KPI 1 · Cumplimiento en fecha
  const vencen = acts.filter(a => enMes(a.f, m0, m1) && a.f <= R), aTiempo = vencen.filter(a => a.st === 'Terminado' && (a.fdone || a.f) <= a.f);
  // KPI 2 · Salud del portafolio
  const abiertas = acts.filter(a => a.st !== 'Terminado'), enTiempo = abiertas.filter(a => a.f >= R), vencAb = abiertas.filter(a => a.f < R);
  const tarde = acts.filter(a => a.st === 'Terminado' && enMes(a.fdone, m0, m1) && a.fdone > a.f), venc = vencAb.length + tarde.length;
  // KPI 3 y 4 · proyectos terminados al corte
  const term = PROY.filter(p => p.est === 'Terminado' && p.fter && enMes(p.fter, m0, m1) && p.fter <= R), impl = term.filter(p => p.imp && p.imp.impl), val = term.filter(p => p.imp && p.imp.final);
  return { m0, m1, R, acts, k1: { v: pct(aTiempo.length, vencen.length), a: aTiempo.length, b: vencen.length }, k2: { v: pct(enTiempo.length, enTiempo.length + venc), activos: enTiempo.length + venc, tiempo: enTiempo.length, venc, vencAb: vencAb.length, tarde: tarde.length },
    k3: { v: pct(impl.length, term.length), a: impl.length, b: term.length }, k4: { v: pct(val.length, term.length), a: val.length, b: term.length } };
}
function flujo(items) {
  return [['Solicitudes recibidas', items.length], ['Proyectos aprobados', items.filter(x => x.k === 'p').length], ['En ejecución', items.filter(x => x.ej).length], ['Soluciones implementadas', items.filter(x => x.im).length], ['Impacto validado', items.filter(x => x.va).length]];
}
function itemsFlujo(m0, m1, mensual) {
  const ps = PROY.map(p => { const xs = A.filter(a => a.p === p.id); return { k: 'p', f: p.fsol, fin: p.comp, ej: p.est === 'Terminado' || xs.some(a => a.st !== 'Pendiente'), im: p.est === 'Terminado', va: !!(p.imp && p.imp.final) }; });
  const is = IND.map(a => ({ k: 'i', f: a.fsol, fin: a.f, ej: a.st !== 'Pendiente', im: a.st === 'Terminado', va: false }));
  const all = [...ps, ...is].filter(x => x.f <= m1);
  return mensual ? all.filter(x => x.f >= m0 && x.fin <= m1) : all;
}
function donut(segs, total) {
  const R = 54, C = 2 * Math.PI * R; let off = 0;
  return `<svg viewBox="0 0 140 140" class="donut" role="img" aria-label="Distribución de proyectos activos">${segs.filter(s => s.v).map(s => { const len = s.v / total * C, el = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${s.c}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"><title>${s.n}: ${s.v}</title></circle>`; off += len; return el; }).join('') || `<circle cx="70" cy="70" r="${R}" fill="none" stroke="var(--card-2)" stroke-width="22"/>`}
    <text x="70" y="66" text-anchor="middle" class="dn-b">${total}</text><text x="70" y="84" text-anchor="middle" class="dn-s">activos</text></svg>`;
}
function renderDash() {
  const D = calcDash(), actual = FD.mo === 0, mesTxt = `${MES[+D.m0.slice(5, 7) - 1].replace(/^./, c => c.toUpperCase())} ${D.m0.slice(0, 4)}`;
  const IC = {
    k1: '<path d="M8 3v3M16 3v3M4 9h16"/><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M9 15l2 2 4-4"/>',
    k2: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>',
    k3: '<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>',
    k4: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    s1: '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>', s2: '<path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="3"/>',
    s3: '<circle cx="12" cy="12" r="8"/><path d="M10 9l5 3-5 3z"/>', s4: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.9.7 1.5 1.7 1.5 2.8V17h4v-.3c0-1.1.6-2.1 1.5-2.8A6 6 0 0 0 12 3z"/>',
    s5: '<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7"/>'
  };
  const svgI = p => `<svg viewBox="0 0 24 24">${p}</svg>`;
  const kt = (n, t, v, meta, det, sin) => { const tg = sin ? ['Sin datos', 'na'] : metaTag(v, meta); return `<div class="dz-k ${tg[1]}" title="${esc(det)}"><div class="dz-kh"><span class="dz-ki">${svgI(IC['k' + n])}</span><b>${t}</b></div><div class="dz-kv">${sin ? '—' : v + '%'}</div><div class="dz-km">Meta mensual ${meta}%</div><span class="dz-tag ${tg[1]}">${tg[1] === 'up' ? '▲ ' : tg[1] === 'down' ? '▼ ' : tg[1] === 'on' ? '● ' : ''}${tg[0]}</span></div>`; };
  const fm = flujo(itemsFlujo(D.m0, D.m1, true)), fa = flujo(itemsFlujo(D.m0, D.m1, false));
  const chev = arr => `<div class="dz-chev">${arr.map(([n, v], i) => `<div class="dz-c c${i}" title="${n}: ${v}"><b>${v}</b></div>`).join('')}</div>`;
  const pAct = PROY.filter(p => p.est === 'Activo'), pT = pAct.filter(p => p.comp >= D.R).length, pV = pAct.length - pT;
  const fun = [pAct.length + D.k2.activos, pT + D.k2.tiempo, pV + D.k2.venc];
  const desg = PROY.filter(p => p.est === 'Activo').map(p => { const xs = A.filter(a => a.p === p.id), t = xs.filter(a => a.st === 'Terminado').length; return { p, n: xs.length, t, v: pct(t, xs.length) }; }).sort((a, b) => a.p.comp.localeCompare(b.p.comp));
  const dist = TIPOS5.map(t => t === 'Actividades individuales' ? { n: t, c: TCOL[t], v: IND.filter(a => a.st !== 'Terminado').length } : { n: t, c: TCOL[t], v: pAct.filter(p => p.tipo === t).length });
  const totD = dist.reduce((s, x) => s + x.v, 0);
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Dashboard</h1><span class="date">${mesTxt}${actual ? ` · corte al ${fs(HOY)}` : ' · cierre de mes'}</span>
      <div class="acts">
        <div class="wk"><button class="ib" id="dp" aria-label="Mes anterior">‹</button><button class="pill ${actual ? 'on' : ''}" id="dt">Este mes</button><button class="ib" id="dn" aria-label="Mes siguiente" ${actual ? 'disabled' : ''}>›</button></div>
        <button class="btn" id="djunta"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>Resumen para junta semanal</button>
        <button class="btn dark" id="drep"><svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>Enviar reporte por correo</button></div></div>
    <section class="dz">
      <div class="dz-head"><span class="dz-logo"><img src="${LOGO}" alt="" width="42" height="42"></span><div><h2>Innovación &amp; Disrupción</h2><small>${mesTxt} · ${actual ? `actualizado al ${fs(HOY)}` : 'cierre del mes'}</small></div></div>
      <div class="dz-r1">
        <div class="dz-p"><span class="dz-pt">General</span><div class="dz-kg">
          ${kt(1, 'Cumplimiento en fecha', D.k1.v, META.k1, `${D.k1.a} de ${D.k1.b} actividades a tiempo`, !D.k1.b)}${kt(2, 'Salud del portafolio', D.k2.v, META.k2, `${D.k2.tiempo} en tiempo y ${D.k2.venc} vencidas`, !D.k2.activos)}
          ${kt(3, 'Tasa de implementación', D.k3.v, META.k3, `${D.k3.a} de ${D.k3.b} proyectos terminados en el mes ya en implementación`, !D.k3.b)}${kt(4, 'Impacto validado', D.k4.v, META.k4, `${D.k4.a} de ${D.k4.b} proyectos terminados en el mes con impacto validado`, !D.k4.b)}</div></div>
        <div class="dz-p"><span class="dz-pt">Flujo general acumulado</span>${chev(fa)}<span class="dz-pt" style="margin-top:12px">Flujo general mensual</span>${chev(fm)}
          <div class="dz-stg">${fa.map(([n], i) => `<div><span class="dz-si c${i}">${svgI(IC['s' + (i + 1)])}</span><b><span class="lg">${n}</span><span class="shn">${['Solicitudes', 'Aprobados', 'Ejecución', 'Implementados', 'Validados'][i]}</span></b></div>`).join('')}</div></div>
      </div>
      <div class="dz-r2">
        <div class="dz-p"><div class="dz-ph"><span class="dz-pt">Salud del portafolio</span><span class="dz-sub">Proyectos y actividades</span></div>
          <div class="dz-fun">${[['Activos', fun[0], 'f0'], ['En tiempo', fun[1], 'f1'], ['Vencidos', fun[2], 'f2']].map(([n, v, c]) => `<div class="dz-fr"><div class="dz-fz ${c}"><span>${n}</span></div><b class="dz-fn ${c}">${v}</b><em>${pct(v, fun[0])}%</em></div>`).join('')}</div>
          <p class="dz-note">Salud combinada: <b>${pct(fun[1], fun[0])}%</b> en tiempo. El KPI 2 se calcula solo con actividades (<b>${D.k2.v}%</b>).</p></div>
        <div class="dz-p"><span class="dz-pt">Distribución del portafolio</span><div class="dz-dist">${donut(dist, totD).replace('activos</text>', 'activos</text>')}
          <div class="dz-dl">${dist.map(x => `<div><i style="background:${x.c}"></i><span>${x.n}</span><b>${x.v}</b><em>${pct(x.v, totD)}%</em></div>`).join('')}</div></div></div>
      </div>
      <div class="dz-p"><div class="dz-ph"><span class="dz-pt">Desglose de proyectos</span><span class="dz-sub">${desg.length} proyecto(s) activos</span></div>
        <div class="dz-tw"><table class="dz-tab"><thead><tr><th class="c">No.</th><th>Proyecto</th><th class="c">Actividades</th><th class="c">Terminadas</th><th>Avance</th></tr></thead><tbody>
        ${desg.map((d, i) => `<tr data-pj="${d.p.id}"><td class="c">${i + 1}</td><td><span class="dz-pn"><i style="background:${d.p.c}"></i>${esc(d.p.n)}</span></td><td class="c"><b>${d.n}</b></td><td class="c"><b>${d.t}</b></td><td><div class="dz-av"><div class="dz-bar"><i style="width:${Math.max(d.v, 2)}%;background:${d.p.c}"></i></div><b>${d.v}%</b></div></td></tr>`).join('') || '<tr><td colspan="5" class="c">Sin proyectos activos.</td></tr>'}</tbody></table></div></div>
    </section>
    <p class="note">Pasa el cursor sobre cada KPI para ver su detalle. Lo que no tiene fecha de entrega dentro del mes pasa al flujo acumulado al cerrar el mes.</p>`;
  const g = x => document.getElementById(x);
  (g('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  g('dp').onclick = () => { FD.mo--; render(); }; g('dt').onclick = () => { FD.mo = 0; render(); }; g('dn').onclick = () => { if (FD.mo < 0) { FD.mo++; render(); } };
  g('djunta').onclick = () => junta(D);
  g('drep').onclick = () => { openSheet(`<div class="sh-h"><h2>Enviar reporte por correo</h2>${X}</div><p class="sub">Reporte de indicadores de ${mesTxt}${actual ? ` con corte al ${fs(HOY)}` : ''}: el correo con el dashboard y el Excel de avance de indicadores adjunto.</p>
      <div class="f full" style="margin-top:10px"><span style="font-size:12px;font-weight:600;color:var(--ink-2)">Enviar a</span><div class="opts" id="rto" style="margin-top:6px">${Object.entries(EQ()).filter(([, x]) => x.admin).map(([k, x]) => `<button type="button" class="opt on" data-k="${k}">${x.n} · ${x.rol}</button>`).join('')}</div></div>
      <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="rok">Enviar</button></div>`);
    document.querySelectorAll('#rto .opt').forEach(b => b.onclick = () => b.classList.toggle('on'));
    document.getElementById('rok').onclick = async () => { const ids = [...document.querySelectorAll('#rto .opt.on')].map(b => b.dataset.k); if (!ids.length) { toast('Elige al menos un destinatario.'); return; }
      const bt = document.getElementById('rok'); bt.disabled = true; bt.textContent = 'Enviando…';
      const kx = (k, det, sin) => ({ v: D[k].v, det, sin });
      const payload = { destinatarios: ids, mes: mesTxt, corte: actual ? `Corte al ${fs(HOY)}` : 'Cierre de mes', metas: META,
        k: { k1: kx('k1', `${D.k1.a} de ${D.k1.b} actividades a tiempo`, !D.k1.b), k2: kx('k2', `${D.k2.tiempo} en tiempo y ${D.k2.venc} vencidas`, !D.k2.activos), k3: kx('k3', `${D.k3.a} de ${D.k3.b} proyectos terminados ya en implementación`, !D.k3.b), k4: kx('k4', `${D.k4.a} de ${D.k4.b} proyectos terminados con impacto validado`, !D.k4.b) },
        fa: fa.map(x => x[1]), fm: fm.map(x => x[1]), fun, dist: dist.map(x => ({ n: x.n, c: x.c, v: x.v })),
        desg: desg.map(d => ({ n: d.p.n, c: d.p.c, tipo: d.p.tipo, inst: d.p.inst, area: d.p.area, comp: d.p.comp, act: d.n, ter: d.t, av: d.v })),
        acts: D.acts.filter(a => enMes(a.f, D.m0, D.m1)).map(a => ({ tipo: a.ind ? 'Individual' : 'Proyecto', proyecto: a.ind ? 'Actividad individual' : pj(a.p).n, actividad: a.t, responsable: (PERS[a.r] || {}).n || '', entrega: a.f, estado: a.st, terminada: a.st === 'Terminado' ? (a.fdone || '') : '', aTiempo: a.st === 'Terminado' ? ((a.fdone || a.f) <= a.f ? 'Sí' : 'No') : '' })),
        term: PROY.filter(p => p.est === 'Terminado' && enMes(p.fter, D.m0, D.m1)).map(p => ({ n: p.n, tipo: p.tipo, area: p.area, fter: p.fter, impl: (p.imp && p.imp.impl) || '', valor: (p.imp && p.imp.valor) || '', validado: p.imp && p.imp.final ? 'Sí' : 'No' })) };
      try { await DB.funcion('indicadores', payload); closeSheet(); toast('Reporte de indicadores enviado con el Excel adjunto.'); } catch (e) { bt.disabled = false; bt.textContent = 'Enviar'; toast(e.message); } }; };
  document.querySelectorAll('.dz-tab [data-pj]').forEach(r => r.onclick = () => proyecto(r.dataset.pj));
}
function junta(D) {
  const ws = lunes(HOY), we = add(ws, 6), acts = D.acts;
  const venc = acts.filter(a => a.st !== 'Terminado' && a.f < HOY), sem = acts.filter(a => a.f >= ws && a.f <= we), hechas = sem.filter(a => a.st === 'Terminado');
  const ajs = A.flatMap(a => (a.aj || []).filter(j => j.f >= ws && j.f <= we).map(j => ({ a, j }))), porVal = PROY.filter(p => p.est === 'Terminado' && !(p.imp && p.imp.final));
  const innS = INN.filter(n => n.sem === ws), iniT = INI.filter(i => i.t === trim(HOY));
  const tag = (v, m) => `<span class="mtag ${metaTag(v, m)[1]}">${v}% · ${metaTag(v, m)[0].toLowerCase()}</span>`;
  openSheet(`<div class="sh-h"><h2>Resumen para la junta semanal</h2>${X}</div><p class="sub">Semana del ${fs(ws)} al ${fs(we)} · listo para revisar con Dirección</p>
    <div class="jn"><section><h3>1. KPIs del mes</h3><ul><li>Cumplimiento en fecha: ${tag(D.k1.v, META.k1)}</li><li>Salud del portafolio: ${tag(D.k2.v, META.k2)}</li><li>Tasa de implementación: ${tag(D.k3.v, META.k3)}</li><li>Impacto validado: ${tag(D.k4.v, META.k4)}</li></ul></section>
      <section><h3>2. Avance de la semana</h3><ul><li>${hechas.length} de ${sem.length} actividades programadas terminadas.</li><li>${ajs.length} ajuste(s) solicitados en la semana.</li><li>${venc.length} actividad(es) vencidas por atender.</li></ul></section>
      <section><h3>3. Vencidas por atender</h3>${venc.length ? `<ul>${venc.slice(0, 8).map(a => `<li><b>${esc(a.t)}</b> · ${esc(PERS[a.r].n)} · venció ${fs(a.f)}</li>`).join('')}</ul>` : '<p class="sub">Sin vencidas.</p>'}</section>
      <section><h3>4. Impacto por validar</h3>${porVal.length ? `<ul>${porVal.map(p => `<li><b>${esc(p.n)}</b> · ${esc(p.area)} · terminado el ${fs(p.fter)}</li>`).join('')}</ul>` : '<p class="sub">Todo validado.</p>'}</section>
      <section><h3>5. Innovación de la semana</h3>${innS.length ? `<ul>${innS.map(n => `<li><b>${esc(PERS[n.r].n)}:</b> ${esc(n.n)} (${esc(n.est.toLowerCase())})</li>`).join('')}</ul>` : '<p class="sub">Sin propuestas registradas.</p>'}</section>
      <section><h3>6. Iniciativas del trimestre</h3>${iniT.length ? `<ul>${iniT.map(i => `<li><b>${esc(i.n)}:</b> ${avIni(i)}% de avance</li>`).join('')}</ul>` : '<p class="sub">Sin iniciativas definidas.</p>'}</section></div>
    <div class="sh-f"><button class="btn" data-close>Cerrar</button><button class="btn" onclick="window.print()">Imprimir</button><button class="btn dark" id="jsend">Enviarme por correo</button></div>`, true);
  document.getElementById('jsend').onclick = () => toast('En el sitio real te llegará este resumen por correo, listo para reenviar.');
}


/* =====================================================================
   ACTIVIDADES INDIVIDUALES (todo el equipo)
   ===================================================================== */
const MEDIOS_E = ['Correo', 'Drive', 'Plataforma', 'Mensaje', 'En persona'];
const FIx = { tab: 'Abiertas', area: '', resp: '', sup: '', todo: false };
const dtTxt = s => s ? `${fs(s.slice(0, 10))} · ${s.slice(11, 16)}` : '—';
const nowDT = () => { const d = new Date(); return `${HOY}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const indVenc = a => a.st !== 'Terminado' && !['Necesita revisión'].includes(a.st) && a.fH < nowDT();
const ICOL = { 'Pendiente': '#8A9BA6', 'En progreso': '#D99A12', 'Necesita revisión': '#3C74D6', 'Requiere ajustes': '#E86A17', 'Terminado': '#2E9E62' };
const stChip = st => `<span class="ichip" style="--c:${ICOL[st]}">${st}</span>`;
// Completar los datos de ejemplo con los campos de registro

function renderInd() {
  const yo = PERS[S.yo], todos = yo.admin && FIx.todo;
  const base = IND.filter(a => todos || a.r === S.yo || a.aut === S.yo);
  const porAut = IND.filter(a => a.aut === S.yo && a.st === 'Necesita revisión');
  const mes0 = HOY.slice(0, 8) + '01', mias = IND.filter(a => todos || a.r === S.yo);
  const termMes = mias.filter(a => a.st === 'Terminado' && a.fdone >= mes0), aTiempo = termMes.filter(a => (a.doneH || a.fdone) <= a.fH);
  const list = base.filter(a => (FIx.tab === 'Abiertas' ? a.st !== 'Terminado' : a.st === 'Terminado') && (!FIx.area || a.area === FIx.area) && (!FIx.resp || a.r === FIx.resp) && (!FIx.sup || (FIx.sup === 'si') === a.sup))
    .sort((a, b) => FIx.tab === 'Abiertas' ? a.fH.localeCompare(b.fH) : (b.doneH || '').localeCompare(a.doneH || ''));
  const kpi = (l, v, s, c) => `<div class="kpi"><div class="l">${l}</div><b style="${c ? `color:${c}` : ''}">${v}</b><em>${s}</em></div>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Actividades individuales</h1><span class="date">Solicitudes que requieren una sola acción</span>
      <div class="acts">
        <button class="btn dark" id="xnew"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nueva actividad</button></div></div>
    <section class="band"><div><small>${todos ? 'Todo el equipo' : 'Tus actividades'}</small><h2>${todos ? 'Solicitudes de las áreas al equipo' : 'Lo que te pidieron las áreas'}</h2>${yo.admin ? `<div class="seg" id="xscope" style="margin-top:10px"><button data-v="0" class="${FIx.todo ? '' : 'on'}">Mis actividades</button><button data-v="1" class="${FIx.todo ? 'on' : ''}">Todo el equipo</button></div>` : ''}</div>
      <div class="kp" style="grid-template-columns:repeat(4,1fr)">${kpi('Abiertas', mias.filter(a => a.st !== 'Terminado').length, `${mias.filter(indVenc).length} vencida(s)`, mias.filter(indVenc).length ? 'var(--bad)' : '')}${kpi('Por autorizar', porAut.length, 'te toca revisar', porAut.length ? 'var(--info)' : '')}${kpi('Terminadas en el mes', termMes.length, 'entregadas')}${kpi('A tiempo', `${termMes.length ? Math.round(aTiempo.length / termMes.length * 100) : 0}%`, 'de las terminadas en el mes')}</div></section>
    ${porAut.length ? `<section class="card authz"><div class="ch"><h3>Por autorizar</h3><span class="badge r" style="background:color-mix(in srgb,var(--info) 14%,transparent);color:var(--info)">${porAut.length}</span></div><div class="rows">${porAut.map(a => `<div class="rw xrow" data-x="${a.id}"><span class="okc pen">!</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m"><b>${esc(PERS[a.r].n)}</b> la entregó el ${dtTxt(a.doneH)} · ${esc(a.area)}</div></div><span class="btn sm">Revisar</span></div>`).join('')}</div></section>` : ''}
    <div class="tools"><div class="seg" id="xtab">${['Abiertas', 'Terminadas'].map(t => `<button data-t="${t}" class="${FIx.tab === t ? 'on' : ''}">${t} · ${base.filter(a => t === 'Abiertas' ? a.st !== 'Terminado' : a.st === 'Terminado').length}</button>`).join('')}</div>
      <select class="fsel" id="xarea"><option value="">Área: todas</option>${AREAS.map(x => `<option ${FIx.area === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
      ${todos ? `<select class="fsel" id="xresp"><option value="">Responsable: todos</option>${Object.entries(EQ()).map(([k, p]) => `<option value="${k}" ${FIx.resp === k ? 'selected' : ''}>${p.n}</option>`).join('')}</select>` : ''}
      <select class="fsel" id="xsup"><option value="">Supervisión: todas</option><option value="si" ${FIx.sup === 'si' ? 'selected' : ''}>Con supervisión</option><option value="no" ${FIx.sup === 'no' ? 'selected' : ''}>Sin supervisión</option></select></div>
    ${list.length ? `<div class="xlist">${list.map(a => { const v = indVenc(a); return `<button class="xcard ${v ? 'late' : ''} ${a.st === 'Requiere ajustes' ? 'adj' : ''}" data-x="${a.id}"><div class="xc-l">${av(a.r, 34)}</div>
        <div class="xc-m"><div class="xc-t">${esc(a.t)}</div><div class="xc-s"><span class="xarea">${esc(a.area)}</span><span>Solicita: <b>${esc(a.sol)}</b></span><span>${a.sup ? `Autoriza: <b>${esc(PERS[a.aut].n)}</b>` : 'Sin supervisión'}</span>${a.aj.length ? `<span class="kn">${a.aj.length} ajuste(s)</span>` : ''}</div></div>
        <div class="xc-d"><small>Pedida</small><b>${dtTxt(a.fsolH)}</b></div><div class="xc-d"><small>${a.st === 'Terminado' ? 'Terminada' : 'Entrega'}</small><b class="${v ? 'latet' : ''}">${a.st === 'Terminado' ? dtTxt(a.doneH) : dtTxt(a.fH)}</b></div>
        <div class="xc-st">${stChip(a.st)}${v ? '<small class="latet">Vencida</small>' : a.st === 'Terminado' && a.doneH > a.fH ? '<small class="latet">Entregada tarde</small>' : ''}</div></button>`; }).join('')}</div>`
      : `<div class="empty">${FIx.tab === 'Abiertas' ? 'No hay actividades abiertas. Registra una con "Nueva actividad".' : 'Aún no hay actividades terminadas.'}</div>`}`;
  const g = x => document.getElementById(x);
  (g('as') || {}).onchange = e => { S.yo = e.target.value; FIx.resp = ''; render(); };
  g('xnew').onclick = () => indForm();
  if (g('xscope')) document.querySelectorAll('#xscope button').forEach(b => b.onclick = () => { FIx.todo = b.dataset.v === '1'; render(); });
  document.querySelectorAll('#xtab button').forEach(b => b.onclick = () => { FIx.tab = b.dataset.t; render(); });
  g('xarea').onchange = e => { FIx.area = e.target.value; render(); }; g('xsup').onchange = e => { FIx.sup = e.target.value; render(); };
  if (g('xresp')) g('xresp').onchange = e => { FIx.resp = e.target.value; render(); };
  document.querySelectorAll('[data-x]').forEach(b => b.onclick = () => indDetalle(b.dataset.x));
}

function indForm(a) {
  const yo = PERS[S.yo], e = a ? { ...a } : { t: '', area: AREAS[0], sol: '', r: S.yo, sup: false, aut: Object.keys(EQ()).find(k => k !== S.yo && PERS[k].admin && !PERS[k].off) || Object.keys(EQ()).find(k => k !== S.yo) || null, fsolH: nowDT(), fH: add(HOY, 1) + 'T17:00', notas: '' };
  const draw = () => {
    openSheet(`<div class="sh-h"><h2>${a ? 'Editar actividad individual' : 'Nueva actividad individual'}</h2>${X}</div><p class="sub">Para solicitudes de un área que requieren una sola acción, sin abrir un proyecto.</p>
      <div class="fg"><label class="f full"><span>Nombre de la actividad</span><input class="in" id="x1" value="${esc(e.t)}" placeholder="Ej. Revisión de presentación comercial Q4"></label>
        <label class="f"><span>Área que solicita</span><select class="in" id="x2">${AREAS.map(x => `<option ${e.area === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <label class="f"><span>¿Quién solicita?</span><input class="in" id="x3" value="${esc(e.sol)}" placeholder="Nombre y puesto"></label>
        <label class="f"><span>Responsable</span><select class="in" id="x4" ${yo.admin ? '' : 'disabled'}>${Object.entries(EQ()).map(([k, p]) => `<option value="${k}" ${e.r === k ? 'selected' : ''}>${p.n}</option>`).join('')}</select></label>
        <div class="f"><span>¿Requiere supervisión?</span><div class="opts" id="x5"><button type="button" class="opt ${e.sup ? 'on' : ''}" data-v="1">Sí</button><button type="button" class="opt ${e.sup ? '' : 'on'}" data-v="0">No</button></div></div>
        ${e.sup ? `<label class="f full"><span>¿Quién autoriza?</span><select class="in" id="x6">${Object.entries(EQ()).filter(([k]) => k !== e.r).map(([k, p]) => `<option value="${k}" ${e.aut === k ? 'selected' : ''}>${p.n} · ${p.rol}</option>`).join('')}</select></label>` : ''}
        <label class="f"><span>Fecha y hora en que se pide</span><input class="in" type="datetime-local" id="x7" value="${e.fsolH}"></label>
        <label class="f"><span>Fecha y hora de entrega</span><input class="in" type="datetime-local" id="x8" value="${e.fH}"></label>
        <label class="f full"><span>Comentarios</span><textarea class="in" id="x9" rows="2" placeholder="Contexto de la solicitud">${esc(e.notas)}</textarea></label></div>
      <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="xok">${a ? 'Guardar' : 'Registrar actividad'}</button></div>`);
    const g = x => document.getElementById(x);
    const sync = () => { e.t = g('x1').value; e.area = g('x2').value; e.sol = g('x3').value; e.r = g('x4').value; if (g('x6')) e.aut = g('x6').value; e.fsolH = g('x7').value; e.fH = g('x8').value; e.notas = g('x9').value; };
    document.querySelectorAll('#x5 .opt').forEach(b => b.onclick = () => { sync(); e.sup = b.dataset.v === '1'; if (e.sup && (!e.aut || e.aut === e.r)) e.aut = Object.keys(EQ()).find(k => k !== e.r && PERS[k].admin) || Object.keys(EQ()).find(k => k !== e.r); draw(); });
    g('x4').onchange = () => { sync(); if (e.aut === e.r) e.aut = Object.keys(EQ()).find(k => k !== e.r); draw(); };
    g('xok').onclick = () => { sync();
      if (!e.t.trim() || !e.sol.trim()) { toast('Escribe la actividad y quién la solicita.'); return; }
      if (!e.fsolH || !e.fH) { toast('Captura la fecha y hora en que se pide y la de entrega.'); return; }
      if (e.fH < e.fsolH) { toast('La entrega no puede ser anterior a la solicitud.'); return; }
      const row = { t: e.t.trim(), area: e.area, sol: e.sol.trim(), r: e.r, sup: e.sup, aut: e.sup ? e.aut : null, fsolH: e.fsolH, fH: e.fH, fsol: e.fsolH.slice(0, 10), f: e.fH.slice(0, 10), notas: e.notas.trim() };
      let it = a; if (a) Object.assign(a, row); else { it = { id: uid(), st: 'Pendiente', aj: [], ...row }; IND.push(it); }
      guardar(() => DB.individual(it, !a));
      toast(a ? 'Actividad actualizada' : (it.r !== S.yo ? `Actividad registrada y asignada a ${PERS[it.r].n}` : 'Actividad registrada')); render(); indDetalle(it.id); };
  };
  draw();
}

function indDetalle(id) {
  const a = IND.find(x => x.id === id), yo = PERS[S.yo], esResp = a.r === S.yo, esAut = a.sup && a.aut === S.yo, u = a.aj[a.aj.length - 1];
  const puedeEntregar = esResp && ['Pendiente', 'En progreso', 'Requiere ajustes'].includes(a.st);
  let bloque = '';
  if (a.st === 'Necesita revisión' && esAut) bloque = `<section class="revbox"><h3>Autorización</h3><p class="sub">${esc(PERS[a.r].n)} entregó esta actividad el ${dtTxt(a.doneH)}. Revisa el entregable y decide.</p>
      <details class="drop" id="xad"><summary>Requiere ajustes</summary><label class="f full"><span>Ajustes necesarios</span><textarea class="in" id="xaj" rows="4"></textarea></label><div class="sh-f" style="margin-top:10px"><button class="btn warn" id="xdev">Devolver</button></div></details>
      <div class="sh-f"><button class="btn ok" id="xaut">Autorizar y terminar</button></div></section>`;
  else if (a.st === 'Necesita revisión') bloque = `<section class="revbox info"><h3>Por autorizar</h3><p class="sub">Esperando la autorización de ${esc(PERS[a.aut].n)}.</p></section>`;
  if (a.st === 'Requiere ajustes' && u) bloque = `<section class="revbox adj"><h3>Requiere ajustes · ajuste ${a.aj.length}</h3><blockquote><cite>${esc(PERS[u.sol].n)} el ${fs(u.f)}</cite>${esc(u.com)}</blockquote><p class="sub">Corrige y vuelve a registrar la entrega.</p></section>`;
  const entregaForm = puedeEntregar ? `<section class="dbox"><h3>Registrar entrega</h3><div class="fg">
      <label class="f full"><span>¿Qué se entregó?</span><input class="in" id="d1" value="${esc(a.ent || '')}" placeholder="Ej. Presentación corregida con 12 láminas"></label>
      <label class="f"><span>¿Cómo se entregó?</span><select class="in" id="d2">${MEDIOS_E.map(m => `<option ${a.medio === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
      <label class="f"><span>Fecha y hora en que se termina</span><input class="in" type="datetime-local" id="d4" value="${nowDT()}"></label>
      <label class="f full"><span>¿Dónde está el entregable?</span><input class="in" id="d3" value="${esc(a.ubi || '')}" placeholder="Liga o ruta: Drive, correo enviado, plataforma"></label></div>
      <p class="sub">${a.sup ? `Al registrar la entrega, ${esc(PERS[a.aut].n)} recibirá la notificación para autorizarla.` : 'Al registrar la entrega, la actividad queda terminada.'}</p>
      <div class="sh-f"><button class="btn dark" id="dok">${a.sup ? 'Entregar para autorización' : 'Entregar y terminar'}</button></div></section>` : '';
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:#8C2341">${esc(a.area)}</span>${stChip(a.st)}${a.aj.length ? `<span class="chip warn">${a.aj.length} ajuste(s)</span>` : ''}${X}</div>
    <h2 class="ptitle">${esc(a.t)}</h2>${bloque}
    <div class="dl"><div><small>Quién solicita</small><b>${esc(a.sol)}</b></div><div><small>Responsable</small><b>${esc(PERS[a.r].n)}</b></div><div><small>Supervisión</small><b>${a.sup ? `Sí · autoriza ${esc(PERS[a.aut].n)}` : 'No requiere'}</b></div>
      <div><small>Se pidió</small><b>${dtTxt(a.fsolH)}</b></div><div><small>Entrega comprometida</small><b class="${indVenc(a) ? 'latet' : ''}">${dtTxt(a.fH)}</b></div><div><small>Se terminó</small><b>${a.st === 'Terminado' ? dtTxt(a.doneH) : '—'}</b></div></div>
    ${a.notas ? `<p class="iobj"><b>Comentarios:</b> ${esc(a.notas)}</p>` : ''}
    ${a.ent ? `<section class="dbox done"><h3>Entrega</h3><div class="dl"><div><small>Qué se entregó</small><b>${esc(a.ent)}</b></div><div><small>Cómo se entregó</small><b>${esc(a.medio || '—')}</b></div><div><small>Dónde está el entregable</small><b>${esc(a.ubi || '—')}</b></div></div></section>` : ''}
    ${esResp && a.st === 'Pendiente' ? '<div class="sh-f" style="justify-content:flex-start"><button class="btn" id="dstart">Marcar en progreso</button></div>' : ''}
    ${entregaForm}
    ${a.aj.length ? `<h3 class="sh3">Historial de ajustes · ${a.aj.length}</h3><div class="hist">${a.aj.map((j, i) => `<div class="hi"><b>Ajuste ${i + 1} · ${esc(PERS[j.sol].n)}, ${fs(j.f)}</b><p>${esc(j.com)}</p></div>`).join('')}</div>` : ''}
    <div class="sh-f">${yo.admin && a.st !== 'Terminado' ? '<button class="btn" id="dedit">Editar</button>' : ''}<button class="btn" data-close>Cerrar</button></div>`, true);
  const g = x => document.getElementById(x);
  if (g('dstart')) g('dstart').onclick = () => { a.st = 'En progreso'; guardar(() => DB.estado('individuales', a.id, 'En progreso')); toast('Actividad en progreso'); render(); indDetalle(id); };
  if (g('dedit')) g('dedit').onclick = () => indForm(a);
  if (g('dok')) g('dok').onclick = () => { const ent = g('d1').value.trim(), ubi = g('d3').value.trim(), dH = g('d4').value;
    if (!ent || !ubi || !dH) { toast('Indica qué se entregó, dónde está y la fecha y hora en que se terminó.'); return; }
    Object.assign(a, { ent, medio: g('d2').value, ubi, doneH: dH });
    if (a.sup) { a.st = 'Necesita revisión'; toast(`Notificación enviada a ${PERS[a.aut].n}: "${a.t}" está lista para autorizar.`); }
    else { a.st = 'Terminado'; a.fdone = dH.slice(0, 10); toast(dH > a.fH ? 'Actividad terminada. Quedó registrada como entregada tarde.' : 'Actividad terminada a tiempo.'); }
    guardar(() => DB.entregaInd(a));
    render(); indDetalle(id); };
  if (g('xaut')) g('xaut').onclick = () => { a.st = 'Terminado'; guardar(() => DB.estado('individuales', a.id, 'Terminado')); a.fdone = (a.doneH || nowDT()).slice(0, 10); toast(`Autorizada. Notificación enviada a ${PERS[a.r].n}.`); render(); indDetalle(id); };
  if (g('xdev')) g('xdev').onclick = () => { const com = g('xaj').value.trim(); if (!com) { toast('Anota los ajustes antes de devolver.'); return; }
    const nj = { id: uid(), com, sol: S.yo, f: HOY }; a.aj.push(nj); a.st = 'Requiere ajustes';
    guardar(async () => { await DB.ajuste(nj, 'individual_id', a.id); await DB.estado('individuales', a.id, 'Requiere ajustes'); }); toast(`Notificación enviada a ${PERS[a.r].n}: la actividad regresó con ajustes.`); render(); indDetalle(id); };
}


/* =====================================================================
   REPORTE DE CIERRE DEL DÍA (lunes a viernes)
   ===================================================================== */
const esHabil = f => { const d = new Date(f + 'T12:00:00').getDay(); return d >= 1 && d <= 5; };
const horaAhora = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
// Historial de ejemplo: enviado por el integrante o enviado automáticamente a las 19:00
const REP = {};


const repDe = (k, f) => (REP[k] || {})[f];
function eventosDelDia(k, f) {
  const ev = [];
  A.filter(a => a.r === k).forEach(a => {
    if (a.st === 'Terminado' && a.fdone === f) ev.push(['ok', `Terminó "${a.t}"`, pj(a.p).n]);
    if (a.st === 'Necesita revisión' && a.f === f) ev.push(['rev', `Envió a revisión "${a.t}"`, pj(a.p).n]);
    (a.aj || []).forEach((j, n) => { if (j.ini && j.ini.slice(0, 10) === f) ev.push(['ini', `Inició el ajuste ${n + 1} de "${a.t}"`, pj(a.p).n]); if (j.fin && j.fin.slice(0, 10) === f) ev.push(['fin', `Entregó el ajuste ${n + 1} de "${a.t}"`, pj(a.p).n]); });
    if (a.st === 'En progreso' && a.f >= f && a.ini <= f) ev.push(['prog', `Avanzó en "${a.t}"`, pj(a.p).n]); });
  IND.filter(a => a.r === k && a.doneH && a.doneH.slice(0, 10) === f).forEach(a => ev.push(['ind', `Entregó la actividad individual "${a.t}"`, `${a.area} · ${a.medio || ''}`]));
  INN.filter(n => n.r === k).forEach(n => n.av.filter(x => x.f === f).forEach(x => ev.push(['inn', `Avance en innovación: ${n.n}`, x.t])));
  INI.forEach(i => i.acc.filter(x => x.r === k && x.fel === f).forEach(x => ev.push(['ini2', `Elaboró la acción "${x.a}"`, i.n])));
  return ev;
}
function pendientesManana(k) {
  const man = add(HOY, 1);
  return [...A.filter(a => a.r === k && a.st !== 'Terminado' && a.f <= man).map(a => ({ t: a.t, f: a.f, h: a.h, p: pj(a.p).n })), ...IND.filter(a => a.r === k && a.st !== 'Terminado' && a.f <= man).map(a => ({ t: a.t, f: a.f, h: a.fH.slice(11, 16), p: 'Actividad individual' }))].sort((a, b) => (a.f + a.h).localeCompare(b.f + b.h));
}
const EVI = { ok: ['✓', '#2E9E62'], rev: ['⟳', '#3C74D6'], ini: ['▶', '#E86A17'], fin: ['■', '#3C74D6'], prog: ['●', '#D99A12'], ind: ['✓', '#C25B76'], inn: ['★', '#C9962B'], ini2: ['◎', '#3C74D6'] };
function cierreDia() {
  const k = S.yo;
  if (!esHabil(HOY)) return;
  const ya = repDe(k, HOY);
  if (ya) { toast(`Ya enviaste tu reporte de hoy a las ${ya.h}.`); return; }
  const ev = eventosDelDia(k, HOY), pend = pendientesManana(k), horas = horasDia(k, HOY);
  const dest = Object.values(PERS).filter(p => p.admin && !p.off).map(p => p.n.split(' ')[0]).join(' y ') || 'las administradoras';
  openSheet(`<div class="sh-h"><span class="medal sm" style="background:linear-gradient(135deg,#8C2341,#14394D)"><svg viewBox="0 0 24 24" style="fill:none;stroke:#fff;stroke-width:2"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg></span><h2>Reporte de cierre del día</h2>${X}</div>
    <p class="sub">${DIA[new Date().getDay()].replace(/^./, c => c.toUpperCase())} ${fs(HOY)} · se enviará a ${esc(dest)}. Al enviarlo, tu día queda cerrado y solo se puede enviar un reporte por día.</p>
    <div class="dl"><div><small>Actividades registradas hoy</small><b>${ev.length}</b></div><div><small>Tiempo en plataforma hoy</small><b>${hfmt(horas)}</b></div><div><small>Pendientes para mañana</small><b>${pend.length}</b></div></div>
    <h3 class="sh3">Lo que realizaste hoy</h3>${ev.length ? `<div class="tlx">${ev.map(([t, x, d]) => `<div class="tx"><span class="tx-i" style="background:${EVI[t][1]}">${EVI[t][0]}</span><div><b>${esc(x)}</b>${d ? `<p>${esc(d)}</p>` : ''}</div><small></small></div>`).join('')}</div>` : '<div class="empty">La plataforma no registró movimientos hoy. Describe en los comentarios lo que realizaste.</div>'}
    <h3 class="sh3">Pendiente para mañana</h3>${pend.length ? `<div class="rows">${pend.map(a => `<div class="rw"><span class="okc pen">–</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m"><b>${a.f < HOY ? `Vencida ${fs(a.f)}` : a.f === HOY ? 'Hoy' : 'Mañana'} · ${a.h}</b> · ${esc(a.p)}</div></div></div>`).join('')}</div>` : '<div class="empty">Sin pendientes para mañana.</div>'}
    <div class="fg" style="margin-top:12px"><label class="f full"><span>Comentarios del día (opcional)</span><textarea class="in" id="rc1" rows="3" placeholder="Lo que quieras destacar de tu día, avances que no quedan en la plataforma"></textarea></label>
      <label class="f full"><span>¿Necesitas apoyo o tienes algún bloqueo? (opcional)</span><textarea class="in" id="rc2" rows="2"></textarea></label></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="rsend"><svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>Enviar reporte y terminar mi día</button></div>`, true);
  document.getElementById('rsend').onclick = async () => {
    const b = document.getElementById('rsend'); b.disabled = true; b.textContent = 'Enviando…';
    const com = document.getElementById('rc1').value.trim(), bloq = document.getElementById('rc2').value.trim();
    try {
      const r = await DB.funcion('cierre', { comentarios: com, bloqueos: bloq, eventos: ev.map(([t, x, d]) => ({ tipo: t, texto: x, detalle: d })),
        pendientes: pend.map(a => ({ t: a.t, p: a.p, cuando: `${a.f < HOY ? `Vencida ${fs(a.f)}` : a.f === HOY ? 'Hoy' : 'Mañana'} · ${a.h}`, vencida: a.f < HOY })) });
      REP[k] = REP[k] || {}; REP[k][HOY] = { auto: false, h: r.hora || horaAhora(), com, bloq };
      closeSheet(); toast(r.enviado ? `Reporte enviado a ${dest}. ¡Buen cierre de día!` : 'Reporte registrado. El correo no se pudo enviar; quedó guardado en la plataforma.'); render();
    } catch (e) { b.disabled = false; b.textContent = 'Enviar reporte y terminar mi día'; toast(e.message); }
  };
}
function repChip(k, f) {
  const r = repDe(k, f);
  if (!esHabil(f) || (PERS[k] && PERS[k].desde && f < PERS[k].desde)) return '<span class="rchip na">No aplica</span>';
  if (r && !r.auto) return `<span class="rchip ok">Enviado ${r.h}</span>`;
  if (r && r.auto) return `<span class="rchip bad">No lo envió · automático ${CFG.horaRep}</span>`;
  if (f < HOY) return '<span class="rchip bad">No lo envió</span>';
  return horaAhora() >= CFG.horaRep ? `<span class="rchip bad">No lo envió · automático ${CFG.horaRep}</span>` : '<span class="rchip pen">Pendiente</span>';
}
function repSemana(k, ws) {
  const dias = Array.from({ length: 5 }, (_, i) => add(ws, i)).filter(f => f <= HOY && !(PERS[k] && PERS[k].desde && f < PERS[k].desde));
  return { dias, env: dias.filter(f => repDe(k, f) && !repDe(k, f).auto).length, auto: dias.filter(f => (repDe(k, f) && repDe(k, f).auto) || (f < HOY && !repDe(k, f))).length };
}


/* =====================================================================
   NOTIFICACIONES: globos por pestaña y campana
   ===================================================================== */
const NAVMAP = { rev: 'navRev', ini: 'navIni', dash: 'navDash', proy: 'navProy', inn: 'navInn', iniv: 'navIniv', prog: 'navProg', imp: 'navImp', ind: 'navInd', eq: 'navEq' };
const SECN = { rev: 'Por revisar', proy: 'Proyectos', ind: 'Actividades individuales', inn: 'Innovación', iniv: 'Iniciativas', imp: 'Impacto validado', prog: 'Programas en curso', eq: 'Equipo' };
function pendientesDe(k) {
  const yo = PERS[k], out = [], add2 = (view, tipo, txt, det, go, urg) => out.push({ view, tipo, txt, det, go, urg: !!urg });
  if (yo.ext) { porRevisarDe(k).forEach(({ a, p }) => add2('rev', 'rev', `Revisar entregable: ${a.t}`, `${p.n} · enviado el ${fs(a.ext.fenv)}`, () => acRevisar(a.id), true));
    retroPend(k).forEach(p => add2('proy', 'val', `Proyecto terminado: ${p.n}`, 'Cuéntanos si sirvió', () => acRetro(p.id))); return out; }
  // Actividades de proyecto
  A.filter(a => a.r === k).forEach(a => {
    if (a.st === 'Requiere ajustes') add2('proy', 'aj', `Atender ajustes: ${a.t}`, pj(a.p).n, () => { S.view = 'proy'; render(); actividad(a.id); }, true);
    else if (vencida(a)) add2('proy', 'venc', `Vencida: ${a.t}`, `${pj(a.p).n} · venció ${fs(a.f)}`, () => { S.view = 'proy'; render(); actividad(a.id); }, true);
    else if (a.st !== 'Terminado' && a.st !== 'Necesita revisión' && a.f === HOY) add2('proy', 'hoy', `Entrega hoy ${a.h}: ${a.t}`, pj(a.p).n, () => { S.view = 'proy'; render(); actividad(a.id); }); });
  A.filter(a => a.sup === k && a.st === 'Necesita revisión').forEach(a => add2('proy', 'rev', `Revisar: ${a.t}`, `${PERS[a.r].n} · ${pj(a.p).n}`, () => { S.view = 'proy'; render(); actividad(a.id); }, true));
  // Actividades individuales
  IND.filter(a => a.r === k).forEach(a => {
    if (a.st === 'Requiere ajustes') add2('ind', 'aj', `Atender ajustes: ${a.t}`, a.area, () => { S.view = 'ind'; render(); indDetalle(a.id); }, true);
    else if (indVenc(a)) add2('ind', 'venc', `Vencida: ${a.t}`, `${a.area} · venció ${dtTxt(a.fH)}`, () => { S.view = 'ind'; render(); indDetalle(a.id); }, true);
    else if (a.st !== 'Terminado' && a.st !== 'Necesita revisión' && a.f === HOY) add2('ind', 'hoy', `Entrega hoy ${a.fH.slice(11, 16)}: ${a.t}`, a.area, () => { S.view = 'ind'; render(); indDetalle(a.id); }); });
  IND.filter(a => a.aut === k && a.st === 'Necesita revisión').forEach(a => add2('ind', 'rev', `Autorizar: ${a.t}`, `${PERS[a.r].n} · ${a.area}`, () => { S.view = 'ind'; render(); indDetalle(a.id); }, true));
  // Innovación
  INN.filter(n => n.r === k && n.est === 'Por retroalimentar').forEach(n => add2('inn', 'fb', `Retroalimentar: ${n.n}`, 'Decide si se queda en tu trabajo diario', () => { S.view = 'inn'; render(); innDetalle(n.id); }));
  if (esHabil(HOY) && !INN.some(n => n.r === k && n.sem === lunes(HOY))) add2('inn', 'prop', 'Proponer tu herramienta de la semana', `Semana del ${fs(lunes(HOY))}`, () => { S.view = 'inn'; render(); innForm(); });
  // Iniciativas
  INI.filter(i => i.t === trim(HOY)).forEach(i => i.acc.forEach((x, n) => {
    if (x.r === k && !x.fel && x.lim < HOY) add2('iniv', 'venc', `Acción vencida: ${x.a}`, `${i.n} · límite ${fs(x.lim)}`, () => { S.view = 'iniv'; render(); iniDetalle(i.id); }, true);
    if (yo.admin && x.fel && x.ok === null) add2('iniv', 'rev', `Evaluar acción: ${x.a}`, `${PERS[x.r].n} · ${i.n}`, () => { S.view = 'iniv'; render(); iniDetalle(i.id); }); }));
  if (yo.admin) {
    PROY.filter(p => p.est === 'Terminado' && !(p.imp && p.imp.final)).forEach(p => add2('imp', 'val', `Validar impacto: ${p.n}`, `${p.area} · terminado el ${fs(p.fter)}`, () => { S.view = 'imp'; render(); impForm(p.id); }, diasEntre(p.fter, HOY) > 15));
    PROGS.filter(g => g.est === 'En curso').forEach(g => eventosDia(HOY, [g]).forEach(e => add2('prog', 'ses', `${e.txt}: ${e.m.n}`, g.n, () => { S.view = 'prog'; render(); programa(g.id); })));
    if (esHabil(HOY) && horaAhora() >= CFG.horaRep) integrantes().filter(x => x !== k && !repDe(x, HOY)).forEach(x => add2('eq', 'rep', `${PERS[x].n} no envió su reporte`, 'Se envió el resumen automático de las 19:00', () => { S.view = 'eq'; render(); eqDetalle(x); }, true));
  }
  return out;
}
const NICO = { aj: ['↺', '#E86A17'], venc: ['!', '#D6453D'], hoy: ['●', '#D99A12'], rev: ['⟳', '#3C74D6'], fb: ['★', '#C9962B'], prop: ['★', '#C9962B'], val: ['✓', '#2E9E62'], ses: ['▶', '#7A4CE0'], rep: ['✉', '#D6453D'] };
function pintarNotificaciones() {
  const ps = pendientesDe(S.yo), por = {};
  ps.forEach(p => { por[p.view] = (por[p.view] || 0) + 1; });
  // Inicio: lo urgente de actividades (vencidas y ajustes)
  por.ini = ps.filter(p => ['proy', 'ind'].includes(p.view) && ['venc', 'aj'].includes(p.tipo)).length;
  Object.entries(NAVMAP).forEach(([v, id]) => { const btn = document.getElementById(id); if (!btn) return; let b = btn.querySelector('.b'); if (!b) { b = document.createElement('span'); b.className = 'b'; btn.appendChild(b); }
    const n = por[v] || 0; b.textContent = n; b.style.display = n ? '' : 'none'; b.classList.toggle('urg', ps.some(p => p.view === v && p.urg) || v === 'ini'); });
  const acts = document.querySelector('#main .top .acts'); if (!acts) return;
  const bell = document.createElement('div'); bell.className = 'bellw';
  bell.innerHTML = `<button class="ibtn" id="bellbtn" aria-label="Notificaciones" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>${ps.length ? `<span class="bcount">${ps.length > 99 ? '99+' : ps.length}</span>` : ''}</button>
    <div class="bpanel" id="bpanel" hidden><div class="bp-h"><b>Lo que te falta</b><span>${ps.length ? `${ps.length} pendiente(s)` : 'Todo al día'}</span></div>
      ${ps.length ? Object.keys(SECN).filter(v => ps.some(p => p.view === v)).map(v => `<div class="bp-s">${SECN[v]}</div>${ps.filter(p => p.view === v).sort((a, b) => b.urg - a.urg).map((p, i) => `<button class="bp-i" data-ni="${ps.indexOf(p)}"><span class="bp-ic" style="background:${NICO[p.tipo][1]}">${NICO[p.tipo][0]}</span><span class="bp-t"><b>${esc(p.txt)}</b><small>${esc(p.det)}</small></span></button>`).join('')}`).join('') : '<div class="bp-empty">No tienes pendientes. ¡Todo al día!</div>'}</div>`;
  acts.appendChild(bell);
  const btn = bell.querySelector('#bellbtn'), panel = bell.querySelector('#bpanel');
  btn.onclick = e => { e.stopPropagation(); panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); };
  panel.querySelectorAll('[data-ni]').forEach(b => b.onclick = () => { panel.hidden = true; ps[+b.dataset.ni].go(); });
}
document.addEventListener('click', e => { const p = document.getElementById('bpanel'); if (p && !p.hidden && !e.target.closest('.bellw')) p.hidden = true; });


/* =====================================================================
   AJUSTES
   ===================================================================== */
const META = { k1: 85, k2: 80, k3: 80, k4: 70 };
const CFG = { horaRep: '19:00', horaAgenda: '09:00', notif: { agenda: [true, true], agendaEq: [true, false], aj: [true, true], rev: [true, true], venc: [true, true], rep: [true, false], auto: [true, true], inn: [false, true] } };
const NTIP = [['agenda', 'Agenda del día: mis actividades de hoy (9:00 a. m.)', 'Todos'], ['agendaEq', 'Agenda del equipo (9:00 a. m.)', 'Fernanda: todo el equipo · Ximena: colaboradores'], ['aj', 'Me regresan una actividad con ajustes', 'Todos'], ['rev', 'Tengo una actividad por revisar o autorizar', 'Todos'], ['venc', 'Una actividad mía venció', 'Todos'], ['inn', 'Comentarios en mis herramientas de innovación', 'Todos'], ['rep', 'Reporte de cierre de cada integrante', 'Fernanda y Ximena'], ['auto', 'Integrante que no envió su reporte (automático)', 'Fernanda y Ximena']];
const FA = { tab: 'perfil' };
const PERMS_EXT = 1;
const PERMS = [['Ver Inicio, Proyectos, Innovación, Iniciativas y Actividades individuales', 1, 1, 1], ['Ver Dashboard, Programas en curso, Impacto validado y Equipo', 1, 1, 0], ['Crear y editar proyectos, iniciativas y programas', 1, 1, 0], ['Revisar, aprobar y pedir ajustes', 1, 1, 'Si es supervisor asignado'], ['Enviar reporte de cierre del día', 1, 1, 1], ['Crear usuarios, asignar contraseñas y tipo de usuario', 1, 0, 0], ['Editar metas, catálogos, notificaciones y reportes automáticos', 1, 0, 0]];
const tipoDe = k => PERS[k].tipo;
function renderAjustes() {
  const yo = PERS[S.yo], maestra = !!PERS[S.yo].maestra;
  const tabs = [['perfil', 'Mi perfil'], ...(maestra ? [['notif', 'Notificaciones'], ['usuarios', 'Usuarios y permisos'], ['metas', 'Metas de KPIs'], ['cat', 'Catálogos'], ['rep', 'Reportes automáticos']] : [])];
  if (!tabs.some(t => t[0] === FA.tab)) FA.tab = 'perfil';
  let body = '';
  if (FA.tab === 'perfil') body = `<section class="card"><div class="ch"><h3>Mi perfil</h3></div><div class="aj-prof">${av(S.yo, 72)}<div class="fg" style="flex:1">
      <label class="f"><span>Nombre</span><input class="in" id="pn" value="${esc(yo.n)}"></label><label class="f"><span>Rol</span><input class="in" id="pr" value="${esc(yo.rol)}" ${maestra ? '' : 'disabled'}></label>
      <div class="f"><span>Tipo de usuario</span><div class="ro">${tipoDe(S.yo)}</div></div><div class="f"><span>Correo</span><div class="ro">${esc(yo.email || '')}</div></div>
      ${fotoCampo(S.yo, 'pfoto')}
      <div class="f full"><span>Color</span><div class="sws">${PAL.map(c => `<button type="button" class="sw ${yo.c === c ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div></div>
      <div class="f full"><span>Cuenta</span><div style="display:flex;gap:8px;flex-wrap:wrap">${maestra ? '<button type="button" class="btn sm" id="ppw">Cambiar mi contraseña</button>' : ''}<button type="button" class="btn sm" id="ppush">Activar notificaciones en este dispositivo</button><button type="button" class="btn sm" id="plog" style="color:var(--bad)">Cerrar sesión</button></div></div></div></div>
      <div class="sh-f"><button class="btn dark" id="psave">Guardar perfil</button></div></section>`;
  if (FA.tab === 'notif') body = `<section class="card"><div class="ch"><h3>Notificaciones del equipo</h3><span class="sub r">Obligatorias para todos; solo la administradora maestra las configura</span></div>
      <table class="ntab"><thead><tr><th>Aviso</th><th>Lo recibe</th><th class="c">Correo</th><th class="c">En la plataforma</th></tr></thead><tbody>${NTIP.map(([k, n, quien]) => `<tr><td>${n}</td><td><span class="ichip" style="--c:${quien === 'Todos' ? '#14394D' : '#8C2341'}">${quien}</span></td>${[0, 1].map(i => `<td class="c"><label class="tg"><input type="checkbox" data-nt="${k}:${i}" ${CFG.notif[k][i] ? 'checked' : ''}><span></span></label></td>`).join('')}</tr>`).join('')}</tbody></table>
      <p class="sub" style="margin-top:10px">Los usuarios no pueden desactivar estos avisos. Los cambios aplican de inmediato para todo el equipo.</p></section>`;
  if (FA.tab === 'usuarios') body = `<section class="card"><div class="ch"><h3>Usuarios</h3><button class="btn dark sm r" id="uinv"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Crear usuario</button></div>
      <div class="tw"><table class="atab" style="min-width:720px"><thead><tr><th>Usuario</th><th>Rol</th><th>Tipo de usuario</th><th class="c">Activo</th><th></th></tr></thead><tbody>
      ${Object.entries(PERS).map(([k, p]) => `<tr><td><span class="who">${av(k, 28)}<b>${esc(p.n)}</b></span></td><td>${esc(p.rol)}</td><td>${p.maestra ? '<span class="ichip" style="--c:#8C2341">Administradora maestra</span>' : p.ext ? `<span class="ichip" style="--c:#5145CD">Área solicitante · ${esc(p.area)}</span>` : `<select class="fsel" data-ut="${k}">${['Usuario', 'Administradora'].map(t => `<option ${p.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select>`}</td>
        <td class="c">${p.maestra ? '—' : `<label class="tg"><input type="checkbox" data-ua="${k}" ${p.off ? '' : 'checked'}><span></span></label>`}</td><td>${p.maestra ? '' : `<button class="btn sm" data-ue="${k}">Editar</button>`}</td></tr>`).join('')}</tbody></table></div>
      <p class="sub" style="margin-top:10px">Un usuario inactivo ya no puede entrar a la plataforma, pero su historial se conserva.</p></section>
    <section class="card"><div class="ch"><h3>Permisos por tipo de usuario</h3></div><div class="tw"><table class="atab ptab"><thead><tr><th>Permiso</th><th class="c">Administradora maestra</th><th class="c">Administradora</th><th class="c">Usuario</th></tr></thead><tbody>
      ${PERMS.map(([n, ...v]) => `<tr><td>${n}</td>${v.map(x => `<td class="c">${x === 1 ? '<span class="okc yes">✓</span>' : x === 0 ? '<span class="okc pen">–</span>' : `<small>${x}</small>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  if (FA.tab === 'metas') body = `<section class="card"><div class="ch"><h3>Metas mensuales de KPIs</h3><span class="sub r">"En la meta" = ±2 puntos alrededor de la meta</span></div><div class="mgrid2">
      ${[['k1', 'Cumplimiento en fecha'], ['k2', 'Salud del portafolio'], ['k3', 'Tasa de implementación'], ['k4', 'Impacto validado']].map(([k, n]) => `<label class="f"><span>${n}</span><div class="pin"><input class="in" type="number" min="0" max="100" data-meta="${k}" value="${META[k]}"><b>%</b></div></label>`).join('')}</div>
      <div class="sh-f"><button class="btn dark" id="msave">Guardar metas</button></div></section>`;
  if (FA.tab === 'cat') { const cats = [['Tipos de proyecto', TIPOS], ['Instituciones', INSTS], ['Áreas solicitantes', AREAS], ['Medios de entrega', MEDIOS_E], ['Medios de retroalimentación', MEDIOS]];
    body = `<div class="catg">${cats.map(([n, arr], ci) => `<section class="card"><div class="ch"><h3>${n}</h3><span class="badge r">${arr.length}</span></div><div class="catl">${arr.map((x, i) => `<span class="cat">${esc(x)}<button data-cdel="${ci}:${i}" aria-label="Quitar">✕</button></span>`).join('')}</div><div class="addrow"><input class="in" data-cin="${ci}" placeholder="Agregar"><button class="btn sm" data-cadd="${ci}">Agregar</button></div></section>`).join('')}</div>`;
    S._cats = cats; }
  if (FA.tab === 'rep') body = `<section class="card"><div class="ch"><h3>Agenda del día</h3><span class="ichip r" style="--c:#8C2341">Lunes a viernes</span></div><div class="fg">
      <label class="f"><span>Hora de envío</span><input class="in" type="time" id="ra" value="${CFG.horaAgenda}"></label><div class="f"><span>Días</span><div class="ro">Lunes a viernes</div></div></div>
      <table class="ntab" style="margin-top:12px"><thead><tr><th>Quién</th><th>Recibe</th></tr></thead><tbody>
        <tr><td><b>Todos los integrantes</b></td><td>Correo individual con sus actividades de hoy, sus vencidas, sus ajustes por atender y lo que debe revisar o autorizar.</td></tr>
        <tr><td><b>Fernanda</b></td><td>Su correo individual y, además, la <b>agenda del equipo</b> con las actividades de hoy de todos, incluida Ximena.</td></tr>
        <tr><td><b>Ximena</b></td><td>Su correo individual y, además, la <b>agenda de los colaboradores</b>, sin incluir a Fernanda.</td></tr></tbody></table></section>
    <section class="card"><div class="ch"><h3>Reporte de cierre del día</h3><span class="ichip r" style="--c:#8C2341">Lunes a viernes</span></div><div class="fg">
      <label class="f"><span>Hora del envío automático</span><input class="in" type="time" id="rh" value="${CFG.horaRep}"></label><div class="f"><span>Días</span><div class="ro">Lunes a viernes</div></div>
      <div class="f full"><span>Quién recibe los reportes</span><div class="ro" style="height:auto;padding:10px 12px;display:block;font-weight:500">Todos los reportes de cierre, incluidos los de Fernanda y Ximena, llegan a Fernanda y a Ximena.</div></div></div>
      <p class="sub">Si alguien no envía su reporte a esta hora, la plataforma envía automáticamente el resumen del día indicando que no lo mandó. Los integrantes no ven este aviso.</p></section>
    <section class="card"><div class="ch"><h3>Reporte de indicadores</h3></div><p class="sub" style="margin:0">Se envía al dar clic en "Enviar reporte por correo" en el Dashboard, con el Excel de avance de indicadores adjunto.</p>
      <div class="sh-f"><button class="btn dark" id="rsave">Guardar horarios</button></div></section>`;
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Ajustes</h1><span class="date">${esc(yo.n)} · ${tipoDe(S.yo)}</span>
      <div class="acts"></div></div>
    <div class="seg" id="atabs" style="align-self:flex-start;flex-wrap:wrap">${tabs.map(([k, n]) => `<button data-at="${k}" class="${FA.tab === k ? 'on' : ''}">${n}</button>`).join('')}</div>${body}`;
  const g = x => document.getElementById(x);
  (g('as') || {}).onchange = e => { S.yo = e.target.value; render(); };
  document.querySelectorAll('#atabs button').forEach(b => b.onclick = () => { FA.tab = b.dataset.at; render(); });
  document.querySelectorAll('.sw').forEach(b => b.onclick = () => { yo.c = b.dataset.c; guardar(() => DB.perfilPropio(yo)); render(); });
  if (g('psave')) g('psave').onclick = () => { yo.n = g('pn').value.trim() || yo.n; guardar(() => DB.perfilPropio(yo), 'Perfil guardado'); render(); };
  if (g('ppw')) g('ppw').onclick = miClave;
  if (g('plog')) g('plog').onclick = salir;
  enlazarFoto('pfoto', async blob => { toast('Subiendo foto…'); await guardar(() => subirFoto(S.yo, blob), 'Foto actualizada'); render(); });
  if (g('pfotodel')) g('pfotodel').onclick = async () => { await guardar(() => quitarFoto(S.yo), 'Foto eliminada'); render(); };
  if (g('ppush')) g('ppush').onclick = async () => toast(await activarPush(true) ? 'Notificaciones activadas en este dispositivo.' : 'No se pudieron activar. Revisa los permisos del navegador; en iPhone, primero instala la app en tu pantalla de inicio.');
  document.querySelectorAll('[data-nt]').forEach(c => c.onchange = () => { const [k, i] = c.dataset.nt.split(':'); CFG.notif[k][+i] = c.checked; guardar(() => DB.config(), 'Configuración aplicada a todo el equipo'); });
  if (g('uinv')) g('uinv').onclick = () => eqForm();
  document.querySelectorAll('[data-ue]').forEach(b => b.onclick = () => eqForm(b.dataset.ue));
  document.querySelectorAll('[data-ut]').forEach(sl => sl.onchange = () => { const p = PERS[sl.dataset.ut]; p.t = sl.value === 'Usuario' ? 'usuario' : 'admin'; p.tipo = sl.value; p.admin = p.t === 'admin'; guardar(() => DB.perfilAdmin(sl.dataset.ut, p), `${p.n} ahora es ${sl.value.toLowerCase()}`); render(); });
  document.querySelectorAll('[data-ua]').forEach(c => c.onchange = () => { const p = PERS[c.dataset.ua]; p.off = !c.checked; guardar(() => DB.perfilAdmin(c.dataset.ua, p)); toast(c.checked ? `${p.n} reactivado` : `${p.n} desactivado`); });
  if (g('msave')) g('msave').onclick = () => { document.querySelectorAll('[data-meta]').forEach(i => META[i.dataset.meta] = Math.max(0, Math.min(100, +i.value || 0))); guardar(() => DB.config(), 'Metas guardadas. El Dashboard ya las usa.'); };
  document.querySelectorAll('[data-cadd]').forEach(b => b.onclick = () => { const ci = +b.dataset.cadd, v = document.querySelector(`[data-cin="${ci}"]`).value.trim(); if (!v) return; const arr = S._cats[ci][1]; arr.push(v); guardar(() => DB.catalogoAgregar(CAT_TIPO[S._cats[ci][0]], v, arr.length)); render(); });
  document.querySelectorAll('[data-cdel]').forEach(b => b.onclick = () => { const [ci, i] = b.dataset.cdel.split(':').map(Number); const arr = S._cats[ci][1]; if (arr.length <= 1) { toast('El catálogo debe tener al menos una opción.'); return; } const v0 = arr[i]; arr.splice(i, 1); guardar(() => DB.catalogoQuitar(CAT_TIPO[S._cats[ci][0]], v0)); render(); });
  if (g('rsave')) g('rsave').onclick = () => { CFG.horaRep = g('rh').value || '19:00'; CFG.horaAgenda = g('ra').value || '09:00'; guardar(() => DB.config()); toast(`Agenda a las ${CFG.horaAgenda} · cierre automático a las ${CFG.horaRep}`); };
}


/* =====================================================================
   USUARIO DE ÁREA SOLICITANTE (Académico)
   ===================================================================== */
const esExt = k => !!(PERS[k] && PERS[k].ext);
const proysArea = k => PROY.filter(p => p.area === PERS[k].area || (p.inv || []).includes(k));
const entregablesDe = p => A.filter(a => a.p === p.id && a.val);
const extEst = a => !a.ext ? (a.st === 'Terminado' ? 'Aprobado' : 'Próximo') : a.ext.st;
const EXC = { 'Próximo': ['#8A9BA6', 'Próximo'], 'Por validar': ['#3C74D6', 'Por revisar'], 'Aprobado': ['#2E9E62', 'Aprobado'], 'Cambios': ['#E86A17', 'Cambios solicitados'] };
const exChip = a => { const e = EXC[extEst(a)]; return `<span class="ichip" style="--c:${e[0]}">${e[1]}</span>`; };
const porRevisarDe = k => proysArea(k).flatMap(p => entregablesDe(p).filter(a => a.ext && a.ext.st === 'Por validar').map(a => ({ a, p })));
const retroPend = k => proysArea(k).filter(p => p.est === 'Terminado' && !(p.imp && p.imp.final));
const verComo = () => ``;
const bindVerComo = () => { (document.getElementById('as') || {}).onchange = e => { S.yo = e.target.value; render(); }; };

function renderAcInicio() {
  const yo = PERS[S.yo], ps = proysArea(S.yo), act = ps.filter(p => p.est === 'Activo'), rev = porRevisarDe(S.yo), ret = retroPend(S.yo);
  const prox = act.flatMap(p => entregablesDe(p).filter(a => !a.ext && a.st !== 'Terminado').map(a => ({ a, p }))).sort((x, y) => x.a.f.localeCompare(y.a.f)).slice(0, 5);
  const d = new Date(), sal = d.getHours() < 12 ? 'Buenos días' : d.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Inicio</h1><span class="date">${DIA[d.getDay()].replace(/^./, c => c.toUpperCase())} ${d.getDate()} de ${MES[d.getMonth()]}, ${d.getFullYear()}</span><div class="acts">${verComo()}</div></div>
    <section class="band"><div><small>Área ${esc(yo.area)} · Innovación &amp; Disrupción</small><h2>${sal}, ${esc(yo.n.split(' ')[0])}. Así van los proyectos de tu área.</h2></div>
      <div class="kp"><div class="kpi"><div class="l">Proyectos activos</div><b>${act.length}</b><em>de tu área</em></div><div class="kpi"><div class="l">Por revisar</div><b style="color:${rev.length ? '#8C2341' : ''}">${rev.length}</b><em>entregables esperan tu visto bueno</em></div><div class="kpi"><div class="l">Terminados</div><b>${ps.filter(p => p.est === 'Terminado').length}</b><em>${ret.length} esperan tu retroalimentación</em></div></div></section>
    ${rev.length ? `<section class="card acrev"><div class="ch"><h3>Entregables por revisar</h3><span class="badge r" style="background:#F4E4EA;color:#8C2341">${rev.length}</span></div><div class="rows">${rev.map(({ a, p }) => `<div class="rw"><span class="okc" style="background:#3C74D6;color:#fff">!</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m">${esc(p.n)} · enviado el ${fs(a.ext.fenv)}${diasEntre(a.ext.fenv, HOY) >= 3 ? ` · <span class="lt">${diasEntre(a.ext.fenv, HOY)} días esperando</span>` : ''}</div></div><button class="btn dark sm" data-acr="${a.id}">Revisar</button></div>`).join('')}</div></section>` : ''}
    <div class="row2">
      <section class="card"><div class="ch"><h3>Proyectos de tu área</h3><button class="btn sm r" id="acall">Ver todos</button></div>${act.length ? act.map(p => { const v = avance(p); return `<button class="acp" data-acp="${p.id}" style="--c:${p.c}"><div class="acp-h"><i></i><b>${esc(p.n)}</b><em>${v}%</em></div><div class="pbar"><i style="width:${Math.max(v, 2)}%;background:${p.c}"></i></div><small>Compromiso ${fs(p.comp)} · ${entregablesDe(p).filter(a => extEst(a) === 'Aprobado').length} de ${entregablesDe(p).length} entregables aprobados</small></button>`; }).join('') : '<div class="empty">Tu área no tiene proyectos activos.</div>'}</section>
      <section class="card"><div class="ch"><h3>Próximas entregas para tu revisión</h3></div>${prox.length ? `<div class="rows">${prox.map(({ a, p }) => `<div class="rw"><span class="okc pen">–</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m"><b>${fs(a.f)}</b> · ${esc(p.n)}</div></div></div>`).join('')}</div>` : '<div class="empty">Sin entregas programadas.</div>'}
        ${ret.length ? `<div class="acret"><b>Proyectos terminados: cuéntanos si sirvió</b>${ret.map(p => `<div class="rw"><span class="okc yes">✓</span><div style="min-width:0"><div class="t">${esc(p.n)}</div><div class="m">Terminado el ${fs(p.fter)}</div></div><button class="btn sm" data-acf="${p.id}">Dar retroalimentación</button></div>`).join('')}</div>` : ''}</section>
    </div>`;
  bindVerComo();
  document.querySelectorAll('[data-acr]').forEach(b => b.onclick = () => acRevisar(b.dataset.acr));
  document.querySelectorAll('[data-acp]').forEach(b => b.onclick = () => proyecto(b.dataset.acp));
  document.querySelectorAll('[data-acf]').forEach(b => b.onclick = () => acRetro(b.dataset.acf));
  document.getElementById('acall').onclick = () => { S.view = 'proy'; render(); };
}
function renderAcProy() {
  const ps = proysArea(S.yo), tab = S.acTab || 'Activo', list = ps.filter(p => p.est === tab);
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Mis proyectos</h1><span class="date">Área ${esc(PERS[S.yo].area)}</span><div class="acts">${verComo()}</div></div>
    <div class="tools"><div class="seg" id="actab">${['Activo', 'Terminado'].map(t => `<button data-t="${t}" class="${tab === t ? 'on' : ''}">${t === 'Activo' ? 'Activos' : 'Terminados'} · ${ps.filter(p => p.est === t).length}</button>`).join('')}</div></div>
    ${list.length ? `<div class="pgal">${list.map(p => { const v = avance(p), en = entregablesDe(p); return `<button class="pcard" data-acp="${p.id}"><div class="pcov" style="--c:${p.c}"><span class="chip">${esc(p.tipo)}</span>${en.some(a => extEst(a) === 'Por validar') ? '<span class="chip warn">Por revisar</span>' : ''}</div>
      <div class="pbody"><div class="pt2">${esc(p.n)}</div><div class="pinst">${esc(p.inst)}</div><div class="pgrid"><div><small>Solicitud</small><b>${fs(p.fsol)}</b></div><div><small>Compromiso</small><b>${fs(p.comp)}</b></div><div><small>Entregables</small><b>${en.filter(a => extEst(a) === 'Aprobado').length}/${en.length}</b></div></div>
      <div class="pfoot"><span>Avance</span><b>${v}%</b></div><div class="pbar"><i style="width:${Math.max(v, 2)}%;background:${p.c}"></i></div></div></button>`; }).join('')}</div>` : '<div class="empty">No hay proyectos en esta vista.</div>'}`;
  bindVerComo();
  document.querySelectorAll('#actab button').forEach(b => b.onclick = () => { S.acTab = b.dataset.t; render(); });
  document.querySelectorAll('[data-acp]').forEach(b => b.onclick = () => proyecto(b.dataset.acp));
}
function renderAcRev() {
  const rev = porRevisarDe(S.yo), hist = proysArea(S.yo).flatMap(p => entregablesDe(p).flatMap(a => (a.extH || []).map(h => ({ a, p, h })))).sort((x, y) => y.h.f.localeCompare(x.h.f));
  document.getElementById('main').innerHTML = `
    <div class="top"><h1>Por revisar</h1><span class="date">Entregables enviados a tu área</span><div class="acts">${verComo()}</div></div>
    <section class="card"><div class="ch"><h3>Esperan tu revisión</h3><span class="badge r">${rev.length}</span></div>${rev.length ? `<div class="rows">${rev.map(({ a, p }) => `<div class="rw"><span class="okc" style="background:#3C74D6;color:#fff">!</span><div style="min-width:0"><div class="t">${esc(a.t)}</div><div class="m">${esc(p.n)} · ${esc(a.ent || 'Entregable')} · enviado el ${fs(a.ext.fenv)}</div></div><button class="btn dark sm" data-acr="${a.id}">Revisar</button></div>`).join('')}</div>` : '<div class="empty">No tienes entregables por revisar.</div>'}</section>
    <section class="card"><div class="ch"><h3>Historial de revisiones</h3></div>${hist.length ? `<div class="tlx">${hist.map(({ a, p, h }) => `<div class="tx"><span class="tx-i" style="background:${h.ok ? '#2E9E62' : '#E86A17'}">${h.ok ? '✓' : '↺'}</span><div><b>${h.ok ? 'Aprobaste' : 'Solicitaste cambios en'} "${esc(a.t)}"</b><p>${esc(p.n)}${h.com ? ` · ${esc(h.com)}` : ''}</p></div><small>${fs(h.f)}</small></div>`).join('')}</div>` : '<div class="empty">Aún no hay revisiones.</div>'}</section>`;
  bindVerComo();
  document.querySelectorAll('[data-acr]').forEach(b => b.onclick = () => acRevisar(b.dataset.acr));
}
function extBloque(p) {
  const en = entregablesDe(p).sort((a, b) => a.f.localeCompare(b.f));
  return `<div class="extb"><h3 class="sh3" style="margin-top:0">Entregables para tu área</h3>${en.length ? `<div class="enl">${en.map(a => `<div class="en"><div class="en-d"><b>${fs(a.f)}</b></div><div style="flex:1;min-width:0"><b>${esc(a.t)}</b><small>${esc(a.ent || 'Entregable')}${a.ext && a.ubi ? ` · ${esc(a.ubi)}` : ''}</small></div>${exChip(a)}${a.ext && a.ext.st === 'Por validar' ? `<button class="btn dark sm" data-acr="${a.id}">Revisar</button>` : ''}</div>`).join('')}</div>` : '<div class="empty">Este proyecto no tiene entregables para revisión del área.</div>'}
    ${p.est === 'Terminado' && !(p.imp && p.imp.final) ? `<div class="sh-f" style="justify-content:flex-start"><button class="btn dark" data-acf="${p.id}">El proyecto terminó: dar retroalimentación</button></div>` : ''}</div>`;
}
function acProyecto(id) {
  const p = PROY.find(x => x.id === id), v = avance(p), en = entregablesDe(p).sort((a, b) => a.f.localeCompare(b.f)), eq = [...new Set(A.filter(a => a.p === p.id).map(a => a.r))];
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.tipo)}</span><span class="chip">${esc(p.inst)}</span><span class="chip ${p.est === 'Activo' ? 'id' : 'ok'}">${p.est}</span>${X}</div>
    <div class="ban" style="--c:${p.c}"></div><h2 class="ptitle">${esc(p.n)}</h2>
    <div class="dl"><div><small>Área solicitante</small><b>${esc(p.area)}</b></div><div><small>Fecha de solicitud</small><b>${fs(p.fsol)}</b></div><div><small>Fecha compromiso</small><b>${fs(p.comp)}</b></div>${p.est === 'Terminado' ? `<div><small>Terminado</small><b>${fs(p.fter)}</b></div>` : ''}</div>
    <div class="adv"><b>${v}%</b><div><div class="pbar"><i style="width:${Math.max(v, 2)}%;background:${p.c}"></i></div><small>Avance general del proyecto</small></div></div>
    <h3 class="sh3">Equipo responsable</h3><div class="people">${eq.map(k => `<div class="person">${av(k, 30)}<div><b>${esc(PERS[k].n)}</b><small>${esc(PERS[k].rol)}</small></div></div>`).join('')}</div>
    <h3 class="sh3">Entregables para tu área</h3>${en.length ? `<div class="enl">${en.map(a => `<div class="en"><div class="en-d"><b>${fs(a.f)}</b></div><div style="flex:1;min-width:0"><b>${esc(a.t)}</b><small>${esc(a.ent || 'Entregable')}${a.ext && a.ubi ? ` · ${esc(a.ubi)}` : ''}</small></div>${exChip(a)}${a.ext && a.ext.st === 'Por validar' ? `<button class="btn dark sm" data-acr="${a.id}">Revisar</button>` : ''}</div>`).join('')}</div>` : '<div class="empty">Este proyecto no tiene entregables para revisión del área.</div>'}
    ${p.est === 'Terminado' ? (p.imp && p.imp.final ? `<section class="dbox done"><h3>Tu retroalimentación</h3><p style="margin:0;font-size:13px">${esc(p.imp.com)}</p></section>` : `<section class="dbox"><h3>El proyecto terminó</h3><p class="sub" style="margin:0 0 10px">Cuéntanos si lo que entregamos sirvió y si ya lo están implementando.</p><button class="btn dark" data-acf="${p.id}">Dar retroalimentación</button></section>`) : ''}
    <div class="sh-f"><button class="btn" data-close>Cerrar</button></div>`, true);
  document.querySelectorAll('#sheet [data-acr]').forEach(b => b.onclick = () => acRevisar(b.dataset.acr));
  document.querySelectorAll('#sheet [data-acf]').forEach(b => b.onclick = () => acRetro(b.dataset.acf));
}
function acRevisar(id) {
  const a = A.find(x => x.id === id), p = pj(a.p);
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.n)}</span>${exChip(a)}${X}</div><h2 class="ptitle">${esc(a.t)}</h2>
    <div class="dl"><div><small>Entregable</small><b>${esc(a.ent || '—')}</b></div><div><small>¿Dónde está?</small><b>${esc(a.ubi || '—')}</b></div><div><small>Responsable</small><b>${esc(PERS[a.r].n)}</b></div><div><small>Enviado</small><b>${fs(a.ext.fenv)}</b></div></div>
    ${a.notas ? `<p class="iobj"><b>Notas del equipo:</b> ${esc(a.notas)}</p>` : ''}
    <div class="fg" style="margin-top:12px"><label class="f full"><span>Comentarios para el equipo</span><textarea class="in" id="acc" rows="4" placeholder="Si solicitas cambios, describe con claridad qué ajustar"></textarea></label></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn warn" id="acno">Solicitar cambios</button><button class="btn ok" id="acok">Aprobar entregable</button></div>`);
  const g = x => document.getElementById(x);
  g('acok').onclick = () => { guardar(() => q(SB.rpc('area_revisar', { p_actividad: a.id, p_aprobado: true, p_comentario: g('acc').value.trim() }))); a.ext = { ...a.ext, st: 'Aprobado', fresp: HOY }; (a.extH = a.extH || []).push({ ok: true, f: HOY, com: g('acc').value.trim(), por: S.yo }); toast(`Entregable aprobado. Se notificó a ${PERS[a.r].n} y a la supervisión.`); closeSheet(); render(); };
  g('acno').onclick = () => { const com = g('acc').value.trim(); if (!com) { toast('Describe los cambios que necesitas.'); return; }
    guardar(() => q(SB.rpc('area_revisar', { p_actividad: a.id, p_aprobado: false, p_comentario: com })).then(recargar));
    a.ext = { ...a.ext, st: 'Cambios', fresp: HOY }; (a.extH = a.extH || []).push({ ok: false, f: HOY, com, por: S.yo });
    a.aj = a.aj || []; a.aj.push({ com, sol: S.yo, f: HOY, ini: null, fin: null, area: true }); a.st = 'Requiere ajustes';
    toast(`Cambios solicitados. ${PERS[a.r].n} recibió la notificación con prioridad.`); closeSheet(); render(); };
}
function acRetro(id) {
  const p = PROY.find(x => x.id === id);
  openSheet(`<div class="sh-h"><span class="chip dark" style="--c:${p.c}">${esc(p.n)}</span>${X}</div><h2 class="ptitle">¿Lo que entregamos sirvió?</h2><p class="sub">Tu respuesta nos ayuda a medir el impacto real de nuestro trabajo.</p>
    <div class="fg"><div class="f full"><span>¿El proyecto cumplió lo que necesitaba tu área?</span><div class="opts" id="rv">${Object.keys(VALOR).map(k => `<button type="button" class="opt" data-x="${k}">${VALOR[k][1]}</button>`).join('')}</div></div>
      <div class="f"><span>¿Ya lo están implementando?</span><div class="opts" id="ri"><button type="button" class="opt" data-x="1">Sí</button><button type="button" class="opt" data-x="0">Todavía no</button></div></div>
      <label class="f"><span>¿Desde cuándo?</span><input class="in" type="date" id="rif" value="${HOY}"></label>
      <label class="f full"><span>Comentarios</span><textarea class="in" id="rc" rows="4" placeholder="Qué resultados han visto y qué mejorarían"></textarea></label></div>
    <div class="sh-f"><button class="btn" data-close>Cancelar</button><button class="btn dark" id="rok">Enviar retroalimentación</button></div>`);
  ['rv', 'ri'].forEach(id2 => document.querySelectorAll(`#${id2} .opt`).forEach(b => b.onclick = () => document.querySelectorAll(`#${id2} .opt`).forEach(x => x.classList.toggle('on', x === b))));
  document.getElementById('rok').onclick = () => { const v = document.querySelector('#rv .on'), im = document.querySelector('#ri .on'), com = document.getElementById('rc').value.trim();
    if (!v || !im || !com) { toast('Responde si sirvió, si ya lo implementan y deja tus comentarios.'); return; }
    p.imp = { frec: HOY, medio: 'Plataforma', quien: `${PERS[S.yo].n}, ${PERS[S.yo].rol}`, com, valor: v.dataset.x, final: true, por: S.yo, ffin: HOY, impl: im.dataset.x === '1' ? document.getElementById('rif').value : null };
    guardar(() => q(SB.rpc('area_retro', { p_proyecto: p.id, p_valor: p.imp.valor, p_impl: p.imp.impl, p_comentario: com })));
    toast('¡Gracias! Tu retroalimentación quedó registrada como impacto validado.'); closeSheet(); render(); };
}

function pintarCierre() {
 const cd = document.getElementById('closeday'), r = repDe(S.yo, HOY);
    if (!esHabil(HOY) || esExt(S.yo)) cd.innerHTML = '';
    else if (r && !r.auto) cd.innerHTML = `<div class="cd-in done"><b>Día cerrado ✓</b><small>Reporte enviado a las ${r.h}.</small></div>`;
    else cd.innerHTML = `<div class="cd-in solo"><button id="cdbtn">Enviar reporte</button></div>`;
    const b = document.getElementById('cdbtn'); if (b) b.onclick = cierreDia; 
}

/* =====================================================================
   APP MÓVIL: barra inferior, menú "Más" y vista en marco de celular
   ===================================================================== */
const TABS = {
  maestra: [['navIni', 'Inicio', 'ini'], ['navDash', 'Dashboard', 'dash'], ['navProy', 'Proyectos', 'proy'], ['navInd', 'Individuales', 'ind']],
  admin: [['navIni', 'Inicio', 'ini'], ['navDash', 'Dashboard', 'dash'], ['navProy', 'Proyectos', 'proy'], ['navInd', 'Individuales', 'ind']],
  user: [['navIni', 'Inicio', 'ini'], ['navProy', 'Proyectos', 'proy'], ['navInd', 'Individuales', 'ind'], ['navInn', 'Innovación', 'inn']],
  ext: [['navIni', 'Inicio', 'ini'], ['navProy', 'Proyectos', 'proy'], ['navRev', 'Por revisar', 'rev'], ['navAdmin', 'Perfil', 'aj']]
};
const esMovil = () => S.phone || window.innerWidth <= 760;
function pintarMovil() {
  document.body.classList.toggle('m', esMovil());
  const tb = document.getElementById('tabbar'); if (!tb) return;
  const yo = PERS[S.yo], set = yo.ext ? TABS.ext : yo.admin ? TABS.admin : TABS.user;
  const badge = id => { const b = document.querySelector(`#${id} .b`); return b && b.style.display !== 'none' ? b.textContent : ''; };
  const icon = id => (document.querySelector(`#${id} svg`) || {}).outerHTML || '';
  const enMas = [...document.querySelectorAll('.side .nav button')].filter(b => b.offsetParent !== null || b.style.display !== 'none').filter(b => b.style.display !== 'none' && !set.some(t => t[0] === b.id));
  const masN = enMas.reduce((n, b) => n + (+badge(b.id) || 0), 0);
  tb.innerHTML = set.map(([id, n, v]) => `<button class="${S.view === v ? 'on' : ''}" data-tab="${id}">${icon(id)}<span>${n}</span>${badge(id) ? `<i>${badge(id)}</i>` : ''}</button>`).join('')
    + (yo.ext ? '' : `<button data-tab="mas" class="${set.some(t => t[2] === S.view) ? '' : 'on'}"><svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg><span>Más</span>${masN ? `<i>${masN}</i>` : ''}</button>`);
  tb.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { if (b.dataset.tab === 'mas') return menuMas(enMas.map(x => x.id)); document.getElementById(b.dataset.tab).click(); document.getElementById('scroller').scrollTo?.(0, 0); window.scrollTo(0, 0); });
  const mt = document.getElementById('mtop'); if (mt) { mt.innerHTML = `<span class="logo">${document.querySelector('.side .logo').innerHTML}</span><div><b>Innovación &amp; Disrupción</b><small>Grupo Exponencial</small></div>`; const bw = document.querySelector('#main .bellw'); if (bw && esMovil()) mt.appendChild(bw); }
  const pv = document.getElementById('phonebtn'); if (pv) { pv.style.display = window.innerWidth > 760 ? '' : 'none'; pv.textContent = S.phone ? 'Vista escritorio' : 'Vista app'; }
}
function menuMas(ids) {
  const yo = PERS[S.yo], r = repDe(S.yo, HOY), cierre = !yo.ext && esHabil(HOY);
  openSheet(`<div class="sh-h"><h2>Más</h2>${X}</div>
    <div class="mas-p">${av(S.yo, 46)}<div><b>${esc(yo.n)}</b><small>${esc(yo.rol)} · ${esc(yo.tipo)}</small></div></div>
    <div class="mas-l">${ids.map(id => { const b = document.getElementById(id), lab = [...b.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(), bd = b.querySelector('.b'); return `<button data-mas="${id}">${b.querySelector('svg').outerHTML}<span>${esc(lab)}</span>${bd && bd.style.display !== 'none' ? `<i>${bd.textContent}</i>` : ''}<em>›</em></button>`; }).join('')}</div>
    <button class="btn" id="maslog" style="width:100%;margin-top:10px;justify-content:center;color:var(--bad)">Cerrar sesión</button>
    ${cierre ? (r && !r.auto ? `<div class="cd-in done" style="margin-top:12px"><b>Día cerrado ✓</b><small>Reporte enviado a las ${r.h}.</small></div>` : '<button class="btn dark" id="masrep" style="width:100%;margin-top:12px;justify-content:center;background:#8C2341;border-color:#8C2341">Enviar reporte</button>') : ''}`);
  document.querySelectorAll('[data-mas]').forEach(b => b.onclick = () => { closeSheet(); document.getElementById(b.dataset.mas).click(); });
  const mr = document.getElementById('masrep'); if (mr) mr.onclick = () => { closeSheet(); cierreDia(); };
  document.getElementById('maslog').onclick = salir;
}
if (document.getElementById('phonebtn')) document.getElementById('phonebtn').onclick = () => { S.phone = !S.phone; document.body.classList.toggle('phone', S.phone); render(); };
window.addEventListener('resize', () => pintarMovil());

function render() {
  const ext = esExt(S.yo);
  if (ext && !['ini', 'proy', 'rev', 'aj'].includes(S.view)) S.view = 'ini';
  if (!ext && S.view === 'rev') S.view = 'ini';
  ['navDash', 'navInn', 'navIniv', 'navProg', 'navImp', 'navInd', 'navEq'].forEach(id => { const b = document.getElementById(id); if (b && ext) b.style.display = 'none'; else if (b && !['navDash', 'navProg', 'navImp', 'navEq'].includes(id)) b.style.display = ''; });
  document.getElementById('navRev').style.display = ext ? '' : 'none';
  document.getElementById('navRev').classList.toggle('on', S.view === 'rev');
  document.getElementById('navProy').childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ext ? 'Mis proyectos' : 'Proyectos'; });
  if (['prog', 'imp', 'eq', 'dash'].includes(S.view) && !PERS[S.yo].admin) S.view = 'ini';
  document.getElementById('navDash').style.display = PERS[S.yo].admin ? '' : 'none';
  document.getElementById('navDash').classList.toggle('on', S.view === 'dash');
  document.getElementById('navEq').style.display = PERS[S.yo].admin ? '' : 'none';
  document.getElementById('navEq').classList.toggle('on', S.view === 'eq');
  document.getElementById('navImp').style.display = PERS[S.yo].admin ? '' : 'none';
  document.getElementById('navImp').classList.toggle('on', S.view === 'imp');
  document.getElementById('navProg').style.display = PERS[S.yo].admin ? '' : 'none';
  document.getElementById('navProg').classList.toggle('on', S.view === 'prog');
  document.getElementById('navIni').classList.toggle('on', S.view === 'ini');
  document.getElementById('navProy').classList.toggle('on', S.view === 'proy');
  document.getElementById('navInn').classList.toggle('on', S.view === 'inn');
  document.getElementById('navInd').classList.toggle('on', S.view === 'ind');
  document.getElementById('navIniv').classList.toggle('on', S.view === 'iniv');
  document.getElementById('foot').innerHTML = `${av(S.yo, 40)}<div style="min-width:0"><b>${esc(PERS[S.yo].n)}</b><small>${esc(PERS[S.yo].rol)} · ${esc(PERS[S.yo].tipo)}</small></div>`;
  document.getElementById('navAdmin').classList.toggle('on', S.view === 'aj');
  if (ext && S.view === 'ini') renderAcInicio(); else if (S.view === 'rev') renderAcRev(); else if (S.view === 'aj') renderAjustes(); else if (S.view === 'ind') renderInd(); else if (S.view === 'dash') renderDash(); else if (S.view === 'eq') renderEq(); else if (S.view === 'iniv') renderIni(); else if (S.view === 'imp') renderImp(); else if (S.view === 'proy') renderProy(); else if (S.view === 'prog') renderProg(); else if (S.view === 'inn') renderInn(); else renderInicio();
  pintarNotificaciones();
  pintarCierre();
  pintarMovil();
}
document.getElementById('navIni').onclick = () => { S.view = 'ini'; closeSheet(); render(); };
document.querySelectorAll('.side .nav button').forEach(b => b.addEventListener('click', () => { const f = document.getElementById('scroller'); if (f) f.scrollTop = 0; }));
document.getElementById('navProy').onclick = () => { S.view = 'proy'; closeSheet(); render(); };
document.getElementById('navInn').onclick = () => { S.view = 'inn'; closeSheet(); render(); };
document.getElementById('navIniv').onclick = () => { S.view = 'iniv'; closeSheet(); render(); };
document.getElementById('navRev').onclick = () => { S.view = 'rev'; closeSheet(); render(); };
document.getElementById('navAdmin').onclick = () => { S.view = 'aj'; closeSheet(); render(); };
document.getElementById('navInd').onclick = () => { S.view = 'ind'; closeSheet(); render(); };
document.getElementById('navDash').onclick = () => { S.view = 'dash'; closeSheet(); render(); };
document.getElementById('navEq').onclick = () => { S.view = 'eq'; closeSheet(); render(); };
document.getElementById('navImp').onclick = () => { S.view = 'imp'; closeSheet(); render(); };
document.getElementById('navProg').onclick = () => { S.view = 'prog'; closeSheet(); render(); };


/* =====================================================================
   DATOS: conexión con Supabase, carga y guardado
   ===================================================================== */
const CONF = window.ID_CONFIG;
const SB = window.supabase.createClient(CONF.supabaseUrl, CONF.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
const TIPO_LABEL = { maestra: 'Administradora maestra', admin: 'Administradora', usuario: 'Usuario', area: 'Área solicitante' };
const loc = ts => { if (!ts) return null; const d = new Date(ts); return `${iso(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const tsz = s => s ? new Date(s).toISOString() : null;
const TIEMPO = {};
let CATS = [];
async function q(p) { const { data, error } = await p; if (error) throw error; return data; }
const mapAj = j => ({ id: j.id, com: j.comentario, sol: j.solicitado_por, f: j.fecha, ini: loc(j.inicio), fin: loc(j.fin), area: j.del_area });
const vaciar = o => Array.isArray(o) ? (o.length = 0) : Object.keys(o).forEach(k => delete o[k]);

async function cargar() {
  const yo = PERS[S.yo] || {};
  const tabla = (t, f) => q(f ? f(SB.from(t).select('*')) : SB.from(t).select('*'));
  const [perf, cats, cfg, proys, peq, acts, ajs, revs, inds, reps, inns, innc, inis, accs, progs, tiempo] = await Promise.all([
    tabla('perfiles'), tabla('catalogos', x => x.order('orden')), q(SB.from('config').select('*').maybeSingle()), tabla('proyectos'), tabla('proyecto_equipo'),
    tabla('actividades'), tabla('ajustes', x => x.order('created_at')), tabla('ext_revisiones', x => x.order('created_at')), tabla('individuales'), tabla('reportes_cierre'),
    tabla('innovaciones'), tabla('innovacion_comentarios', x => x.order('created_at')), tabla('iniciativas'), tabla('ini_acciones', x => x.order('orden')), tabla('programas'), tabla('tiempo_plataforma')]);
  vaciar(PERS);
  perf.forEach(p => PERS[p.id] = { n: p.nombre || p.email, rol: p.rol || '', tipo: TIPO_LABEL[p.tipo], t: p.tipo, admin: ['maestra', 'admin'].includes(p.tipo), maestra: p.tipo === 'maestra', ext: p.tipo === 'area', area: p.area, c: p.color || '#14394D', off: !p.activo, email: p.email, foto: p.foto || null, desde: p.created_at ? iso(new Date(p.created_at)) : null });
  CATS = cats;
  const fill = (arr, t) => { const v = cats.filter(c => c.tipo === t).map(c => c.valor); arr.length = 0; arr.push(...v); };
  fill(TIPOS, 'tipo_proyecto'); fill(INSTS, 'institucion'); fill(AREAS, 'area'); fill(MEDIOS_E, 'medio_entrega'); fill(MEDIOS, 'medio_retro');
  if (cfg) { Object.assign(META, cfg.metas || {}); CFG.horaRep = cfg.hora_rep || CFG.horaRep; CFG.horaAgenda = cfg.hora_agenda || CFG.horaAgenda; Object.entries(cfg.notif || {}).forEach(([k, v]) => { if (CFG.notif[k]) CFG.notif[k] = v; }); }
  vaciar(PROY);
  proys.forEach(p => PROY.push({ id: p.id, n: p.nombre, c: p.color || '#8C2341', comp: p.fcomp, fsol: p.fsol, tipo: p.tipo, inst: p.institucion, area: p.area, est: p.estado, fter: p.fter,
    eq: peq.filter(x => x.proyecto_id === p.id).map(x => x.perfil_id),
    imp: p.imp_frec || p.imp_final ? { frec: p.imp_frec, medio: p.imp_medio, quien: p.imp_quien || '', com: p.imp_com || '', valor: p.imp_valor || '', impl: p.imp_impl, final: p.imp_final, por: p.imp_por, ffin: p.imp_ffin } : undefined }));
  vaciar(A);
  acts.forEach(a => A.push({ id: a.id, p: a.proyecto_id, t: a.titulo, r: a.responsable, sup: a.supervisor || a.responsable, ini: a.inicio || a.entrega, f: a.entrega, h: (a.hora || '17:00').slice(0, 5), st: a.estado,
    ent: a.entregable || '', ubi: a.ubicacion || '', notas: a.notas || '', val: a.requiere_val, ext: a.ext_estado ? { st: a.ext_estado === 'Aprobado' ? 'Aprobado' : a.ext_estado, fenv: a.ext_fenv } : null,
    extH: revs.filter(r => r.actividad_id === a.id).map(r => ({ ok: r.aprobado, f: r.fecha, com: r.comentario || '', por: r.por })),
    fdone: a.fdone ? iso(new Date(a.fdone)) : null, aj: ajs.filter(j => j.actividad_id === a.id).map(mapAj) }));
  vaciar(IND);
  inds.forEach(a => { const fsolH = loc(a.fsol), fH = loc(a.fentrega), doneH = loc(a.fdone);
    IND.push({ id: a.id, t: a.titulo, area: a.area, sol: a.solicitante || '', r: a.responsable, sup: a.requiere_sup, aut: a.autoriza, fsolH, fH, fsol: fsolH.slice(0, 10), f: fH.slice(0, 10), st: a.estado,
      ent: a.entregado || '', medio: a.medio || '', ubi: a.ubicacion || '', doneH, fdone: a.estado === 'Terminado' && doneH ? doneH.slice(0, 10) : null, notas: a.notas || '', aj: ajs.filter(j => j.individual_id === a.id).map(mapAj) }); });
  vaciar(REP);
  reps.forEach(r => { (REP[r.perfil_id] = REP[r.perfil_id] || {})[r.fecha] = { h: (r.hora || '').slice(0, 5), auto: r.automatico, com: r.comentarios || '', bloq: r.bloqueos || '' }; });
  vaciar(INN);
  inns.forEach(n => INN.push({ id: n.id, r: n.perfil_id, n: n.nombre, tarea: n.tarea || '', obj: n.objetivo || '', sem: n.semana, ahorroE: +n.ahorro_est || 0, ahorro: `${+n.ahorro_est || 0} h por semana`, est: n.estado,
    sub: n.subtareas || [], av: n.avances || [], fb: n.fb, com: innc.filter(c => c.innovacion_id === n.id).map(c => ({ k: c.perfil_id, f: c.fecha, t: c.texto })) }));
  vaciar(INI);
  inis.forEach(i => INI.push({ id: i.id, t: i.trimestre, n: i.nombre, obj: i.objetivo || '', kpi: i.kpi || KPIS[0], meta: i.meta || '', c: i.color || '#3C74D6',
    acc: accs.filter(x => x.iniciativa_id === i.id).map(x => ({ id: x.id, a: x.accion, r: x.responsable, lim: x.limite, res: x.resultado || '', fel: x.felab, obt: x.obtenido || '', ok: x.cumplio, w: 0 })) }));
  vaciar(PROGS);
  progs.forEach(g => PROGS.push({ id: g.id, n: g.nombre, cli: g.cliente || '', inst: g.institucion || '', c: g.color || '#7A4CE0', horas: +g.horas || 0, grupos: g.grupos || 1, porSes: g.por_sesiones, nSes: g.n_sesiones || 0, est: g.estado,
    mods: (g.modulos || []).map((m, k) => ({ n: m.n, ini: m.ini, fin: m.fin, ses: m.ses || [], profs: m.profs || [], k })) }));
  vaciar(TIEMPO);
  tiempo.forEach(t => { (TIEMPO[t.perfil_id] = TIEMPO[t.perfil_id] || {})[t.fecha] = { s: t.segundos, post: t.segundos_post }; });
}

async function guardar(fn, okMsg) {
  try { await fn(); if (okMsg) toast(okMsg); return true; }
  catch (e) { console.error(e); toast('No se pudo guardar: ' + (e.message || 'revisa tu conexión')); await recargar(); return false; }
}
async function recargar() { try { await cargar(); } catch (e) { console.error(e); } const sh = document.getElementById('sheet'); render(); if (sh.classList.contains('on') && S._reabrir) S._reabrir(); }

const DB = {
  proyecto: async (p, nuevo) => {
    const row = { nombre: p.n, tipo: p.tipo, institucion: p.inst, area: p.area, fsol: p.fsol || null, fcomp: p.comp || null, color: p.c, estado: p.est || 'Activo', fter: p.fter || null };
    if (nuevo) await q(SB.from('proyectos').insert({ id: p.id, ...row })); else await q(SB.from('proyectos').update(row).eq('id', p.id));
    await q(SB.from('proyecto_equipo').delete().eq('proyecto_id', p.id));
    if (p.eq.length) await q(SB.from('proyecto_equipo').insert(p.eq.map(k => ({ proyecto_id: p.id, perfil_id: k }))));
  },
  estadoProyecto: p => q(SB.from('proyectos').update({ estado: p.est, fter: p.est === 'Terminado' ? (p.fter || HOY) : null, ...(p.est === 'Terminado' ? {} : { imp_frec: null, imp_final: false }) }).eq('id', p.id)),
  impacto: p => q(SB.from('proyectos').update({ imp_frec: p.imp.frec || null, imp_medio: p.imp.medio || null, imp_quien: p.imp.quien || null, imp_com: p.imp.com || null, imp_valor: p.imp.valor || null, imp_impl: p.imp.impl || null, imp_final: !!p.imp.final, imp_por: S.yo, imp_ffin: p.imp.final ? HOY : null }).eq('id', p.id)),
  actividad: (a, nuevo) => {
    const row = { proyecto_id: a.p, titulo: a.t, responsable: a.r, supervisor: a.sup || a.r, inicio: a.ini || a.f, entrega: a.f, hora: a.h || '17:00', entregable: a.ent || null, ubicacion: a.ubi || null, notas: a.notas || null, estado: a.st, requiere_val: !!a.val };
    if (!PERS[S.yo].admin) { delete row.proyecto_id; delete row.responsable; delete row.requiere_val; }
    return nuevo ? q(SB.from('actividades').insert({ id: a.id, ...row })) : q(SB.from('actividades').update(row).eq('id', a.id));
  },
  estado: (tabla, id, estado, extra = {}) => q(SB.from(tabla).update({ estado, ...extra }).eq('id', id)),
  ajuste: (j, campo, id) => q(SB.from('ajustes').insert({ id: j.id, [campo]: id, solicitado_por: S.yo, fecha: j.f, comentario: j.com, del_area: !!j.area })),
  ajusteFechas: j => q(SB.from('ajustes').update({ inicio: tsz(j.ini), fin: tsz(j.fin) }).eq('id', j.id)),
  individual: (a, nuevo) => {
    const row = { titulo: a.t, area: a.area, solicitante: a.sol, responsable: a.r, requiere_sup: !!a.sup, autoriza: a.sup ? a.aut : null, fsol: tsz(a.fsolH), fentrega: tsz(a.fH), notas: a.notas || null };
    if (!PERS[S.yo].admin && !nuevo) { delete row.responsable; delete row.requiere_sup; delete row.autoriza; }
    return nuevo ? q(SB.from('individuales').insert({ id: a.id, estado: 'Pendiente', ...row })) : q(SB.from('individuales').update(row).eq('id', a.id));
  },
  entregaInd: a => q(SB.from('individuales').update({ entregado: a.ent, medio: a.medio, ubicacion: a.ubi, fdone: tsz(a.doneH), estado: a.st }).eq('id', a.id)),
  innovacion: (n, nuevo) => {
    const row = { nombre: n.n, tarea: n.tarea, objetivo: n.obj, semana: n.sem, ahorro_est: n.ahorroE, estado: n.est, subtareas: n.sub, avances: n.av, fb: n.fb || null };
    return nuevo ? q(SB.from('innovaciones').insert({ id: n.id, perfil_id: S.yo, ...row })) : q(SB.from('innovaciones').update(row).eq('id', n.id));
  },
  comentarioInn: (n, t) => q(SB.from('innovacion_comentarios').insert({ innovacion_id: n.id, perfil_id: S.yo, texto: t })),
  iniciativa: (i, nuevo) => { const row = { trimestre: i.t, nombre: i.n, objetivo: i.obj, kpi: i.kpi, meta: i.meta, color: i.c }; return nuevo ? q(SB.from('iniciativas').insert({ id: i.id, ...row })) : q(SB.from('iniciativas').update(row).eq('id', i.id)); },
  borrarIniciativa: i => q(SB.from('iniciativas').delete().eq('id', i.id)),
  accion: (i, x, nuevo, orden) => {
    if (!PERS[S.yo].admin) return q(SB.from('ini_acciones').update({ felab: x.fel || null, obtenido: x.obt || null }).eq('id', x.id));
    const row = { iniciativa_id: i.id, accion: x.a, responsable: x.r, limite: x.lim, resultado: x.res, felab: x.fel || null, obtenido: x.obt || null, cumplio: x.ok, orden: orden || 0 };
    return nuevo ? q(SB.from('ini_acciones').insert({ id: x.id, ...row })) : q(SB.from('ini_acciones').update(row).eq('id', x.id));
  },
  borrarAccion: x => q(SB.from('ini_acciones').delete().eq('id', x.id)),
  programa: (g, nuevo) => {
    const row = { nombre: g.n, cliente: g.cli, institucion: g.inst, color: g.c, horas: g.horas, grupos: g.grupos, por_sesiones: !!g.porSes, n_sesiones: g.nSes || 0, estado: g.est || 'En curso', modulos: g.mods.map(m => ({ n: m.n, ini: m.ini, fin: m.fin, ses: m.ses || [], profs: m.profs || [] })) };
    return nuevo ? q(SB.from('programas').insert({ id: g.id, ...row })) : q(SB.from('programas').update(row).eq('id', g.id));
  },
  perfilPropio: p => q(SB.from('perfiles').update({ nombre: p.n, color: p.c }).eq('id', S.yo)),
  perfilAdmin: (k, p) => q(SB.rpc('actualizar_perfil', { p: k, p_rol: p.rol, p_tipo: p.t, p_activo: !p.off, p_area: p.t === 'area' ? p.area : null })),
  config: () => q(SB.from('config').update({ metas: META, hora_agenda: CFG.horaAgenda, hora_rep: CFG.horaRep, notif: CFG.notif, updated_at: new Date().toISOString() }).eq('id', 1)),
  catalogoAgregar: (tipo, valor, orden) => q(SB.from('catalogos').insert({ tipo, valor, orden })),
  catalogoQuitar: (tipo, valor) => q(SB.from('catalogos').delete().eq('tipo', tipo).eq('valor', valor)),
  funcion: async (nombre, body) => { const { data, error } = await SB.functions.invoke(nombre, { body });
    if (error) { let m = error.message, st = error.context && error.context.status; try { const j = await error.context.clone().json(); m = j.error || j.message || j.msg || m; } catch (e) { try { m = (await error.context.text()) || m; } catch (x) { } }
      const pista = st === 401 ? ' Revisa que la función tenga desactivado "Verify JWT".' : st === 404 ? ` La función "${nombre}" no está publicada con ese nombre.` : '';
      throw new Error(`${m}${st ? ` (código ${st})` : ''}.${pista}`); }
    if (data && data.error) throw new Error(data.error); return data; }
};
const CAT_TIPO = { 'Tipos de proyecto': 'tipo_proyecto', 'Instituciones': 'institucion', 'Áreas solicitantes': 'area', 'Medios de entrega': 'medio_entrega', 'Medios de retroalimentación': 'medio_retro' };

/* ---------- Tiempo en plataforma: un latido por minuto, una sola pestaña ---------- */
let latido = null;
function iniciarTiempo() {
  if (latido || !PERS[S.yo] || PERS[S.yo].ext) return;
  const canal = 'BroadcastChannel' in window ? new BroadcastChannel('id-tiempo') : null, yoTab = uid(); let lider = true;
  if (canal) { canal.onmessage = e => { if (e.data && e.data.tab !== yoTab && e.data.t > Date.now() - 70000) lider = e.data.tab < yoTab; }; }
  const pulso = () => { if (canal) canal.postMessage({ tab: yoTab, t: Date.now() }); if (lider) SB.rpc('sumar_tiempo').then(() => { }, () => { }); };
  pulso(); latido = setInterval(pulso, 60000);
}

/* ---------- Notificaciones push: registrar el dispositivo ---------- */
async function activarPush(pedir) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !CONF.vapidPublicKey) return false;
    if (Notification.permission === 'denied') return false;
    if (Notification.permission !== 'granted') { if (!pedir) return false; if (await Notification.requestPermission() !== 'granted') return false; }
    const reg = await navigator.serviceWorker.ready;
    const b64 = s => { const p = '='.repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...r].map(c => c.charCodeAt(0))); };
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(CONF.vapidPublicKey) });
    const j = sub.toJSON();
    await SB.from('push_suscripciones').upsert({ perfil_id: S.yo, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: 'endpoint' });
    return true;
  } catch (e) { console.warn('push', e); return false; }
}

/* ---------- Acceso ---------- */
const HASH0 = location.hash;
const authBox = document.getElementById('auth');
function pantallaAcceso(modo, msg) {
  document.body.classList.add('sin-sesion');
  const t = { entrar: ['Entrar', 'Escribe tu correo y contraseña.'], olvido: ['Recuperar contraseña', 'Te enviaremos un correo para crear una nueva contraseña.'], crear: ['Crea tu contraseña', 'Elige una contraseña para entrar a la plataforma.'] }[modo];
  authBox.innerHTML = `<div class="au-card"><div class="au-logo"><img src="icono-192.png" alt=""></div><h1>Innovación &amp; Disrupción</h1><p class="au-sub">Grupo Exponencial</p>
    <h2>${t[0]}</h2><p class="au-tx">${t[1]}</p>${msg ? `<div class="au-msg">${esc(msg)}</div>` : ''}
    ${modo === 'crear' ? '<label class="f"><span>Nueva contraseña</span><input class="in" type="password" id="ap1" autocomplete="new-password" minlength="8"></label><label class="f"><span>Confirma la contraseña</span><input class="in" type="password" id="ap2" autocomplete="new-password"></label>'
      : `<label class="f"><span>Correo</span><input class="in" type="email" id="ae" autocomplete="email" value="${esc(localStorage.getItem('id-email') || '')}"></label>${modo === 'entrar' ? '<label class="f"><span>Contraseña</span><input class="in" type="password" id="ap" autocomplete="current-password"></label>' : ''}`}
    <button class="btn dark au-btn" id="ago">${modo === 'entrar' ? 'Entrar' : modo === 'olvido' ? 'Enviar correo' : 'Guardar y entrar'}</button>
    ${modo === 'entrar' ? '<p class="au-tx" style="text-align:center;margin-top:4px">¿Olvidaste tu contraseña? Pide a la administradora que la restablezca.</p>' : ''}</div>`;
  const g = x => document.getElementById(x);
  const go = async () => {
    const b = g('ago'); b.disabled = true;
    try {
      if (modo === 'entrar') { const email = g('ae').value.trim(); localStorage.setItem('id-email', email); const { error } = await SB.auth.signInWithPassword({ email, password: g('ap').value }); if (error) throw new Error(/invalid/i.test(error.message) ? 'Correo o contraseña incorrectos.' : error.message); await entrar(); return; }
      if (modo === 'olvido') { const { error } = await SB.auth.resetPasswordForEmail(g('ae').value.trim(), { redirectTo: CONF.siteUrl }); if (error) throw error; pantallaAcceso('entrar', 'Listo. Revisa tu correo para crear una nueva contraseña.'); return; }
      if (modo === 'crear') { const p1 = g('ap1').value, p2 = g('ap2').value; if (p1.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.'); if (p1 !== p2) throw new Error('Las contraseñas no coinciden.'); const { error } = await SB.auth.updateUser({ password: p1 }); if (error) throw error; history.replaceState(null, '', location.pathname); await entrar(); }
    } catch (e) { pantallaAcceso(modo, e.message); }
  };
  g('ago').onclick = go; authBox.querySelectorAll('input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') go(); });
  if (g('aolv')) g('aolv').onclick = () => pantallaAcceso('olvido');
  if (g('aent')) g('aent').onclick = () => pantallaAcceso('entrar');
}
async function entrar() {
  const { data: { session } } = await SB.auth.getSession();
  if (!session) return pantallaAcceso('entrar');
  S.yo = session.user.id;
  try { await cargar(); } catch (e) { console.error(e); return pantallaAcceso('entrar', 'No se pudo cargar la información: ' + e.message); }
  if (!PERS[S.yo]) { await SB.auth.signOut(); return pantallaAcceso('entrar', 'Tu usuario no tiene perfil en la plataforma. Pide a la administradora que te invite.'); }
  if (PERS[S.yo].off) { await SB.auth.signOut(); return pantallaAcceso('entrar', 'Tu usuario está desactivado. Contacta a la administradora.'); }
  document.body.classList.remove('sin-sesion'); authBox.innerHTML = '';
  render(); iniciarTiempo(); activarPush(false);
}
async function salir() { await SB.auth.signOut(); location.reload(); }
async function iniciar() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
  const invita = /type=(invite|recovery|signup)/.test(HASH0) && false;
  SB.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') pantallaAcceso('entrar'); });
  const { data: { session } } = await SB.auth.getSession();
  if (session && invita) return pantallaAcceso('crear');
  if (/error_description=/.test(HASH0)) return pantallaAcceso('entrar', 'El enlace ya expiró o no es válido. Pide que te reenvíen el acceso.');
  await entrar();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.yo && !document.getElementById('sheet').classList.contains('on')) recargar(); });
  setInterval(() => { if (S.yo && document.visibilityState === 'visible' && !document.getElementById('sheet').classList.contains('on')) recargar(); }, 120000);
}

/* ---------- Fotos de perfil ---------- */
function prepararFoto(file) {
  return new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('Elige una imagen JPG o PNG.'));
    if (file.size > 12 * 1024 * 1024) return rej(new Error('La imagen es demasiado grande (máximo 12 MB).'));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 400;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 400, 400); URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error('No se pudo procesar la imagen.')), 'image/jpeg', 0.85); };
    img.onerror = () => rej(new Error('No se pudo leer la imagen.')); img.src = url;
  });
}
async function subirFoto(k, blob) {
  const path = `${k}/foto-${Date.now()}.jpg`;
  const { error } = await SB.storage.from('avatares').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  const urlNueva = SB.storage.from('avatares').getPublicUrl(path).data.publicUrl;
  const previa = PERS[k] && PERS[k].foto;
  await q(SB.rpc('poner_foto', { p: k, p_url: urlNueva }));
  if (PERS[k]) PERS[k].foto = urlNueva;
  if (previa && previa.includes('/avatares/')) SB.storage.from('avatares').remove([previa.split('/avatares/')[1]]).then(() => { }, () => { });
}
async function quitarFoto(k) {
  const previa = PERS[k] && PERS[k].foto;
  await q(SB.rpc('poner_foto', { p: k, p_url: null }));
  if (PERS[k]) PERS[k].foto = null;
  if (previa && previa.includes('/avatares/')) SB.storage.from('avatares').remove([previa.split('/avatares/')[1]]).then(() => { }, () => { });
}
const fotoCampo = (k, id, nota) => `<div class="f full fotof"><span>Foto de perfil</span><div class="fotoup">${k && PERS[k] ? av(k, 64) : `<span class="av fotoprev" id="${id}prev" style="width:64px;height:64px;background:#C9D3DA"></span>`}
  <div><input type="file" id="${id}" accept="image/jpeg,image/png,image/webp" hidden><button type="button" class="btn sm" data-foto="${id}">${k && PERS[k] && PERS[k].foto ? 'Cambiar foto' : 'Subir foto'}</button>${k && PERS[k] && PERS[k].foto ? ` <button type="button" class="btn sm" id="${id}del" style="color:var(--bad)">Quitar</button>` : ''}<small class="sub" style="display:block;margin-top:4px">${nota || 'JPG o PNG. Se recorta en cuadrado automáticamente.'}</small></div></div></div>`;
function enlazarFoto(id, alElegir) {
  const inp = document.getElementById(id); if (!inp) return;
  document.querySelector(`[data-foto="${id}"]`).onclick = () => inp.click();
  inp.onchange = async () => { const f = inp.files[0]; if (!f) return; try { const blob = await prepararFoto(f); await alElegir(blob, URL.createObjectURL(blob)); } catch (e) { toast(e.message); } inp.value = ''; };
}
function elegirDestino() {
  const act = PROY.filter(p => p.est === 'Activo');
  openSheet(`<div class="sh-h"><h2>Nueva actividad</h2>${X}</div><p class="sub">Elige dónde registrarla.</p>
    <div class="mas-l"><button data-dest="ind"><svg viewBox="0 0 24 24"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span>Actividad individual</span><em>›</em></button>
    ${act.map(p => `<button data-dest="${p.id}"><i style="width:12px;height:12px;border-radius:4px;background:${p.c};display:inline-block"></i><span>${esc(p.n)}</span><em>›</em></button>`).join('')}</div>
    ${act.length ? '' : '<p class="sub" style="margin-top:10px">No hay proyectos activos; puedes registrar una actividad individual o crear un proyecto.</p>'}`);
  document.querySelectorAll('[data-dest]').forEach(b => b.onclick = () => { const d = b.dataset.dest; if (d === 'ind') indForm(); else actividadForm(PROY.find(p => p.id === d)); });
}
iniciar();
})();
