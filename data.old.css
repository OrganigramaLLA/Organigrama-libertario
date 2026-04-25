import { COLORS } from './ui.js';

export function splitCSVLine(line, sep) {
  const fields = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (ch === sep && !inQ) { fields.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  fields.push(cur.trim());
  return fields;
}

export function parseCSVRows(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];
  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = splitCSVLine(lines[0], sep).map(h => h.toLowerCase());
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line, sep);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
    return obj;
  });
}

export function buildORG(rows) {
  const panelDefs = {};
  const personaRows = [];

  rows.forEach(r => {
    if (r.tipo === 'panel') {
      panelDefs[r.id] = { 
        id: r.id, titulo: r.nombre, seccion: r.seccion, color: r.color || 'purple',
        panel_padre: r.panel_padre || '', orden: parseInt(r.orden) || 99,
        leader: null, direct: [], subs: [] 
      };
    } else { personaRows.push(r); }
  });

  let rootInfo = null;

  personaRows.forEach(p => {
    if (!p.id) return;
    const fallback = (p.nombre || p.id).substring(0, 2).toUpperCase();
    let sympathyClass = (p.es_bridge === 'si' && p.bridge_entre) ? `sympathy-${p.bridge_entre}` : '';
    const panel = panelDefs[p.panel];
    if (!panel) return;

    const avColor = COLORS[p.color || panel.color]?.av || 'av-purple';
    const member = { id: p.id, fallback, color: avColor, orden: parseInt(p.orden) || 99, sympathy: sympathyClass };

    if (p.es_root === 'si') rootInfo = { member, panelId: p.panel };
    if (p.es_lider === 'si') panel.leader = member;
    else panel.direct.push(member);
  });

  Object.values(panelDefs).forEach(p => p.direct.sort((a, b) => a.orden - b.orden));

  Object.values(panelDefs).forEach(p => {
    if (p.panel_padre && panelDefs[p.panel_padre]) {
      panelDefs[p.panel_padre].subs.push({ ...p, members: p.direct });
    }
  });

  const sorted = sec => Object.values(panelDefs).filter(p => p.seccion === sec && !p.panel_padre).sort((a, b) => a.orden - b.orden);

  const topPanels = sorted('top');
  const topGradient = topPanels.map((p, i) => {
    const c = COLORS[p.color] || COLORS.purple;
    const pct = topPanels.length === 1 ? '50%' : `${Math.round(100 * i / (topPanels.length - 1))}%`;
    return `${c.hex[0]}88 ${pct}`;
  }).join(', ');

  return {
    rootPersona: rootInfo?.member,
    rootPanelIndex: rootInfo ? Math.max(0, topPanels.findIndex(p => p.id === rootInfo.panelId)) : 0,
    top: topPanels,
    right: sorted('right'),
    bottom: sorted('bottom'),
    topGradient
  };
}