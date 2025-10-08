#!/usr/bin/env node

/**
 * Script to initialize Google Sheet with headers
 * Run: node scripts/init-google-sheet.js
 */

require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');

async function initializeSheet() {
  console.log('🚀 Initializing Google Sheet...\n');

  try {
    // Validate environment variables
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      console.error('❌ Missing required environment variables:');
      if (!serviceAccountEmail) console.error('  - GOOGLE_SERVICE_ACCOUNT_EMAIL');
      if (!privateKey) console.error('  - GOOGLE_PRIVATE_KEY');
      if (!spreadsheetId) console.error('  - GOOGLE_SHEET_ID');
      process.exit(1);
    }

    console.log('✓ Environment variables found');
    console.log(`✓ Sheet ID: ${spreadsheetId}`);
    console.log(`✓ Service Account: ${serviceAccountEmail}\n`);

    // Format private key
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Authenticate
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: formattedPrivateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('🔐 Authenticating with Google...');

    // Get sheet metadata to find the first sheet name
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log(`✓ Connected to Google Sheets successfully`);
    console.log(`✓ Using sheet: "${firstSheet}"\n`);

    // Check if sheet exists and has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${firstSheet}!A1:F1`,
    });

    if (response.data.values && response.data.values.length > 0) {
      console.log('ℹ️  Headers already exist:');
      console.log('  ', response.data.values[0].join(' | '));
      console.log('\n✅ Sheet is already initialized!');
    } else {
      console.log('📝 Adding headers to sheet...');

      const headers = [
        'Fecha y Hora',
        'Nombre',
        'Localidad',
        'Teléfono',
        'Email',
        'Observaciones',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${firstSheet}!A1:F1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });

      console.log('✓ Headers added:');
      console.log('  ', headers.join(' | '));

      // Format headers (bold)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                    backgroundColor: {
                      red: 0.9,
                      green: 0.9,
                      blue: 0.9,
                    },
                  },
                },
                fields: 'userEnteredFormat(textFormat,backgroundColor)',
              },
            },
          ],
        },
      });

      console.log('✓ Headers formatted (bold + gray background)');
      console.log('\n✅ Sheet initialized successfully!');
    }

    console.log('\n📊 Sheet URL:');
    console.log(`   https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
    console.log('\n🎉 All done! Your contact form is now connected to Google Sheets.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('permission')) {
      console.error('\n💡 Make sure you shared the sheet with:');
      console.error(`   ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    }
    process.exit(1);
  }
}

initializeSheet();
