# Tasks: Open Secret Box (Chưa Mở)

**Frame**: `1466:7676-open-secret-box-chua-mo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asset preparation and i18n keys needed by all user stories

- [x] T001 Download gift box media assets from Figma using MoMorph `get_media_files` tool. Place "box quà chưa mở" (Node 1466:7686) as `gift-box-unopened.png` and "hiệu ứng box quà" (Node 1466:7685) as `sparkle-effect.png`. If MoMorph tools fail (rate-limited/404), use placeholder images (solid color squares) and note for manual Figma export later | `public/images/secret-box/`
- [x] T002 [P] Add secret box modal translation keys to English locale. Add under `kudos` namespace: `secretBoxModalTitle: "KHÁM PHÁ SECRET BOX CỦA BẠN"`, `secretBoxInstruction: "Click vào box để mở"`, `secretBoxCounterLabel: "Secretbox chưa mở"`, `secretBoxAriaLabel: "Secret box modal"` | `src/locales/en.ts`
- [x] T003 [P] Add secret box modal translation keys to Vietnamese locale. Same keys as T002 with Vietnamese values: `secretBoxModalTitle: "KHÁM PHÁ SECRET BOX CỦA BẠN"`, `secretBoxInstruction: "Click vào box để mở"`, `secretBoxCounterLabel: "Secretbox chưa mở"`, `secretBoxAriaLabel: "Hộp bí mật"` | `src/locales/vi.ts`

**Checkpoint**: Assets in place, i18n keys available for all modal text.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database schema and API enhancement required by US1 (box open + badge assignment)

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create `user_badges` migration. Table: `id UUID PK DEFAULT gen_random_uuid()`, `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`, `badge_type TEXT NOT NULL CHECK (badge_type IN ('REVIVAL','TOUCH_OF_LIGHT','STAY_GOLD','FLOW_TO_HORIZON','BEYOND_THE_BOUNDARY','ROOT_FURTHER'))`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`. Add index `idx_user_badges_user_id ON user_badges(user_id)`. Enable RLS. Add policy: "Users can read own badges" (`user_id = auth.uid()` for SELECT). Add INSERT policy for authenticated via API route (service role). Follow existing migration patterns in `00002_create_kudos_tables.sql` | `supabase/migrations/00003_create_user_badges.sql`
- [x] T005 Enhance `POST /api/users/me/secret-box` route with badge assignment. After existing `opened_count` increment logic, add: (1) `BADGE_PROBABILITIES` constant array: `[{ type: 'STAY_GOLD', weight: 30 }, { type: 'FLOW_TO_HORIZON', weight: 25 }, { type: 'TOUCH_OF_LIGHT', weight: 20 }, { type: 'BEYOND_THE_BOUNDARY', weight: 10 }, { type: 'REVIVAL', weight: 10 }, { type: 'ROOT_FURTHER', weight: 5 }]`. (2) Weighted random selection using `crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF` to get float 0-1, iterate cumulative thresholds. (3) Insert into `user_badges` table `{ user_id: user.id, badge_type: selectedBadge }`. (4) If insert fails, rollback by decrementing `opened_count` back. (5) Return enhanced response: `{ data: { opened_count, remaining, badge_type } }` | `src/app/api/users/me/secret-box/route.ts`

**Checkpoint**: Database migration ready, API returns `badge_type` in response. Run `make up` to apply migration.

---

## Phase 3: User Story 1 - Open a Secret Box (Priority: P1) + US2 (Empty State, P1) + US3 (Close Modal, P2)

**Goal**: Create the SecretBoxModal component with full unopened state UI, box click → API call → count decrement, empty state (count = 0), and all close behaviors (X button, backdrop, Escape).

**Independent Test**: Open modal with ≥1 box → click gift box → verify API called and count decrements. Open with 0 boxes → verify disabled. Click X / backdrop / Escape → verify closes.

> US2 (empty state) and US3 (close modal) are built into the same component as conditional behaviors — not separate components. They are included in this phase for efficiency.

### Tests (US1+US2+US3)

