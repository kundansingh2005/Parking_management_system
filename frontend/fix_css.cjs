const fs = require('fs');

const css = `

.light-theme {
  --bg-color: #f3f4f6;
  --panel-bg: rgba(255, 255, 255, 0.9);
  --border-color: rgba(0, 0, 0, 0.1);
  --text-main: #1f2937;
  --text-muted: #6b7280;
  
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --secondary: #e5e7eb;
  --secondary-hover: #d1d5db;
  --success: #10b981;
  --success-hover: #059669;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --warning: #f59e0b;
}

.light-theme .glass-panel {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
  background: var(--panel-bg);
}

.light-theme .btn-secondary {
  color: #1f2937;
}

.light-theme input, .light-theme select, .light-theme textarea {
  background: rgba(0,0,0,0.05);
  color: #000;
  border: 1px solid rgba(0,0,0,0.1);
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended light theme css');
