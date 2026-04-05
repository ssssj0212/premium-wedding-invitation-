import { BudgetTrackerApp } from "@/components/ledger/budget-tracker-app";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session }
  } = supabase
    ? await supabase.auth.getSession()
    : { data: { session: null } };

  return <BudgetTrackerApp initialEmail={session?.user.email ?? null} />;
}
