
-- Restore SELECT for authenticated; keep it revoked from anon
GRANT SELECT (user_id) ON public.reviews TO authenticated;
REVOKE SELECT (user_id) ON public.reviews FROM anon;