- [x] T006 [US1] Create test file with test setup: mock `fetch`, mock `useLocale`, mock `next/image`, mock `useRouter`. Write failing tests for: (1) "renders modal with title, instruction, gift box image, and counter when isOpen=true and remainingBoxes=5", (2) "displays zero-padded count '05' for remainingBoxes=5", (3) "calls POST /api/users/me/secret-box when gift box is clicked", (4) "decrements count after successful API response", (5) "shows error toast when API returns error and preserves count" | `src/__tests__/components/kudos/SecretBoxModal.test.tsx`
- [x] T007 [US2] Add failing tests for empty state: (1) "hides instruction text when remainingBoxes=0", (2) "disables gift box button when remainingBoxes=0 (opacity-50, pointer-events-none)", (3) "displays '00' in counter when remainingBoxes=0" | `src/__tests__/components/kudos/SecretBoxModal.test.tsx`
- [x] T008 [US3] Add failing tests for close behaviors: (1) "calls onClose when X button clicked", (2) "calls onClose when backdrop overlay clicked", (3) "calls onClose when Escape key pressed", (4) "does not render when isOpen=false" | `src/__tests__/components/kudos/SecretBoxModal.test.tsx`

### Frontend (US1+US2+US3)

- [x] T009 [US1] Create `SecretBoxModal.tsx` — modal shell with props interface: `{ isOpen: boolean; remainingBoxes: number; onClose: () => void }`. Add `"use client"` directive. Implement modal visibility pattern from `RulesPanel.tsx`: `isVisible` state with `requestAnimationFrame` on open, `setTimeout(onClose, 200)` on close. Body scroll lock: `document.body.style.overflow = "hidden"` when open. Return `null` when `!isOpen`. Render backdrop overlay: `fixed inset-0 z-40 cursor-pointer bg-[rgba(0,16,26,0.7)]` with `onClick={handleClose}`. Render modal container: `fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] lg:w-[652px] max-h-[90vh] overflow-y-auto flex flex-col items-center gap-[22px] p-[24px_13px] bg-[#00101A] rounded-xl` with `role="dialog" aria-modal="true" aria-label={t.kudos.secretBoxAriaLabel}`. Open animation: `opacity + scale` 300ms ease-out. Close animation: 200ms ease-in. | `src/components/kudos/SecretBoxModal.tsx`
- [x] T010 [US1] Add title bar section to SecretBoxModal. Wrapper: `relative w-full`. Title `<h2>`: `text-center font-[family-name:var(--font-montserrat)] text-[20px] sm:text-[25px] font-bold leading-[32px] text-[#FFEA9E]` with `{t.kudos.secretBoxModalTitle}`. Close button: `<button>` wrapper (min 44x44 touch target on mobile) positioned `absolute right-0 top-1/2 -translate-y-1/2` containing `<Icon name="close" size={19} />`. Close button states: hover opacity-70, focus `outline-2 outline-offset-2 outline-[#FFEA9E]`, active opacity-50. Add separator below: `<div className="w-full h-px bg-[#2E3940]" />` | `src/components/kudos/SecretBoxModal.tsx`
- [x] T011 [US1] Add instruction text and gift box image area to SecretBoxModal. Instruction: `<p>` with `font-[family-name:var(--font-montserrat)] text-[13px] font-bold leading-[19px] tracking-[0.4px] text-white text-right` showing `{t.kudos.secretBoxInstruction}`. Conditionally hidden when `remainingBoxes === 0` (US2). Gift box area: `<div className="relative w-full max-w-[557px] aspect-square">`. Inside: `<button>` wrapping `<Image src="/images/secret-box/gift-box-unopened.png" alt="Secret Box" fill className="object-contain" />` with `aria-label="Open secret box"`. Sparkle overlay: `<Image src="/images/secret-box/sparkle-effect.png" alt="" fill className="absolute inset-0 pointer-events-none object-contain" />`. Gift box button states: default `cursor-pointer`, hover `hover:scale-[1.03] transition-transform duration-200 ease-out`, active `active:scale-[0.98]`, disabled (count=0) `opacity-50 cursor-not-allowed pointer-events-none`, loading `opacity-70 cursor-wait` | `src/components/kudos/SecretBoxModal.tsx`
- [x] T012 [US1] Add box counter section and API integration to SecretBoxModal. Add separator: `<div className="w-full h-px bg-[#2E3940]" />`. Counter area: `<div className="flex items-center gap-[6px]">` with label `<span>` (`text-[13px] font-bold text-white`) showing `{t.kudos.secretBoxCounterLabel}` and count `<span>` (`text-[29px] font-bold text-[#FFEA9E]`) showing `String(remainingBoxes).padStart(2, '0')`. Add local state: `const [localRemaining, setLocalRemaining] = useState(remainingBoxes)`, `const [isOpening, setIsOpening] = useState(false)`, `const [toastMessage, setToastMessage] = useState<string | null>(null)`. On gift box click: if `isOpening` or `localRemaining <= 0` return. Set `isOpening(true)`, call `fetch("/api/users/me/secret-box", { method: "POST" })`. On success: decrement `localRemaining` from response `remaining` field. On error: show Toast, preserve count. Finally: `setIsOpening(false)`. Render `<Toast>` component for errors | `src/components/kudos/SecretBoxModal.tsx`
- [x] T013 [US3] Add focus trap and keyboard handling to SecretBoxModal. Follow `RulesPanel.tsx` pattern: `useEffect` with `keydown` listener for Escape → `handleClose()`. Tab trap: query focusable elements, cycle first↔last on Tab/Shift+Tab. Store `previousFocusRef` on open, restore on close. Auto-focus first focusable element on mount | `src/components/kudos/SecretBoxModal.tsx`

