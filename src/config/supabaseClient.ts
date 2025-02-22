import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vbggnlkzfnvwvvsfscee.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZ2dubGt6Zm52d3Z2c2ZzY2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2ODgwOTAsImV4cCI6MjA1NDI2NDA5MH0.ha0zxTuN0qz9PSsJ-jrbiEQgI2ob-vLRHmECUOyHvRo";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
