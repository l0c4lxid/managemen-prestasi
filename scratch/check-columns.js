const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tyzrxacqsigqkcdfdrgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5enJ4YWNxc2lncWtjZGZkcmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzAwNDQsImV4cCI6MjA5MTQwNjA0NH0.fnhGSXwgIybC-cmGgdHgkpcjhxaQgywaijFiHCbRsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching achievements:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in achievements table:', Object.keys(data[0]));
  } else {
    console.log('No data in achievements table to check columns.');
  }
}

checkColumns();
