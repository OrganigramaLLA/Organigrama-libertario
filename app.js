import { parseCSVRows, buildORG } from './data.js';
import { renderORG } from './ui.js';

async function init() {
  try {
    const res = await fetch('iconos.csv');
    const rows = parseCSVRows(await res.text());
    
    // El diccionario de datos ahora vive dentro del scope de inicialización
    const dataMap = {};
    rows.forEach(r => { 
      if (r.tipo !== 'panel') {
        dataMap[r.id] = { nombre: r.nombre, icono: r.icono }; 
      }
    });

    document.getElementById('loading').style.display = 'none';
    
    const orgData = buildORG(rows);
    renderORG(orgData, dataMap);
    
  } catch (e) { 
    console.error("Error al inicializar la aplicación:", e); 
  }
}

init();