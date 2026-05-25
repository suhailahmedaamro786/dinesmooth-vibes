
-- 1. Revoke public read access to reviews.user_id (UUID exposure)
REVOKE SELECT (user_id) ON public.reviews FROM anon, authenticated;

-- 2. Explicit INSERT guard on user_roles (defense-in-depth against self-grant)
DROP POLICY IF EXISTS "Only admins insert roles" ON public.user_roles;
CREATE POLICY "Only admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
