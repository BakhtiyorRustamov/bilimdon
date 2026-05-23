const fs = require('fs');
const files = [
    'index.html',
    'dashboard.html',
    'learning_path_map.html',
    'interactive_quiz.html',
    'achievements_badges_room.html',
    'parent_portal_dashboard.html'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove CDN scripts
    content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>/g, '');
    
    // Remove config
    content = content.replace(/<script id="tailwind-config">[\s\S]*?<\/script>/g, '');
    
    // Remove style
    content = content.replace(/<style>[\s\S]*?<\/style>/g, '');
    
    // Add CSS link if not there
    if (!content.includes('href="./style.css"')) {
        content = content.replace('</head>', '    <link href="./style.css" rel="stylesheet" />\n</head>');
    }
    
    fs.writeFileSync(file, content);
}
