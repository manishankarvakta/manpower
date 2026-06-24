import { NextResponse } from 'next/server';
// @ts-ignore
import { ZipArchive } from 'archiver';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

export async function GET() {
  try {
    const isMockDb = !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_photos');

    const archive = new ZipArchive({
      zlib: { level: 9 }
    });

    archive.on('error', (err: any) => {
      console.error('Archive error:', err);
    });

    if (isMockDb) {
      if (!fs.existsSync(uploadDir)) {
        return NextResponse.json({ error: 'No local uploads directory found' }, { status: 404 });
      }

      // Only zip files containing '-profile.' pattern from local directory
      const files = fs.readdirSync(uploadDir);
      let profilePhotosCount = 0;
      files.forEach(file => {
        if (file.includes("-profile.")) {
          const filePath = path.join(uploadDir, file);
          archive.file(filePath, { name: file });
          profilePhotosCount++;
        }
      });

      if (profilePhotosCount === 0) {
        return NextResponse.json({ error: 'No profile photos found locally' }, { status: 404 });
      }

      archive.finalize();
    } else {
      // Firebase Live Storage Mode
      const { adminStorage } = require('@/lib/firebase/admin');
      const bucket = adminStorage.bucket();
      
      // Fetch all files from Firebase Storage profile_photos directory
      const [files] = await bucket.getFiles({ prefix: 'profile_photos/' });
      
      let profilePhotosCount = 0;
      for (const file of files) {
        // Firebase returns directories as objects as well, verify it is a valid photo file
        if (file.name && file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.jpeg')) {
          const fileBuffer = await file.download();
          const baseName = path.basename(file.name);
          
          archive.append(fileBuffer[0], { name: baseName });
          profilePhotosCount++;
        }
      }

      if (profilePhotosCount === 0) {
        return NextResponse.json({ error: 'No profile photos found in Firebase Storage' }, { status: 404 });
      }

      archive.finalize();
    }

    const nodeReadable = Readable.from(archive);
    const webStream = Readable.toWeb(nodeReadable);

    return new NextResponse(webStream as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="worker-profile-photos.zip"',
      },
    });
  } catch (error: any) {
    console.error('Error generating zip:', error);
    return NextResponse.json({ error: 'Failed to generate zip file', details: error.message }, { status: 500 });
  }
}
