
-- 1) Orders: remove blanket public SELECT, add SECURITY DEFINER tracking RPC
DROP POLICY IF EXISTS "Public order lookup by id" ON public.orders;

CREATE OR REPLACE FUNCTION public.get_order_tracking(p_id text)
RETURNS TABLE (
  id text,
  status public.order_status,
  total numeric,
  customer_name text,
  phone text,
  address text,
  items jsonb,
  payment_method text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.status, o.total, o.customer_name, o.phone, o.address,
         o.items, o.payment_method, o.created_at, o.updated_at
  FROM public.orders o
  WHERE o.id = p_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_tracking(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;

-- 2) Promo codes: remove blanket public read, add validation RPC
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;

CREATE OR REPLACE FUNCTION public.validate_promo_code(p_code text)
RETURNS TABLE (
  code text,
  discount_type text,
  discount_value numeric,
  expires_at timestamptz,
  usage_limit integer,
  used_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.code, p.discount_type, p.discount_value,
         p.expires_at, p.usage_limit, p.used_count
  FROM public.promo_codes p
  WHERE p.active = true
    AND upper(p.code) = upper(p_code)
    AND (p.expires_at IS NULL OR p.expires_at > now())
    AND (p.usage_limit IS NULL OR p.used_count < p.usage_limit)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_promo_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_promo_code(text) TO anon, authenticated;

-- 3) Loyalty points: remove self-insert, only admin or RPC can write
DROP POLICY IF EXISTS "System and admins insert points" ON public.point_transactions;

CREATE POLICY "Admins insert points"
ON public.point_transactions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.award_loyalty_points(
  p_order_id text,
  p_earned integer,
  p_redeemed integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_order_user uuid;
  v_current integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_earned < 0 OR p_redeemed < 0 THEN
    RAISE EXCEPTION 'Point values must be non-negative';
  END IF;

  SELECT user_id INTO v_order_user FROM public.orders WHERE id = p_order_id;
  IF v_order_user IS NULL OR v_order_user <> v_uid THEN
    RAISE EXCEPTION 'Order does not belong to caller';
  END IF;

  -- Prevent double-awarding for the same order
  IF EXISTS (SELECT 1 FROM public.point_transactions WHERE order_id = p_order_id) THEN
    RAISE EXCEPTION 'Points already recorded for this order';
  END IF;

  SELECT COALESCE(loyalty_points, 0) INTO v_current FROM public.profiles WHERE id = v_uid;
  IF p_redeemed > COALESCE(v_current, 0) THEN
    RAISE EXCEPTION 'Insufficient loyalty balance';
  END IF;

  IF p_redeemed > 0 THEN
    INSERT INTO public.point_transactions (user_id, order_id, points, type)
    VALUES (v_uid, p_order_id, p_redeemed, 'redeem');
  END IF;
  IF p_earned > 0 THEN
    INSERT INTO public.point_transactions (user_id, order_id, points, type)
    VALUES (v_uid, p_order_id, p_earned, 'earn');
  END IF;

  UPDATE public.profiles
  SET loyalty_points = COALESCE(loyalty_points, 0) - p_redeemed + p_earned
  WHERE id = v_uid;
END;
$$;

REVOKE ALL ON FUNCTION public.award_loyalty_points(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_loyalty_points(text, integer, integer) TO authenticated;
