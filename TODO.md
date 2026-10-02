# TODO — Learn Loop (mobile app)

- [ ] **Push notifications** (phase 2 of the "join a class" plan) — via `expo-notifications` + Expo's push service. Requires moving from Expo Go to a development build first: Expo Go dropped remote push support on Android as of SDK 53, so this isn't a pure code change.
- [ ] **Remove the unused `@expo/ui` dependency** from `package.json` — replaced by `components/ui/select-field.tsx` (2026-10-02). Left installed on purpose to avoid touching `node_modules` mid-session; safe to remove once not actively testing live.
