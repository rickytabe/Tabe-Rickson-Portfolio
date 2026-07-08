const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let inImage = false;
    let imageContent = '';
    let startLine = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Simplified check: let's just find <Image and look for alt= in the next few lines until /> or >
        if (line.includes('<Image')) {
            inImage = true;
            imageContent = line;
            startLine = i + 1;
        } else if (inImage) {
            imageContent += '\n' + line;
        }

        if (inImage && (line.includes('/>') || line.includes('</Image>'))) {
            inImage = false;
            if (!imageContent.includes('alt=')) {
                console.log(`Missing alt in ${filePath} at line ${startLine}`);
            } else if (imageContent.includes('alt=""') || imageContent.includes("alt=''") || imageContent.match(/alt=\{\s*(?:""|'')\s*\}/)) {
                console.log(`Empty alt in ${filePath} at line ${startLine}`);
            }
        }
    }
}

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchFiles(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            checkFile(fullPath);
        }
    }
}

searchFiles('src');
