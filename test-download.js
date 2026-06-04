const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function testDownload() {
  const url = 'http://localhost:3000/api/admin/download-photos';
  const outputPath = path.join(__dirname, 'test-output.zip');

  console.log(`Fetching from ${url}...`);
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Request failed with status ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response body: ${text}`);
      process.exit(1);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved response to ${outputPath}`);
    
    try {
      console.log('Verifying zip file...');
      execSync(`tar -tf "${outputPath}"`, { stdio: 'pipe' });
      console.log('Zip file is valid and contains files.');
    } catch (e) {
      console.error('Zip file verification failed (tar -tf returned an error). The file might be corrupted.');
      console.error(e.message);
      if (e.stderr) {
        console.error(e.stderr.toString());
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during fetch:', error.message);
    process.exit(1);
  }
}

testDownload();
