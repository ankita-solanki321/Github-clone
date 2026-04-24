const fs = require('fs');
const path = require('path');
const supabase  = require("../config/supabase");

async function pushRepo() {
  const commitsPath = path.resolve(process.cwd(), '.apnaGit', 'commits');

  // Read all uuid folders inside commits/
  const folders = fs.readdirSync(commitsPath);

  if (folders.length === 0) {
    console.log('❌ No commits found to push!');
    return;
  }

  for (const folder of folders) {
    const folderPath = path.join(commitsPath, folder);

    // Skip if not a folder
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) continue;

    // Read all files inside uuid folder
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const data = fs.readFileSync(filePath);

      // Upload as commits/uuid/filename
      const { error } = await supabase.storage
        .from('repos')
        .upload(`commits/${folder}/${file}`, data, {
          upsert: true
        });

      if (error) {
        console.log(`❌ Failed to push ${file}:`, error.message);
      } else {
        console.log(`✅ Pushed ${folder}/${file} successfully!`);
      }
    }
  }

  console.log('🎉 All commits pushed!');
}

module.exports = { pushRepo };