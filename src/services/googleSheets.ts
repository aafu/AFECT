import { Member, MemberStatus, MemberType, Gender } from '../types/member';

export const SHEET_NAME = 'รายชื่อสมาชิก';
export const SPREADSHEET_TITLE = 'ทะเบียนสมาชิกสมาคมเพื่อการศึกษาและวัฒนธรรมชาวอ่าข่า';

export const SHEET_HEADERS = [
  'รหัสสมาชิก (Member ID)',
  'วันที่สมัคร (Registration Date)',
  'ประเภทสมาชิก (Membership Type)',
  'สถานะ (Status)',
  'ชื่อ-สกุล (Full Name)',
  'รูปถ่ายหน้าตรง (Photo 2 inch)',
  'เพศ (Gender)',
  'วันเดือนปีเกิด (Date of Birth)',
  'อายุ (Age)',
  'เลขประจำตัวประชาชน (National ID)',
  'ระดับการศึกษา (Education)',
  'อาชีพ (Occupation)',
  'ตำแหน่ง (Position)',
  'หมู่/หมู่บ้าน (Village)',
  'บ้านเลขที่ (House No)',
  'ซอย (Soi)',
  'ถนน (Road)',
  'ตำบล (Subdistrict)',
  'อำเภอ (District)',
  'จังหวัด (Province)',
  'รหัสไปรษณีย์ (Postal Code)',
  'เบอร์โทรศัพท์ (Phone)',
  'อีเมล (Email)',
  'ชื่อเฟสบุ๊ค (Facebook)',
  'ไอดีไลน์ (LINE ID)',
  'ความถนัด/ความเชี่ยวชาญ/ความสนใจ (Skills)',
  'หมายเหตุ (Notes)'
];

export function getColumnLetter(colIndex: number): string {
  let letter = '';
  while (colIndex > 0) {
    const mod = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    colIndex = Math.floor((colIndex - mod) / 26);
  }
  return letter;
}

export const LAST_COLUMN = getColumnLetter(SHEET_HEADERS.length); // 'AA' (27 columns)

export const memberToRow = (m: Member): (string | number)[] => [
  m.id,
  m.registeredDate,
  m.memberType,
  m.status,
  m.fullName,
  m.photoUrl || '',
  m.gender,
  m.birthDate,
  m.age,
  m.idCard,
  m.education,
  m.occupation,
  m.position,
  m.village,
  m.houseNo,
  m.soi,
  m.road,
  m.subdistrict,
  m.district,
  m.province,
  m.postalCode,
  m.phone,
  m.email,
  m.facebook,
  m.lineId,
  m.skills,
  m.notes || ''
];

export const rowToMember = (row: (string | number)[], index: number): Member => ({
  id: String(row[0] || `AKHA-${String(index + 1).padStart(4, '0')}`),
  registeredDate: String(row[1] || new Date().toISOString().split('T')[0]),
  memberType: (row[2] === 'ถาวร' ? 'ถาวร' : 'รายปี') as MemberType,
  status: (row[3] as MemberStatus) || 'รอการอนุมัติ',
  fullName: String(row[4] || ''),
  photoUrl: String(row[5] || ''),
  gender: (row[6] as Gender) || 'ชาย',
  birthDate: String(row[7] || ''),
  age: Number(row[8]) || 0,
  idCard: String(row[9] || ''),
  education: String(row[10] || ''),
  occupation: String(row[11] || ''),
  position: String(row[12] || ''),
  village: String(row[13] || ''),
  houseNo: String(row[14] || ''),
  soi: String(row[15] || ''),
  road: String(row[16] || ''),
  subdistrict: String(row[17] || ''),
  district: String(row[18] || ''),
  province: String(row[19] || ''),
  postalCode: String(row[20] || ''),
  phone: String(row[21] || ''),
  email: String(row[22] || ''),
  facebook: String(row[23] || ''),
  lineId: String(row[24] || ''),
  skills: String(row[25] || ''),
  notes: String(row[26] || ''),
  rowIndex: index + 2 // Row 1 is header
});

export interface SpreadsheetInfo {
  id: string;
  title: string;
  url: string;
  sheetId: number;
}

/**
 * ค้นหาไฟล์ตารางสมาชิกใน Google Drive หรือสร้างใหม่หากยังไม่มี
 */
export async function findOrCreateSpreadsheet(accessToken: string, preferredId?: string | null): Promise<SpreadsheetInfo> {
  // 1. ถ้ามี preferredId ให้ลองตรวจสอบว่าเข้าถึงได้หรือไม่
  if (preferredId) {
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${preferredId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const sheet = data.sheets?.find((s: { properties: { title: string; sheetId: number } }) => s.properties.title === SHEET_NAME) || data.sheets?.[0];
        return {
          id: data.spreadsheetId,
          title: data.properties.title,
          url: data.spreadsheetUrl,
          sheetId: sheet?.properties?.sheetId ?? 0
        };
      }
    } catch (e) {
      console.warn('Failed to fetch preferred spreadsheet, checking drive search...', e);
    }
  }

  // 2. ค้นหาใน Drive โดยชื่อ
  try {
    const driveSearchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google.apps.spreadsheet' and trashed = false`)}&fields=files(id,name,webViewLink)`;
    const searchRes = await fetch(driveSearchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        // Fetch sheet details
        const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${file.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (sheetRes.ok) {
          const sheetData = await sheetRes.json();
          const targetSheet = sheetData.sheets?.find((s: { properties: { title: string; sheetId: number } }) => s.properties.title === SHEET_NAME) || sheetData.sheets?.[0];
          return {
            id: file.id,
            title: file.name,
            url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
            sheetId: targetSheet?.properties?.sheetId ?? 0
          };
        }
      }
    }
  } catch (err) {
    console.warn('Drive search error, proceeding to create new spreadsheet:', err);
  }

  // 3. ถ้าไม่มี ให้สร้างไฟล์ Google Sheets ใหม่
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME,
            gridProperties: {
              frozenRowCount: 1,
              columnCount: Math.max(32, SHEET_HEADERS.length + 5)
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`ไม่สามารถสร้าง Google Sheet ได้: ${errText}`);
  }

  const newSheetData = await createRes.json();
  const spreadsheetId = newSheetData.spreadsheetId;
  const sheetId = newSheetData.sheets?.[0]?.properties?.sheetId ?? 0;

  // เขียน Header ลงแถวแรก พร้อมจัดรูปแบบสวยงาม
  await initSheetHeaders(accessToken, spreadsheetId, sheetId);

  return {
    id: spreadsheetId,
    title: SPREADSHEET_TITLE,
    url: newSheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheetId
  };
}

