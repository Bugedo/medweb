# 📋 Configuración de Google Sheets en Vercel

## Método que funcionó ✅

Este es el método **final y funcional** para integrar Google Sheets API con Next.js en Vercel.

---

## 🔧 Paso 1: Crear Service Account en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (o usa uno existente)
3. Habilita la **Google Sheets API**:
   - Ve a "APIs & Services" → "Enable APIs and Services"
   - Busca "Google Sheets API" y habilítala
4. Crea una **Service Account**:
   - Ve a "APIs & Services" → "Credentials"
   - Click en "Create Credentials" → "Service Account"
   - Dale un nombre y crea
5. Genera una **JSON key**:
   - Click en la service account creada
   - Ve a la pestaña "Keys"
   - "Add Key" → "Create new key" → JSON
   - **Descarga el archivo JSON**

El archivo JSON tendrá esta estructura:

```json
{
  "type": "service_account",
  "project_id": "tu-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n",
  "client_email": "tu-service@tu-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

---

## 📊 Paso 2: Configurar el Google Sheet

1. Crea un nuevo Google Sheet
2. **Comparte el sheet** con el email de la service account:
   - Copia el `client_email` del JSON
   - En tu Google Sheet, click en "Compartir"
   - Pega el email de la service account
   - Dale permisos de **Editor**
3. Copia el **ID del Sheet** de la URL:
   - URL: `https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit`
   - El ID es la parte entre `/d/` y `/edit`

---

## 🚀 Paso 3: Configurar Variables en Vercel (LA CLAVE)

### Opción A: Usando Vercel CLI (Recomendado)

```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Login
vercel login

# Configura las variables
vercel env add GOOGLE_CLIENT_EMAIL
# Pega: tu-service@tu-project.iam.gserviceaccount.com

vercel env add GOOGLE_SHEET_ID
# Pega: el ID de tu sheet

vercel env add GOOGLE_PRIVATE_KEY
# Pega la PRIVATE KEY COMPLETA incluyendo BEGIN y END
# IMPORTANTE: Vercel automáticamente escapa los \n
```

### Opción B: Desde el Dashboard de Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega estas 3 variables:

**Variable 1:**

```
Name: GOOGLE_CLIENT_EMAIL
Value: tu-service@tu-project.iam.gserviceaccount.com
```

**Variable 2:**

```
Name: GOOGLE_SHEET_ID
Value: 1vsjZ3NpIgIagSb98VVUfQq_S7UMIG6BKOIR_Pxrwt_8
```

**Variable 3 (LA MÁS IMPORTANTE):**

```
Name: GOOGLE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...(toda la key)...\n-----END PRIVATE KEY-----\n
```

> ⚠️ **CRÍTICO**: Para `GOOGLE_PRIVATE_KEY`:
>
> - Copia TODO incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
> - Vercel automáticamente convierte los saltos de línea `\n` en `\\n`
> - NO agregues comillas extra ni modifiques el formato
> - Debe ser una sola línea continua con `\n` donde van los saltos

---

## 💻 Paso 4: Código en Next.js

### Instalar dependencia:

```bash
npm install googleapis
```

### Código que funciona (`lib/googleSheetsService.ts`):

```typescript
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Sheets credentials');
  }

  // IMPORTANTE: El .replace(/\\n/g, '\n') convierte los \\n de Vercel en \n reales
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'), // 👈 CLAVE DEL ÉXITO
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

export async function appendContactToSheet(data: any) {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Obtener nombre de la primera hoja dinámicamente
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${firstSheet}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          /* tus datos */
        ],
      ],
    },
  });
}
```

---

## ✅ Por qué funcionó este método

1. **Uso directo de `google.auth.JWT`**: Más simple y directo que `GoogleAuth`
2. **`.replace(/\\n/g, '\n')`**: Convierte los `\\n` que Vercel guarda en `\n` reales que OpenSSL necesita
3. **ID correcto del Sheet**: Asegurarse de usar el ID correcto (fue nuestro bug principal)
4. **Sin complicaciones**: No usar Base64, no hardcodear, solo variables de entorno estándar

---

## 🐛 Errores comunes y soluciones

### Error: `error:1E08010C:DECODER routines::unsupported`

- **Causa**: El `GOOGLE_PRIVATE_KEY` está mal formateado
- **Solución**: Asegúrate de que incluye BEGIN/END y usar `.replace(/\\n/g, '\n')`

### Error: `Unable to parse range: Sheet1!A1:F1`

- **Causa**: El nombre de la hoja no coincide
- **Solución**: Obtener el nombre dinámicamente con `metadata.data.sheets[0]`

### Error: Los datos no llegan al sheet

- **Causa**: Probablemente el `GOOGLE_SHEET_ID` es incorrecto
- **Solución**: Verificar que el ID en la variable coincide con la URL del sheet

### Funciona en local pero no en Vercel

- **Causa**: Variables de entorno mal configuradas en Vercel
- **Solución**: Reconfigura las variables desde el dashboard o CLI de Vercel

---

## 📝 Notas adicionales

- **Gratis**: El uso básico de Google Sheets API es gratuito (hasta 60 requests/minuto)
- **Seguridad**: El private key está seguro en Vercel, no se expone al cliente
- **Fallback**: Si Google Sheets falla, la app sigue funcionando (guardando solo en DB)
- **Logs**: Revisar logs de Vercel para debugging: `vercel logs`

---

## 🎯 Resumen para Cursor

```
1. Crear service account en Google Cloud → Descargar JSON
2. Compartir Google Sheet con client_email como Editor
3. En Vercel CLI o Dashboard, configurar 3 variables:
   - GOOGLE_CLIENT_EMAIL
   - GOOGLE_SHEET_ID
   - GOOGLE_PRIVATE_KEY (incluir BEGIN/END, Vercel lo escapa automáticamente)
4. En el código: usar google.auth.JWT con privateKey.replace(/\\n/g, '\n')
5. Redeploy en Vercel
```

**El problema más común que tuvimos**: Usar un `GOOGLE_SHEET_ID` incorrecto. Siempre verificar el ID desde la URL del sheet.
