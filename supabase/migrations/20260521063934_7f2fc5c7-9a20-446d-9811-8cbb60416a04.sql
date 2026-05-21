
-- Fix search_path on helper functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Revoke public execute on security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten guest order INSERT policy
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;

CREATE POLICY "Place order with valid fields"
  ON public.orders FOR INSERT
  WITH CHECK (
    char_length(customer_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 5 AND 30
    AND char_length(address) BETWEEN 3 AND 500
    AND total >= 0
    AND (user_id IS NULL OR user_id = auth.uid())
  );