/**
 * กำหนดหัวตารางและใส่สีพื้นหลังหัวตารางใน Google Sheet
 */
export async function initSheetHeaders(accessToken: string, spreadsheetId: string, sheetId: number): Promise<void> {
  // ตรวจสอบและขยายคอลัมน์ของชีตให้รองรับจำนวนหัวตาราง (อย่างน้อย 30 คอลัมน์สำหรับ A ถึง AA+)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                gridProperties: {
                  columnCount: Math.max(32, SHEET_HEADERS.length + 5)
                }
              },
              fields: 'gridProperties.columnCount'
            }
          }
        ]
      })
    });
  } catch (gridErr) {
    console.warn('Could not expand sheet columns (non-fatal):', gridErr);
  }

  // เขียนข้อความหัวตาราง A1:AA1
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_NAME)}!A1:${LAST_COLUMN}1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [SHEET_HEADERS]
    })
  });

  // จัดรูปแบบ Header: ตัวหนา พื้นหลังสีเข้ม (Deep Forest Emerald) ตัวอักษรสีขาว
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_HEADERS.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.09, green: 0.38, blue: 0.25 }, // Deep Forest Emerald
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 11 },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: SHEET_HEADERS.length
              }
            }
          }
        ]
      })
    });
  } catch (styleErr) {
    console.warn('Could not apply custom header style (non-fatal):', styleErr);
  }
}

/**
 * ดึงรายชื่อสมาชิกทั้งหมดจาก Google Sheet
 */
export async function fetchMembersFromSheet(accessToken: string, spreadsheetId: string): Promise<Member[]> {
  const range = `${encodeURIComponent(SHEET_NAME)}!A2:${LAST_COLUMN}`;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ไม่สามารถดึงข้อมูลจาก Google Sheets ได้: ${errText}`);
  }

  const data = await res.json();
  const rows: (string | number)[][] = data.values || [];

  return rows.map((row, idx) => rowToMember(row, idx));
}

/**
 * เพิ่มสมาชิกลง Google Sheet
 */
export async function addMemberToSheet(accessToken: string, spreadsheetId: string, member: Member): Promise<void> {
  const range = `${encodeURIComponent(SHEET_NAME)}!A1`;
  const rowData = memberToRow(member);

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [rowData]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`เกิดข้อผิดพลาดในการบันทึกสมาชิกลง Google Sheet: ${errText}`);
  }
}

/**
 * อัปเดตข้อมูลสมาชิกใน Google Sheet ตาม rowIndex
 */
export async function updateMemberInSheet(accessToken: string, spreadsheetId: string, rowIndex: number, member: Member): Promise<void> {
  const range = `${encodeURIComponent(SHEET_NAME)}!A${rowIndex}:${LAST_COLUMN}${rowIndex}`;
  const rowData = memberToRow(member);

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [rowData]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ไม่สามารถอัปเดตสมาชิกใน Google Sheet ได้: ${errText}`);
  }
}

/**
 * ลบแถวสมาชิกใน Google Sheet ตาม rowIndex
 */
export async function deleteMemberInSheet(accessToken: string, spreadsheetId: string, sheetId: number, rowIndex: number): Promise<void> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // 0-indexed
              endIndex: rowIndex
            }
          }
        }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ไม่สามารถลบแถวใน Google Sheet ได้: ${errText}`);
  }
}

/**
 * ซิงค์เขียนข้อมูลสมาชิกทั้งหมดลง Sheet ใหม่ทั้งหมด (ใช้เมื่อต้องการ Sync ข้อมูลหรือจัดระเบียบตารางใหม่)
 */
export async function overwriteAllMembersToSheet(accessToken: string, spreadsheetId: string, sheetId: number, members: Member[]): Promise<void> {
  // เคลียร์แถวข้อมูลเดิม A2:AA
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_NAME)}!A2:${LAST_COLUMN}:clear`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  // ใส่ Header หากยังไม่มี และขยายคอลัมน์ให้เพียงพอ
  await initSheetHeaders(accessToken, spreadsheetId, sheetId);

  if (members.length > 0) {
    const rows = members.map(m => memberToRow(m));
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_NAME)}!A2:${LAST_COLUMN}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ไม่สามารถเขียนข้อมูลทั้งหมดลง Google Sheet ได้: ${err}`);
    }
  }
}
