import { NextResponse } from 'next/server';
import { Archiver } from 'archiver';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_photos');
    
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const archive = new Archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err: any) => {
      console.error('Archive error:', err);
    });

    archive.directory(uploadDir, false);
    archive.finalize();

    const nodeReadable = Readable.from(archive);
    const webStream = Readable.toWeb(nodeReadable);

    return new NextResponse(webStream as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="worker-photos.zip"',
      },
    });
  } catch (error: any) {
    console.error('Error generating zip:', error);
    return NextResponse.json({ error: 'Failed to generate zip file', details: error.message, stack: error.stack }, { status: 500 });
  }
}
