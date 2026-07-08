const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all <Image or <img tags using regex
    const regex = /<(?:Image|img)[^>]*>/g;
    let match;
    let instances = 0;
    while ((match = regex.exec(content)) !== null) {
        const tag = match[0];
        
        const hasAlt = /alt\s*=\s*(['"])(.*?)\1/.exec(tag) || /alt\s*=\s*\{([^}]*)\}/.exec(tag);
        
        let empty = false;
        let missing = false;
        let altValue = '';

        if (!hasAlt) {
            missing = true;
        } else {
            // Check if it's empty
            if (hasAlt[1] && (hasAlt[1] === '"' || hasAlt[1] === "'")) {
                altValue = hasAlt[2];
                if (altValue.trim() === '') empty = true;
            } else if (hasAlt[1]) {
                // JSX expression
                altValue = hasAlt[1];
                if (altValue.trim() === '""' || altValue.trim() === "''" || altValue.trim() === '``') empty = true;
            }
        }

        if (missing || empty) {
            instances++;
            // calculate line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;
            console.log(`${missing ? 'Missing' : 'Empty'} alt in ${filePath} at line ${lineNumber}:\n${tag.substring(0, 80)}...\n`);
        }
    }
}

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
            searchFiles(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            checkFile(fullPath);
        }
    }
}

searchFiles('src');