**Checkpoint**: SecretBoxModal renders correctly, opens/closes with animation, calls API on box click, handles empty state and all close methods. All T006-T008 tests pass green.

---

## Phase 4: User Story 4 - Multiple Sequential Opens (Priority: P2)

**Goal**: After opening a box, if remaining > 0, reset to unopened state so user can open another without closing modal.

**Independent Test**: Open box → after API success, verify modal shows updated count and gift box is clickable again. Open last box (count was 1) → verify empty state shows.

### Tests (US4)

- [x] T014 [US4] Add failing tests for sequential opens: (1) "resets to clickable state after successful open when remaining > 0", (2) "shows empty state after opening last box (remaining becomes 0)", (3) "prevents double-click during API call (loading state)" | `src/__tests__/components/kudos/SecretBoxModal.test.tsx`

### Frontend (US4)

- [x] T015 [US4] Implement sequential open logic in SecretBoxModal. After successful API response: update `localRemaining` from `response.data.remaining`. If `remaining > 0`: gift box stays clickable, instruction text stays visible. If `remaining === 0`: instruction hidden, gift box disabled (`opacity-50 pointer-events-none`), counter shows "00". Ensure `isOpening` resets to `false` so user can click again. The component already handles this via state — verify the flow: click → loading → API success → update state → ready for next click | `src/components/kudos/SecretBoxModal.tsx`

**Checkpoint**: User can open multiple boxes sequentially. T014 tests pass green.

---

## Phase 5: Integration — SecretBoxButton Wiring

**Goal**: Modify the existing trigger button to open the modal instead of directly calling the API.

**Independent Test**: Click "Mở Secret Box" button on Kudos page → verify modal opens. Close modal → verify stats refresh.

### Frontend (Integration)

- [x] T016 Modify `SecretBoxButton.tsx`: Remove `handleOpen` async function (direct API call), remove `isOpening` and `toastMessage` state, remove `<Toast>` render. Add `const [isModalOpen, setIsModalOpen] = useState(false)`. Add `const router = useRouter()` (import from `next/navigation`). Button `onClick` → `setIsModalOpen(true)`. Add `handleClose` callback: `setIsModalOpen(false)` then `router.refresh()` to revalidate `StatsCard` server data. Render `<SecretBoxModal isOpen={isModalOpen} remainingBoxes={remainingBoxes} onClose={handleClose} />`. Import `SecretBoxModal` from `@/components/kudos/SecretBoxModal`. Keep existing button styling and disabled state (`remainingBoxes <= 0`) | `src/components/kudos/SecretBoxButton.tsx`

