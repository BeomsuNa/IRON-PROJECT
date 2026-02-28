const fs = require('fs');

function parseGLB(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // Look for "name":"Object_..." strings in the buffer
        const content = buffer.toString('utf8');
        const matches = content.match(/"name":"(.*?)"/g);
        if (matches) {
            console.log('--- Found Node Names ---');
            const names = new Set();
            matches.forEach(m => {
                const name = m.split(':')[1].replace(/"/g, '');
                names.add(name);
            });
            Array.from(names).sort().forEach(name => console.log(name));
        } else {
            console.log('No node names found with "name":"..." pattern');
        }
    } catch (e) {
        console.error('Error reading GLB:', e);
    }
}

const modelPath = process.argv[2] || 'public/models/steampunk_arm.glb';
parseGLB(modelPath);
