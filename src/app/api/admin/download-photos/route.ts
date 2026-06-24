import { NextResponse } from 'next/server';
// @ts-ignore
import { ZipArchive } from 'archiver';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_photos');
    
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    const archive = new ZipArchive({
      zlib: { level: 9 }
    });

    archive.on('error', (err: any) => {
      console.error('Archive error:', err);
    });

    // Only zip files ending with '-profile.jpg' or similar profile identifier
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
      if (file.includes("-profile.")) {
        const filePath = path.join(uploadDir, file);
        archive.file(filePath, { name: file });
      }
    });

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
