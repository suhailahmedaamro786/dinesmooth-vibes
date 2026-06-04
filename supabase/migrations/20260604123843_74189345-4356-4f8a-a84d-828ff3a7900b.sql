
-- Fix 1: Hide reviews.user_id from public projection via column-level privileges
REVOKE SELECT (user_id) ON public.reviews FROM anon;
REVOKE SELECT (user_id) ON public.reviews FROM authenticated;
-- Restrict SELECT policy: only allow non-sensitive columns publicly; own user_id via owner policy
DROP POLICY IF EXISTS "Anyone reads reviews" ON public.reviews;
CREATE POLICY "Anyone reads reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);
-- Grant only safe columns
GRANT SELECT (id, item_id, order_id, rating, comment, created_at, updated_at) ON public.reviews TO anon, authenticated;

-- Fix 2: user_roles privilege escalation - remove broad ALL policy, use granular admin-only policies
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins insert roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins select all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
