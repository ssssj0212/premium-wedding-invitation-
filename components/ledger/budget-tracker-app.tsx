"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LogOut,
  Plus,
  Trash2
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  defaultCategories,
  formatCurrency,
  getMonthLabel,
  getMonthStart,
  getMonthWindow,
  moveMonth,
  sumMonth,
  type BudgetRow,
  type Category,
  type EntryType,
  type TransactionRow
} from "@/lib/ledger";

type BudgetTrackerAppProps = {
  initialEmail: string | null;
};

type FormState = {
  id: string | null;
  amount: string;
  entryType: EntryType;
  occurredOn: string;
  categoryId: string;
  note: string;
};

const emptyForm = (): FormState => ({
  id: null,
  amount: "",
  entryType: "expense",
  occurredOn: format(new Date(), "yyyy-MM-dd"),
  categoryId: "",
  note: ""
});

export function BudgetTrackerApp({ initialEmail }: BudgetTrackerAppProps) {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState(initialEmail ?? "");
  const [sessionEmail, setSessionEmail] = useState<string | null>(initialEmail);
  const [authBusy, setAuthBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [budgetDrafts, setBudgetDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(initialEmail));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "entry" | "budget">("home");
  const [refreshKey, setRefreshKey] = useState(0);

  const currentMonthStart = useMemo(() => getMonthStart(month), [month]);
  const monthSummary = useMemo(() => sumMonth(transactions, budgets, month), [budgets, month, transactions]);
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.kind === "expense"),
    [categories]
  );
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.kind === form.entryType),
    [categories, form.entryType]
  );
  const selectedCategoryId = form.categoryId || filteredCategories[0]?.id || "";

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
      if (!data.session) {
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
      if (!session) {
        setCategories([]);
        setTransactions([]);
        setBudgets([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!sessionEmail || !supabase) {
      return;
    }

    let isActive = true;
    const client = supabase;

    async function loadMonthData() {
      setLoading(true);

      const { data: categoryRows } = await client
        .from("categories")
        .select("id, name, kind, color")
        .order("kind", { ascending: true })
        .order("name", { ascending: true });

      if ((!categoryRows || categoryRows.length === 0) && isActive) {
        await client.from("categories").insert(defaultCategories);
      }

      const freshCategories = (
        await client.from("categories").select("id, name, kind, color").order("name", { ascending: true })
      ).data as Category[] | null;

      const monthWindow = getMonthWindow(month);
      const [transactionsResult, budgetsResult] = await Promise.all([
        client
          .from("transactions")
          .select(
            "id, amount, entry_type, occurred_on, note, category_id, category:categories(id, name, kind, color)"
          )
          .gte("occurred_on", monthWindow.start)
          .lte("occurred_on", monthWindow.end)
          .order("occurred_on", { ascending: false })
          .order("created_at", { ascending: false }),
        client
          .from("monthly_budgets")
          .select("id, category_id, amount, month_start")
          .eq("month_start", currentMonthStart)
      ]);

      const budgetMap: Record<string, string> = {};
      (budgetsResult.data ?? []).forEach((budget) => {
        budgetMap[budget.category_id] = String(budget.amount);
      });

      if (!isActive) {
        return;
      }

      setCategories(freshCategories ?? []);
      setTransactions((transactionsResult.data as TransactionRow[] | null) ?? []);
      setBudgets((budgetsResult.data as BudgetRow[] | null) ?? []);
      setBudgetDrafts(budgetMap);
      setLoading(false);
    }

    void loadMonthData();

    return () => {
      isActive = false;
    };
  }, [currentMonthStart, month, refreshKey, sessionEmail, supabase]);

  async function signIn() {
    if (!supabase || !email) {
      return;
    }

    setAuthBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    setAuthBusy(false);
    setMessage(getAuthMessage(error));
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSessionEmail(null);
    setCategories([]);
    setTransactions([]);
    setBudgets([]);
    setMessage("로그아웃 되었어요.");
  }

  async function saveTransaction() {
    if (!supabase || !form.amount || !selectedCategoryId) {
      return;
    }

    setSaving(true);

    const payload = {
      amount: Number(form.amount),
      entry_type: form.entryType,
      occurred_on: form.occurredOn,
      category_id: selectedCategoryId,
      note: form.note || null
    };

    const query = form.id
      ? supabase.from("transactions").update(payload).eq("id", form.id)
      : supabase.from("transactions").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setMessage("저장 중 오류가 발생했어요.");
      return;
    }

    setForm({
      ...emptyForm(),
      occurredOn: form.occurredOn
    });
    setMessage(form.id ? "거래를 수정했어요." : "거래를 저장했어요.");
    setActiveTab("home");
    setRefreshKey((value) => value + 1);
  }

  async function saveBudget(categoryId: string) {
    if (!supabase) {
      return;
    }

    const rawAmount = budgetDrafts[categoryId] ?? "";
    const amount = Number(rawAmount || 0);
    const existing = budgets.find((budget) => budget.category_id === categoryId);

    if (!amount && existing) {
      await supabase.from("monthly_budgets").delete().eq("id", existing.id);
      setRefreshKey((value) => value + 1);
      return;
    }

    if (!amount) {
      return;
    }

    if (existing) {
      await supabase.from("monthly_budgets").update({ amount }).eq("id", existing.id);
    } else {
      await supabase.from("monthly_budgets").insert({
        category_id: categoryId,
        amount,
        month_start: currentMonthStart
      });
    }

    setRefreshKey((value) => value + 1);
  }

  async function deleteTransaction(id: string) {
    if (!supabase) {
      return;
    }

    await supabase.from("transactions").delete().eq("id", id);
    setMessage("거래를 삭제했어요.");
    setRefreshKey((value) => value + 1);
  }

  function editTransaction(transaction: TransactionRow) {
    setForm({
      id: transaction.id,
      amount: String(transaction.amount),
      entryType: transaction.entry_type,
      occurredOn: transaction.occurred_on,
      categoryId: transaction.category_id,
      note: transaction.note ?? ""
    });
    setActiveTab("entry");
  }

  if (!supabase) {
    return <SetupScreen />;
  }

  if (!sessionEmail) {
    return (
      <main className="app-frame px-5 pb-10 pt-8">
        <section className="glass-panel rounded-[32px] px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7b67]">Pocket Ledger</p>
          <h1 className="headline mt-3 text-[30px] leading-[1.18]">
            월이 바뀌어도 계산이 꼬이지 않는 가계부
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5e544b]">
            날짜는 `DATE`로 저장하고 월별 합계는 해당 월 범위로만 계산해서, 월 넘어갈 때 금액이 비정상적으로
            바뀌는 문제를 막도록 설계했어요.
          </p>
          <div className="mt-6 rounded-[28px] bg-[#201913] p-5 text-white">
            <p className="text-sm text-white/70">무료 구성</p>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 px-4 py-3">Supabase: 로그인 + Postgres DB</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3">Vercel: 모바일 웹 배포</div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-[#41372f]">
              이메일 로그인
              <input
                className="mt-2 w-full rounded-2xl border border-[#e7d7ca] bg-white px-4 py-3 outline-none"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <button
              className="w-full rounded-2xl bg-[#d06b38] px-4 py-3 font-semibold text-white disabled:opacity-50"
              disabled={authBusy || !email}
              onClick={signIn}
            >
              {authBusy ? "메일 보내는 중..." : "로그인 링크 받기"}
            </button>
            {message ? <p className="text-sm text-[#6d5c4d]">{message}</p> : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-frame pb-28">
      <section className="px-5 pb-5 pt-6">
        <div className="glass-panel rounded-[30px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9d7c67]">Pocket Ledger</p>
              <h1 className="headline mt-2 text-[28px]">내 돈의 흐름</h1>
              <p className="mt-1 text-sm text-[#665b52]">{sessionEmail}</p>
            </div>
            <button
              className="rounded-full border border-[#ead9cb] p-3 text-[#5e4d42]"
              onClick={signOut}
              aria-label="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[24px] bg-[#f8eee5] px-3 py-2">
            <button className="rounded-full p-2" onClick={() => setMonth((value) => moveMonth(value, "prev"))}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="text-xs text-[#917866]">현재 기준 월</p>
              <p className="text-lg font-semibold">{getMonthLabel(month)}</p>
            </div>
            <button className="rounded-full p-2" onClick={() => setMonth((value) => moveMonth(value, "next"))}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <SummaryCard
              icon={<ArrowUpRight className="h-4 w-4" />}
              label="수입"
              value={formatCurrency(monthSummary.income)}
              tone="income"
            />
            <SummaryCard
              icon={<ArrowDownLeft className="h-4 w-4" />}
              label="지출"
              value={formatCurrency(monthSummary.expense)}
              tone="expense"
            />
            <SummaryCard
              icon={<CircleDollarSign className="h-4 w-4" />}
              label="잔액"
              value={formatCurrency(monthSummary.balance)}
              tone="neutral"
            />
            <SummaryCard
              icon={<Plus className="h-4 w-4" />}
              label="예산 잔여"
              value={formatCurrency(monthSummary.remaining)}
              tone={monthSummary.remaining < 0 ? "expense" : "income"}
            />
          </div>
        </div>
      </section>

      <section id="home" className="px-5">
        <div className="glass-panel rounded-[28px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">최근 내역</h2>
              <p className="text-sm text-[#6c6258]">{loading ? "불러오는 중..." : `${transactions.length}건`}</p>
            </div>
            <button
              className="rounded-full bg-[#201913] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                setForm(emptyForm());
                setActiveTab("entry");
              }}
            >
              + 추가
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {transactions.length === 0 && !loading ? (
              <div className="rounded-[24px] bg-[#fcf6f1] px-4 py-5 text-sm text-[#6b5d53]">
                아직 기록이 없어요. 첫 거래를 추가해보세요.
              </div>
            ) : null}
            {transactions.map((transaction) => (
              <button
                key={transaction.id}
                className="block w-full rounded-[24px] bg-[#fffaf6] px-4 py-4 text-left"
                onClick={() => editTransaction(transaction)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2e251f]">{transaction.category?.name ?? "미분류"}</p>
                    <p className="mt-1 text-xs text-[#82756b]">
                      {transaction.note || "메모 없음"} · {transaction.occurred_on}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.entry_type === "income" ? "text-[#0f9d84]" : "text-[#d34836]"
                      }`}
                    >
                      {transaction.entry_type === "income" ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount)).replace("₩", "")}
                    </p>
                    <button
                      className="mt-2 text-xs text-[#8b7769]"
                      onClick={(event) => {
                        event.stopPropagation();
                        void deleteTransaction(transaction.id);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="entry" className="px-5 pt-5">
        <div className="glass-panel rounded-[28px] p-5">
          <h2 className="text-lg font-semibold">{form.id ? "거래 수정" : "새 거래 추가"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-[22px] bg-[#f8eee5] p-1">
            {(["expense", "income"] as EntryType[]).map((type) => (
              <button
                key={type}
                className={`rounded-[18px] px-3 py-2 text-sm font-semibold ${
                  form.entryType === type ? "bg-white text-[#201913]" : "text-[#846e61]"
                }`}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    entryType: type,
                    categoryId: categories.find((category) => category.kind === type)?.id ?? ""
                  }))
                }
              >
                {type === "expense" ? "지출" : "수입"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <Field label="금액">
              <input
                className="w-full rounded-2xl border border-[#ebddd2] bg-white px-4 py-3 outline-none"
                inputMode="numeric"
                placeholder="15000"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              />
            </Field>
            <Field label="날짜">
              <input
                className="w-full rounded-2xl border border-[#ebddd2] bg-white px-4 py-3 outline-none"
                type="date"
                value={form.occurredOn}
                onChange={(event) => setForm((current) => ({ ...current, occurredOn: event.target.value }))}
              />
            </Field>
            <Field label="카테고리">
              <select
                className="w-full rounded-2xl border border-[#ebddd2] bg-white px-4 py-3 outline-none"
                value={selectedCategoryId}
                onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
              >
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="메모">
              <input
                className="w-full rounded-2xl border border-[#ebddd2] bg-white px-4 py-3 outline-none"
                placeholder="예: 점심 약속"
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              />
            </Field>
            <button
              className="w-full rounded-2xl bg-[#d06b38] px-4 py-3 font-semibold text-white disabled:opacity-50"
              disabled={saving || !form.amount || !selectedCategoryId}
              onClick={() => void saveTransaction()}
            >
              {saving ? "저장 중..." : form.id ? "수정 저장" : "거래 저장"}
            </button>
          </div>
        </div>
      </section>

      <section id="budget" className="px-5 pb-6 pt-5">
        <div className="glass-panel rounded-[28px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">카테고리 예산</h2>
              <p className="text-sm text-[#6b5d53]">{getMonthLabel(month)} 기준</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {expenseCategories.map((category) => {
              const spent = transactions
                .filter(
                  (transaction) =>
                    transaction.category_id === category.id && transaction.entry_type === "expense"
                )
                .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
              const budgetValue = Number(budgetDrafts[category.id] ?? 0);
              const progress = budgetValue > 0 ? Math.min((spent / budgetValue) * 100, 100) : 0;

              return (
                <div key={category.id} className="rounded-[24px] bg-[#fffaf6] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                        aria-hidden
                      />
                      <p className="font-medium">{category.name}</p>
                    </div>
                    <p className="text-sm text-[#77695e]">{formatCurrency(spent)}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f0dfd3]">
                    <div
                      className="h-full rounded-full bg-[#d06b38]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded-2xl border border-[#ebddd2] bg-white px-4 py-3 outline-none"
                      inputMode="numeric"
                      placeholder="예산"
                      value={budgetDrafts[category.id] ?? ""}
                      onChange={(event) =>
                        setBudgetDrafts((current) => ({
                          ...current,
                          [category.id]: event.target.value
                        }))
                      }
                    />
                    <button
                      className="rounded-2xl bg-[#201913] px-4 py-3 text-sm font-semibold text-white"
                      onClick={() => void saveBudget(category.id)}
                    >
                      저장
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <nav className="tab-shadow fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 items-center justify-between rounded-full bg-[#201913] px-2 py-2 text-white">
        {[
          { key: "home", label: "내역" },
          { key: "entry", label: "입력" },
          { key: "budget", label: "예산" }
        ].map((item) => (
          <button
            key={item.key}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${
              activeTab === item.key ? "bg-white text-[#201913]" : "text-white/72"
            }`}
            onClick={() => {
              setActiveTab(item.key as "home" | "entry" | "budget");
              document.getElementById(item.key)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </main>
  );
}

function getAuthMessage(
  error: {
    code?: string;
    message?: string;
  } | null
) {
  if (!error) {
    return "로그인 링크를 이메일로 보냈어요. 받은편지함과 스팸함을 확인해주세요.";
  }

  if (error.code === "over_email_send_rate_limit") {
    return "로그인 메일을 너무 자주 요청해서 잠시 막혔어요. 조금 기다린 뒤 다시 시도하거나, 이미 받은 가장 최근 로그인 메일을 열어주세요.";
  }

  if (error.code === "email_address_invalid") {
    return "이메일 형식이 올바르지 않아요. 주소를 다시 확인해주세요.";
  }

  if (error.message?.toLowerCase().includes("redirect")) {
    return "로그인 복귀 주소 설정이 아직 맞지 않아요. 제가 Supabase 설정을 더 확인해볼게요.";
  }

  return "로그인 메일 전송에 실패했어요. 잠시 뒤 다시 시도해주세요.";
}

function SummaryCard({
  icon,
  label,
  value,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "income" | "expense" | "neutral";
}) {
  const toneClass =
    tone === "income"
      ? "bg-[#edf9f6] text-[#0f9d84]"
      : tone === "expense"
        ? "bg-[#fff1ed] text-[#d34836]"
        : "bg-[#f5eee9] text-[#6d5b50]";

  return (
    <div className="rounded-[24px] bg-[#fffaf6] p-4">
      <div className={`inline-flex rounded-full p-2 ${toneClass}`}>{icon}</div>
      <p className="mt-3 text-sm text-[#7b6c61]">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4a3e36]">{label}</span>
      {children}
    </label>
  );
}

function SetupScreen() {
  return (
    <main className="app-frame px-5 pb-10 pt-8">
      <section className="glass-panel rounded-[32px] px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7b67]">Pocket Ledger</p>
        <h1 className="headline mt-3 text-[30px] leading-[1.18]">Supabase 연결만 하면 바로 시작돼요</h1>
        <div className="mt-5 rounded-[24px] bg-[#201913] p-5 text-sm leading-6 text-white/82">
          <p>필요한 값 2개</p>
          <p className="mt-2">`NEXT_PUBLIC_SUPABASE_URL`</p>
          <p>`NEXT_PUBLIC_SUPABASE_ANON_KEY`</p>
        </div>
        <div className="mt-5 space-y-3 text-sm leading-6 text-[#64584f]">
          <p>1. Supabase에서 새 프로젝트를 만듭니다.</p>
          <p>2. `supabase/schema.sql` 전체를 SQL Editor에 실행합니다.</p>
          <p>3. 프로젝트 URL과 anon key를 `.env.local`에 넣고 앱을 다시 실행합니다.</p>
        </div>
      </section>
    </main>
  );
}
