# Security release checklist — Netflix do Músico

## Verified 2026-10-12
- Production npm dependency audit: 0 reported vulnerabilities at time of scan.
- Supabase RLS policies exist for ndm_profiles, ndm_records, ndm_progress, ndm_interactions and settings; manual abuse tests still required.
- Supabase security advisor warns that leaked-password protection is disabled. Enable in Auth settings.
- Legacy public.profiles has RLS with no policy; inspect before changing or deleting.
- GitHub CI builds and tests on PR/push.
- Repository still tracks generated dist/ and node_modules/; schedule separate index cleanup and review impact before mass deletion.

## Mandatory before production
- Enforce MFA on owner GitHub, Supabase, domain registrar and hosting; store recovery codes offline.
- Protect main branch and require passing CI + review for merges. Audit collaborators and deploy tokens.
- Rotate any secret ever committed or exposed. Never use Supabase service-role or Mercado Pago tokens in browser.
- Test unauthorized API access with separate student and unauthenticated sessions, not just UI guards.
- Use hosted Mercado Pago checkout; never store full card numbers, CVV or customer passwords.
- Test private video signed URL expiration and access revocation; short-lived URLs are bearer links, not DRM.
- Configure rate limiting, bot protections, monitoring and tested database backups.
- Define retention, privacy notice, access requests and incident response under LGPD.
