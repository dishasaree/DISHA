-- ============================================================
-- MAKE A USER AN ADMIN
-- ------------------------------------------------------------
-- Step 1: In Supabase Dashboard > Authentication > Users,
--         click "Add user" and create your admin login
--         (email + password). Confirm the email if required
--         (toggle "Auto Confirm User").
--
-- Step 2: Run the query below (replace the email) to grant
--         that user admin access. This inserts their auth id
--         into public.admins, which is what the app and RLS
--         policies check.
-- ============================================================

insert into public.admins (id, email)
select id, email
from auth.users
where email = 'suvintcs@gmail.com'   -- <-- CHANGE THIS
on conflict (id) do nothing;

-- Verify:
-- select * from public.admins;
