export const COLORS = {
  blue:    { panel:'panel--blue',    av:'av-blue',    hex:['#2BA8D4','#1A6E8C'] },
  purple:  { panel:'panel--purple',  av:'av-purple',  hex:['#8B4FC8','#5A2888'] },
  pink:    { panel:'panel--pink',    av:'av-pink',    hex:['#D4197A','#8C1050'] },
  yellow:  { panel:'panel--yellow',  av:'av-yellow',  hex:['#F0C020','#A07C10'] },
  lavender:{ panel:'panel--lavender',av:'av-lavender',hex:['#9E7AC8','#7050A0'] },
  red:     { panel:'panel--red',     av:'av-red',     hex:['#D43028','#A82018'] },
  gray:    { panel:'panel--gray',    av:'av-gray',    hex:['#8890A8','#3A3E50'] },
};

function imgTag(id, fallback, dataMap) {
  const icono = dataMap[id]?.icono;
  return icono ? `<img src="iconos/${icono}" onerror="this.style.display='none';this.parentElement.innerHTML='${fallback}'"/>` : fallback;
}

function memberHTML(m, dataMap) {
  return `<div class="member"><div class="member-avatar ${m.color} ${m.sympathy}">${imgTag(m.id, m.fallback, dataMap)}</div><span>${dataMap[m.id]?.nombre || m.id}</span></div>`;
}

function panelHTML(p, dataMap) {
  let html = `<div class="panel ${COLORS[p.color].panel}"><div class="panel-header"><div class="dot"></div>${p.titulo}</div><div class="panel-body">`;
  if (p.leader) html += `<div class="member leader-member"><div class="member-avatar ${p.leader.color}">${imgTag(p.leader.id, p.leader.fallback, dataMap)}</div><span>${dataMap[p.leader.id]?.nombre || p.leader.id}</span></div>`;
  html += p.direct.map(m => memberHTML(m, dataMap)).join('') + `</div>`;
  
  p.subs.forEach(s => {
    html += `<div class="sub-panel"><div class="sub-panel-title">${s.titulo}</div><div class="panel-body">`;
    if (s.leader) html += `<div class="member leader-member"><div class="member-avatar ${s.leader.color}">${imgTag(s.leader.id, s.leader.fallback, dataMap)}</div><span>${dataMap[s.leader.id]?.nombre || s.leader.id}</span></div>`;
    html += s.members.map(m => memberHTML(m, dataMap)).join('') + `</div></div>`;
  });
  return html + `</div>`;
}

export function renderORG(ORG, dataMap) {
  const chart = document.getElementById('chart');
  chart.innerHTML = '';
  chart.style.display = 'block';

  if (ORG.rootPersona) {
    chart.innerHTML += `<div class="root-row"><div class="root-node"><div class="member-avatar">${imgTag(ORG.rootPersona.id, ORG.rootPersona.fallback, dataMap)}</div><span>${dataMap[ORG.rootPersona.id]?.nombre}</span></div></div>`;
  }

  const layout = document.createElement('div');
  layout.className = 'org-layout';
  const mainCol = document.createElement('div'); mainCol.className = 'main-col';
  const sideCol = document.createElement('div'); sideCol.className = 'side-col';

  const topGrid = document.createElement('div');
  topGrid.className = 'top-grid';
  topGrid.style.gridTemplateColumns = `repeat(${ORG.top.length}, 1fr)`;
  
  if (ORG.top.length > 1) {
    const connH = document.createElement('div');
    connH.className = 'top-connector-h';
    connH.style.background = `linear-gradient(90deg, ${ORG.topGradient})`;
    topGrid.appendChild(connH);
  }

  ORG.top.forEach(p => {
    const col = document.createElement('div');
    col.className = `col-drop col-drop--${p.color}`;
    const connV = document.createElement('div');
    connV.className = 'top-connector-v';
    connV.style.background = COLORS[p.color].hex[0];
    col.appendChild(connV);
    col.innerHTML += panelHTML(p, dataMap);
    topGrid.appendChild(col);
  });
  mainCol.appendChild(topGrid);

  if (ORG.bottom.length) {
    const label = document.createElement('div'); label.className = 'section-label'; label.innerText = 'Sectores Adyacentes';
    mainCol.appendChild(label);
    const bottomGrid = document.createElement('div');
    bottomGrid.className = 'bottom-grid';
    ORG.bottom.forEach(p => { bottomGrid.innerHTML += panelHTML(p, dataMap); });
    mainCol.appendChild(bottomGrid);
  }

  if (ORG.right.length) {
    const label = document.createElement('div'); 
    sideCol.appendChild(label);
    ORG.right.forEach(p => { sideCol.innerHTML += panelHTML(p, dataMap); });
  }

  layout.appendChild(mainCol);
  layout.appendChild(sideCol);
  chart.appendChild(layout);
}