/**
 * -------------------------------------------------------------
 * API de Solo Lectura para Inventario de Google Sheets
 * -------------------------------------------------------------
 * 1. Abre tu hoja de Google Sheets.
 * 2. Ve a "Extensiones" > "Apps Script".
 * 3. Borra el código existente y pega todo este código.
 * 4. Guarda el proyecto.
 * 5. Haz clic en "Implementar" (Deploy) > "Nueva implementación".
 * 6. Selecciona tipo "Aplicación Web" (Web app).
 * 7. Ejecutar como: "Tú"
 * 8. Quién tiene acceso: "Cualquier persona" (Anyone)
 * 9. Autoriza los permisos si te los pide.
 * 10. Copia la URL generada y pégala en `app.js` en la variable SCRIPT_URL.
 */

const CATEGORY_SHEETS = ["Deportivo Mujer", "Deportivo Hombre", "Accesorios Deportivos", "Lentes", "Relojes"];

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let allProducts = [];

    CATEGORY_SHEETS.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const data = sheet.getDataRange().getValues();
        if (data.length > 1) {
          const headers = data[0];
          const rows = data.slice(1);
          
          const sheetProducts = rows.map((row) => {
            let obj = {};
            row.forEach((cell, index) => {
              let key = String(headers[index]).trim().replace(/\s+/g, '_');
              obj[key] = cell;
            });
            // Asegurar que la categoría coincida con el nombre de la pestaña si no está en la columna
            if (!obj.Categoria || obj.Categoria === "") {
              obj.Categoria = sheetName;
            }
            return obj;
          });
          allProducts = allProducts.concat(sheetProducts);
        }
      }
    });

    return responseJSON(allProducts, 200);

  } catch (error) {
    return responseJSON({ "error": error.toString() }, 500);
  }
}

/**
 * Función helper para formatear la respuesta como JSON
 */
function responseJSON(data, code) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
