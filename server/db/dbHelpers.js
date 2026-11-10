import fs from 'fs/promises';

const dbPath = new URL('./db.json', import.meta.url);

export async function readDb() {
    let data = await fs.readFile(dbPath, 'utf-8');
    data = JSON.parse(data);
    return data;
}

export async function writeDb(db) {
    const data = JSON.stringify(db, null, 2);
    await fs.writeFile(dbPath, data);
}