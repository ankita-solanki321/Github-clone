const fs = require("fs").promises;
const path = require("path");
const supabase  = require("../config/supabase");
//

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // List all folders inside commits/ bucket (same as listObjectsV2)
    const { data: folders, error: folderError } = await supabase.storage
      .from('repos')
      .list('commits');

    if (folderError) throw new Error(folderError.message);

    for (const folder of folders) {
      // List all files inside each uuid folder
      const { data: files, error: filesError } = await supabase.storage
        .from('repos')
        .list(`commits/${folder.name}`);

      if (filesError) throw new Error(filesError.message);

      // Create local uuid folder if it doesn't exist (same as mkdir)
      const commitDir = path.join(commitsPath, folder.name);
      await fs.mkdir(commitDir, { recursive: true });

      for (const file of files) {
        // Download each file (same as getObject)
        const { data, error } = await supabase.storage
          .from('repos')
          .download(`commits/${folder.name}/${file.name}`);

        if (error) throw new Error(error.message);

        // Save file locally (same as writeFile)
        const buffer = Buffer.from(await data.arrayBuffer());
        await fs.writeFile(path.join(commitDir, file.name), buffer);
      }
    }

    console.log("All commits pulled from Supabase.");

  } catch (err) {
    console.error("Unable to pull : ", err);
  }
}

module.exports = { pullRepo };