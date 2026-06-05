const fs = require('fs');
const path = require('path');

async function testExtract() {
  const url = 'http://localhost:3000/api/extract-document';
  const imagePath = path.join(__dirname, 'public', 'uploads', 'profile_photos', '2513210373.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.error(`Image not found at ${imagePath}`);
    return;
  }

  const formData = new FormData();
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  formData.append('documentImage', blob, 'test.jpg');
  formData.append('documentType', 'iqama');

  console.log(`Sending POST request to ${url}...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during fetch:', error.message);
  }
}

testExtract();
