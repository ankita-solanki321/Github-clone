const fs = require("fs").promises;
const path = require("path");
const { supabase, S3_BUCKET } = require("../config/supabase");

async function listAllFiles(supabase, bucket, folder) {
    const { data: objects, error } = await supabase.storage
        .from(bucket)
        .list(folder);

    if (error) throw error;

    let allFiles = [];

    for (const obj of objects) {
        const fullPath = `${folder}/${obj.name}`;

        if (obj.metadata === null) {
            // ✅ Yeh folder hai — recursively jaao andar
            const nested = await listAllFiles(supabase, bucket, fullPath);
            allFiles = allFiles.concat(nested);
        } else {
            // ✅ Yeh actual file hai
            allFiles.push(fullPath);
        }
    }

    return allFiles;
}

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");

    try {
        // ✅ Ab sari nested files milegi
        const allFiles = await listAllFiles(supabase, S3_BUCKET, "commits");
        console.log(`🔍 Total files found in cloud: ${allFiles.length}`);

        for (const relativePath of allFiles) {
            const localFilePath = path.join(repoPath, relativePath);
            await fs.mkdir(path.dirname(localFilePath), { recursive: true });

            const { data: blob, error: downloadError } = await supabase.storage
                .from(S3_BUCKET)
                .download(relativePath);

            if (downloadError) {
                console.error(`❌ Error downloading ${relativePath}:`, downloadError.message);
                continue;
            }

            const buffer = Buffer.from(await blob.arrayBuffer());
            await fs.writeFile(localFilePath, buffer);
            console.log(`✅ Pulled & Saved: ${relativePath}`);
        }

        console.log("\n✨ Pull process completed successfully!");

    } catch (err) {
        console.error("❌ Fatal Error during pull:", err.message);
    }
}

module.exports = { pullRepo };