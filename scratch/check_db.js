
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tyzrxacqsigqkcdfdrgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5enJ4YWNxc2lncWtjZGZkcmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzAwNDQsImV4cCI6MjA5MTQwNjA0NH0.fnhGSXwgIybC-cmGgdHgkpcjhxaQgywaijFiHCbRsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log("Checking columns for 'achievements' table...");
  const { data, error } = await supabase.from('achievements').select('*').limit(1);
  
  if (error) {
    console.error("Error fetching achievements:", error.message);
  } else {
    if (data.length > 0) {
      console.log("Columns found:", Object.keys(data[0]));
    } else {
      console.log("No data in table, but table exists. Trying to fetch column names via RPC if available...");
      // Try to get column names by selecting a non-existent column to see the error message which often lists available columns
      const { error: colError } = await supabase.from('achievements').select('non_existent_column').limit(1);
      console.log("Intended error message (may contain hints):", colError?.message);
    }
  }
}

checkColumns();
