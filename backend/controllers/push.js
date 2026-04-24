const fs = require("fs").promises;
const path = require("path");
const { supabase, S3_BUCKET } = require("../config/supabase");

async function pushRepo() {
    // Current working directory mein .meraGit ka path nikalna
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        // Commits folder ke andar saare folders (Commit IDs) ki list lena
        const commitDirs = await fs.readdir(commitsPath);

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                // Supabase Storage Upload Syntax
                const { data, error } = await supabase.storage
                    .from(S3_BUCKET) // "repo-bucket"
                    .upload(`commits/${commitDir}/${file}`, fileContent, {
                        upsert: true // Agar file pehle se hai toh overwrite kar do
                    });

                if (error) {
                    console.error(`❌ Error pushing ${file}:`, error.message);
                } else {
                    console.log(`✅ Pushed: ${commitDir}/${file}`);
                }
            }
        }

        console.log("✨ All commits pushed to Supabase Cloud.");
    } catch (err) {
        console.error("❌ Error pushing to Supabase:", err);
    }
}

module.exports = { pushRepo };