
-- 1. Remove orders from realtime publication (broadcast leak)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.orders';
  END IF;
END $$;

-- 2. Admin SELECT policy on orders
DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
CREATE POLICY "Admins view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Remove PII column from publicly readable reviews
ALTER TABLE public.reviews DROP COLUMN IF EXISTS customer_name;
