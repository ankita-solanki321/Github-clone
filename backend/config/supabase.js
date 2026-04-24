const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Connection Client create karna
const supabase = createClient(supabaseUrl, supabaseKey);

// Yahan "commits" ko hata kar "repo-bucket" kar do
const S3_BUCKET = "repo-bucket"; 

module.exports = { supabase, S3_BUCKET };