const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tyzrxacqsigqkcdfdrgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5enJ4YWNxc2lncWtjZGZkcmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzAwNDQsImV4cCI6MjA5MTQwNjA0NH0.fnhGSXwgIybC-cmGgdHgkpcjhxaQgywaijFiHCbRsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVerified() {
  const { data, error } = await supabase
    .from('achievements')
    .select('id, title, status, users(name)')
    .eq('status', 'verified');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Verified Achievements:', data);
}

checkVerified();