**Checkpoint**: Full flow works end-to-end: button → modal → open box → count updates → close → stats refresh.

---

## Phase 6: Testing & Polish

**Purpose**: Ensure all tests pass, accessibility verified, responsive behavior correct

### Tests

- [x] T017 [P] Verify all existing tests still pass after SecretBoxButton changes. Run `yarn vitest run` and fix any regressions | `src/__tests__/`
- [x] T018 [P] Add accessibility-focused tests: (1) "modal has role=dialog and aria-modal=true", (2) "focus moves to modal on open", (3) "focus returns to trigger on close", (4) "Tab key cycles through focusable elements within modal", (5) "gift box button has aria-label" | `src/__tests__/components/kudos/SecretBoxModal.test.tsx`

### Polish

- [x] T019 [P] Verify responsive behavior at all 3 breakpoints. Mobile (<640px): modal width 90vw, title 20px. Tablet (640-1023px): modal width 80vw. Desktop (≥1024px): modal width 652px. Ensure touch targets ≥ 44px on mobile for close button and gift box. Fix any overflow or layout issues | `src/components/kudos/SecretBoxModal.tsx`
- [x] T020 Run `yarn lint` and `yarn build` to ensure zero errors. Fix any TypeScript strict mode issues, unused imports, or ESLint violations | all affected files

**Checkpoint**: All tests green, lint clean, build succeeds, responsive verified.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundation (Phase 2)**: T004 (migration) has no code dependency, can start in parallel with Phase 1. T005 (API route) depends on T004 (migration must exist for `user_badges` table)
- **US1+US2+US3 (Phase 3)**: Depends on Phase 1 (assets, i18n) + Phase 2 (API must return `badge_type`). Tests (T006-T008) can be written in parallel with Phase 2 since they mock the API
- **US4 (Phase 4)**: Depends on Phase 3 (modal must exist)
- **Integration (Phase 5)**: Depends on Phase 3 (SecretBoxModal must exist)
- **Polish (Phase 6)**: Depends on Phase 4 + Phase 5

### Within Each Phase

- Tests (T006-T008) MUST be written and FAIL before implementation (T009-T013) — TDD per constitution
- T009 (modal shell) → T010 (title bar) → T011 (instruction + image) → T012 (counter + API) → T013 (focus trap) — sequential build-up of the component
- Phase 4 and Phase 5 can run in parallel (different files)

### Parallel Opportunities

```
Phase 1: T001 ──┬── T002 [P] ── T003 [P]
                 │
Phase 2: T004 ── T005
                 │
Phase 3: T006 ── T007 [P] ── T008 [P]  (tests first, can write while Phase 2 completes)
         then: T009 → T010 → T011 → T012 → T013  (sequential component build)
                 │
         ┌───────┴────────┐
Phase 4: T014 → T015      Phase 5: T016    (parallel!)
         └───────┬────────┘
Phase 6: T017 [P] ── T018 [P] ── T019 [P] ── T020
```

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1+US2+US3 — core modal with all open/close/empty behaviors)
3. **STOP and VALIDATE**: Modal works, API assigns badges, count decrements, empty state correct
4. This is a shippable MVP — sequential opens (US4) and button integration (Phase 5) are enhancements

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 → Core modal works (US1+US2+US3) → Test independently
3. Phase 4 + 5 → Sequential opens + button wiring → Full feature complete
4. Phase 6 → All tests green, polished

---

## Notes

- Constitution mandates TDD: write failing tests (T006-T008, T014) BEFORE implementation
- Font class: use `font-[family-name:var(--font-montserrat)]` NOT `font-montserrat`
- Gift box assets may need manual Figma export if MoMorph tools fail (T001 handles this gracefully with placeholders)
- The "opened" state / badge reveal is OUT OF SCOPE — after API success, the badge_type is available in the response for future use but no reveal UI is built in this task set
- `StatsCard.tsx` does NOT need changes — `router.refresh()` in Phase 5 handles data revalidation
- Commit after each phase checkpoint for clean git history
