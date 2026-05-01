# Pocket Ledger

모바일에서 거의 대부분 사용하는 흐름에 맞춰 만든 개인 가계부 앱입니다.  
`DATE` 기준 거래일과 월 시작일(`month_start`)로 계산해서 월이 넘어갈 때 합계가 꼬이지 않도록 설계했습니다.

## Stack

- Next.js 16
- Supabase Auth + Postgres
- Vercel 배포
- Tailwind CSS

## 핵심 기능

- 이메일 매직링크 로그인
- 월별 수입 / 지출 / 잔액 / 예산 잔여 요약
- 거래 추가 / 수정 / 삭제
- 카테고리별 월 예산 설정
- 모바일 전용 단일 컬럼 UI
- Row Level Security 기반 사용자별 데이터 분리

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열면 됩니다.

## RSVP 저장 연결

커스텀 RSVP 화면은 외부 설문 페이지를 열지 않고, 사이트의 `/api/rsvp`를 통해 Google Apps Script Web App으로 저장합니다. 실제 저장 성공 응답을 받은 경우에만 Thank You 화면이 표시됩니다.

1. [`/Users/sejin/Documents/project/docs/rsvp-google-apps-script.js`](/Users/sejin/Documents/project/docs/rsvp-google-apps-script.js) 내용을 Google Apps Script의 `Code.gs`에 붙여넣습니다.
2. Apps Script에서 `Deploy > New deployment > Web app`으로 배포합니다.
3. 배포 설정은 `Execute as: Me`, `Who has access: Anyone`으로 선택합니다.
4. 생성된 Web app URL을 `.env.local`과 Vercel 환경 변수에 넣습니다.

```bash
RSVP_ENDPOINT=YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL
```

`NEXT_PUBLIC_RSVP_ENDPOINT`도 지원하지만, URL을 브라우저에 노출하지 않도록 `RSVP_ENDPOINT` 사용을 권장합니다.

## Supabase 연결

1. [Supabase](https://supabase.com/pricing) 에서 새 프로젝트를 만듭니다.
2. SQL Editor에 [`/Users/sejin/Documents/project/supabase/schema.sql`](/Users/sejin/Documents/project/supabase/schema.sql) 전체를 실행합니다.
3. 프로젝트의 `Project URL`, `anon public key`를 확인합니다.
4. 루트에 `.env.local` 파일을 만들고 아래처럼 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

5. Supabase Authentication에서 Email 로그인 방식을 활성화합니다.
6. URL Configuration에 아래를 추가합니다.

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/confirm`

## 배포

Vercel 무료 플랜으로 바로 배포할 수 있습니다.

```bash
npm install -g vercel
vercel
```

프로덕션 배포:

```bash
vercel --prod
```

Vercel 환경 변수에도 아래 두 값을 똑같이 넣어야 합니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

배포 후 Supabase의 URL Configuration에 실제 배포 주소도 추가하세요.

예:

- `https://your-app.vercel.app`
- `https://your-app.vercel.app/auth/confirm`

## 검증

아래 명령은 현재 통과합니다.

```bash
npm run typecheck
npm run lint
npm run build
```

## 왜 월 계산이 안 꼬이게 했는지

- 거래일은 `timestamp`가 아니라 `date`로 저장합니다.
- 월 예산은 `month_start`로 별도 저장합니다.
- 월별 조회는 해당 월의 시작일과 종료일 사이만 가져옵니다.
- 사용자의 다른 데이터는 RLS로 분리합니다.
