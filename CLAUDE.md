# Project rules — Learn Loop (mobile app)

Expo Router app (SDK 57, Expo Go), React Native 0.86 + Reanimated 4 + react-native-worklets, "Liquid Glass" / Revolut-inspired UI.

## Package manager

npm (not pnpm/yarn) — `package-lock.json` is the committed lockfile.

## Testing

- **Jest via `jest-expo`**, not Vitest — the backend/frontend repos use Vitest, this one doesn't; that's a deliberate per-ecosystem choice, not drift.
- Tests are colocated: `foo.ts` → `foo.test.ts`, `button.tsx` → `button.test.tsx`.
- `jest-setup.ts` hand-mocks `react-native-reanimated` (see the comment in that file) because the installed `react-native-worklets` (0.10.x) hardcodes `IS_JEST` to `false` in its native-platform checker, so the library's own `/mock` export still runs real native init under `jest-expo` and crashes. Don't swap back to `jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))` without re-checking whether a newer `react-native-worklets` fixed this.
- `@testing-library/react-native` v14's `render()` is **async** — always `await render(...)` before querying `screen`.
- Run `npm run test`, `npm run lint` (`expo lint`), `npx tsc --noEmit` before considering a change done.

## Liquid Glass (`components/ui/glass-view.tsx`) — hard-won rules

`GlassSurface` renders real native `expo-glass-effect` `GlassView` when available, falling back to a `BlurView` approximation otherwise. Getting this wrong causes a **hard native crash**, not a JS error (nothing shows in Metro/LogBox — the app just closes).

1. **Use `isGlassEffectAPIAvailable()`, never `isLiquidGlassAvailable()`** to gate native glass. The latter is a compile-time check that can report `true` on iOS 26 betas where the native `UIGlassEffect` selector isn't actually there ([expo/expo#40911](https://github.com/expo/expo/issues/40911)).
2. **Never animate opacity on a `GlassSurface` or any of its ancestors.** This includes a parent `Modal`'s own `animationType="fade"` — that's a native opacity transition too. Use `animationType="none"` plus transform-only Reanimated animations (scale/translateY) for anything wrapping glass. See [expo/expo#50097](https://github.com/expo/expo/issues/50097).
3. **Never put scrollable content directly inside a `GlassSurface`.** Make the glass an absolutely-positioned background sibling instead (see `bottom-sheet.tsx` for the pattern: `GlassSurface` as `StyleSheet.absoluteFill`, scrollable content as a sibling `View`/`ScrollView` on top of it), not the scroll container's direct parent.
4. Before touching any `GlassSurface` usage, `grep -rn "GlassSurface" --include="*.tsx"` and check every call site against the three rules above — this bug is systemic, not per-file, because the whole redesign's "entrance fade" animation pattern collides with rule 2.

## Navigation (Expo Router + NativeTabs)

- Tabs are real native (`expo-router/unstable-native-tabs`), configured in `app/(tabs)/_layout.tsx`. Each tab is its own route group (`(home)`, `(chats)`, `(notifications)`, `(profile)`) with its own nested `_layout.tsx`/`index.tsx`, not a flat file per tab.
- Parenthesized segments are invisible in the URL, but when multiple sibling groups would otherwise collide at the same path (e.g. four tabs all mapping to `/`), you must address them by their qualified path: `/(tabs)/(home)`, `/(tabs)/(profile)`, `/(tabs)/(notifications)` — not `/profile` or `/notifications`, which don't exist as routes post-restructure.
- **Always run `npx tsc --noEmit` after touching any route or `router.push`/`router.replace` call.** If it reports a route-union error that looks wrong (e.g. a route you're sure exists), the cause is usually a **stale `.expo/types/router.d.ts` cache**, not your code — regenerate it with `npx expo export --platform web --output-dir <scratch-dir>` before trusting the error.

## Local dev config

- `constants/config.ts`'s `API_URL` is manually toggled between the local LAN IP (testing at home via Expo Go) and the Render-hosted prod backend. **Never commit whichever state it's in** without checking with the user first — it's a personal toggle, not a real config change.
- Testing the backend from a phone over Wi-Fi requires a Windows Firewall inbound **allow** rule for the backend's Node binary/port (not just absence of a block rule — default inbound is Block). If registration/login times out with `UnexpectedException: The request timed out` but `curl localhost:8000` works fine from the dev machine, suspect the firewall first, not the code.

## Git

Commits end with a `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer (session convention — check the current session's instructions before assuming this still applies). Split unrelated changes into separate logical commits even when discovered retroactively uncommitted (navigation / UI redesign / tests / CI each got their own commit here).
