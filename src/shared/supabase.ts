import { createClient } from "@supabase/supabase-js";

const url = "https://kryzbeuppgokwycotrtc.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeXpiZXVwcGdva3d5Y290cnRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjU3NjI1NCwiZXhwIjoyMDEyMTUyMjU0fQ.I_Rr17MCh809fJsRHzGv1lviC4g7r8PjO9pLtqgupgo"; //! service key, not anon key
export const supabase = createClient(url, SERVICE_KEY);
