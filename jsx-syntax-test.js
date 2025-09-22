// Simple JSX syntax validation test
const fs = require('fs');
const path = require('path');

// Read the EnhancedApproverPanel.tsx file
const filePath = path.join(__dirname, 'frontend', 'src', 'components', 'EnhancedApproverPanel.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Basic JSX tag matching
const openTags = content.match(/<[^/][^>]*>/g) || [];
const closeTags = content.match(/<\/[^>]+>/g) || [];
const selfClosingTags = content.match(/<[^>]*\/>/g) || [];

console.log('JSX Syntax Analysis:');
console.log('Open tags:', openTags.length);
console.log('Close tags:', closeTags.length);
console.log('Self-closing tags:', selfClosingTags.length);

// Check for common JSX issues
const issues = [];

// Check for orphaned RefreshCw components
if (content.includes('<RefreshCw className="w-4 h-4" />') && 
    content.includes('Refresh') && 
    content.includes('</Button>')) {
  const refreshCwMatches = content.match(/<RefreshCw[^>]*>/g) || [];
  const refreshTextMatches = content.match(/Refresh/g) || [];
  const buttonCloseMatches = content.match(/<\/Button>/g) || [];
  
  console.log('RefreshCw components:', refreshCwMatches.length);
  console.log('Refresh text occurrences:', refreshTextMatches.length);
  console.log('Button close tags:', buttonCloseMatches.length);
}

// Check for unmatched div tags
const divOpen = (content.match(/<div[^>]*>/g) || []).length;
const divClose = (content.match(/<\/div>/g) || []).length;
const divSelfClose = (content.match(/<div[^>]*\/>/g) || []).length;

console.log('Div analysis:');
console.log('  Open div tags:', divOpen);
console.log('  Close div tags:', divClose);
console.log('  Self-closing div tags:', divSelfClose);

if (divOpen !== divClose) {
  issues.push(`Unmatched div tags: ${divOpen} open, ${divClose} close`);
}

// Check for return statements
const returnStatements = content.match(/return\s*\(/g) || [];
console.log('Return statements:', returnStatements.length);

if (issues.length > 0) {
  console.log('\nIssues found:');
  issues.forEach(issue => console.log('  -', issue));
} else {
  console.log('\n✅ No obvious JSX syntax issues detected');
}