
-- 1. Promo codes
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percent','flat')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  expires_at timestamptz,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promo codes" ON public.promo_codes
  FOR SELECT USING (active = true);
CREATE POLICY "Admins manage promo codes" ON public.promo_codes
  FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_promo_codes_updated BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Loyalty points balance on profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS loyalty_points integer NOT NULL DEFAULT 0;

-- 3. Point transactions
CREATE TABLE public.point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id text,
  points integer NOT NULL,
  type text NOT NULL CHECK (type IN ('earn','redeem')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own points" ON public.point_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins see all points" ON public.point_transactions
  FOR SELECT USING (has_role(auth.uid(),'admin'));
CREATE POLICY "System and admins insert points" ON public.point_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(),'admin'));

-- 4. Menu overrides
CREATE TABLE public.menu_overrides (
  item_id text PRIMARY KEY,
  available boolean NOT NULL DEFAULT true,
  price_override numeric,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads menu overrides" ON public.menu_overrides FOR SELECT USING (true);
CREATE POLICY "Admins write menu overrides" ON public.menu_overrides
  FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_menu_overrides_updated BEFORE UPDATE ON public.menu_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Saved addresses
CREATE TABLE public.saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text NOT NULL,
  address text NOT NULL,
  phone text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON public.saved_addresses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Orders: payment/promo/loyalty columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod',
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS discount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_redeemed integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_earned integer NOT NULL DEFAULT 0;

-- 7. Seed admin user
DO $$
DECLARE
  admin_id uuid;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'suhailahmedaamro786@gmail.com';
  IF existing_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_id, 'authenticated','authenticated',
      'suhailahmedaamro786@gmail.com',
      crypt('#Suhail#12', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"DFC Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', 'suhailahmedaamro786@gmail.com'),
      'email', admin_id::text, now(), now(), now());
  ELSE
    admin_id := existing_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (admin_id, 'DFC Admin', '03145327444')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin')
  ON CONFLICT DO NOTHING;
END $$;
