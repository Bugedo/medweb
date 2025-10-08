import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

interface ContactData {
  nombre: string;
  localidad: string;
  telefono: string;
  email: string;
  observaciones?: string;
}

/**
 * Get authenticated Google Sheets client
 */
async function getGoogleSheetsClient() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error('Missing Google Sheets credentials in environment variables');
    }

    // Create auth using JWT directly
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines from env vars
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Error creating Google Sheets client:', error);
    throw error;
  }
}

/**
 * Append contact data to Google Sheet
 */
export async function appendContactToSheet(contactData: ContactData): Promise<void> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Missing GOOGLE_SHEET_ID in environment variables');
    }

    // Prepare the row data
    const timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    const rowData = [
      timestamp,
      contactData.nombre,
      contactData.localidad,
      contactData.telefono,
      contactData.email,
      contactData.observaciones || '',
    ];

    // Get the first sheet name dynamically
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';

    // Append to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${firstSheet}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ [Google Sheets] Contact added successfully to', firstSheet);
  } catch (error: any) {
    console.error('❌ [Google Sheets] Error:', error.message);
    // Don't throw error to avoid breaking the main flow
    // Just log it so the contact is still saved to the database
  }
}

/**
 * Initialize the sheet with headers if it's empty
 */
export async function initializeSheetHeaders(): Promise<void> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Missing GOOGLE_SHEET_ID in environment variables');
    }

    // Get the first sheet name dynamically
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';

    // Check if sheet has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${firstSheet}!A1:F1`,
    });

    // If first row is empty, add headers
    if (!response.data.values || response.data.values.length === 0) {
      const headers = ['Fecha y Hora', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Observaciones'];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${firstSheet}!A1:F1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });

      console.log('Sheet headers initialized');
    }
  } catch (error) {
    console.error('Error initializing sheet headers:', error);
    // Don't throw error
  }
}
