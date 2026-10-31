-- ============================================================
-- SAREE SHOP — DEMO SEED DATA
-- Run AFTER schema.sql and policies.sql.
-- Optional: gives you categories, sample products, offers,
-- default settings and page content so the site looks alive.
-- ============================================================

-- ---------- categories ----------
insert into public.categories (name, slug, description, image_url, sort_order) values
  ('Silk Sarees',      'silk-sarees',      'Luxurious pure and art silk sarees.',        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 1),
  ('Cotton Sarees',    'cotton-sarees',    'Breathable handwoven cotton sarees.',        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 2),
  ('Bridal Sarees',    'bridal-sarees',    'Opulent sarees for your big day.',           'https://images.unsplash.com/photo-1594387295790-5c0a2cc20b35?w=800', 3),
  ('Party Wear Sarees','party-wear-sarees','Glamorous sarees for celebrations.',         'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800', 4),
  ('Daily Wear Sarees','daily-wear-sarees','Comfortable sarees for everyday elegance.',  'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=800', 5)
on conflict (slug) do nothing;

-- ---------- products ----------
with c as (select id, slug from public.categories)
insert into public.products
  (product_code, name, slug, description, category_id, collection, price, discount_price, stock, is_available, is_featured, is_new_arrival, is_best_seller, images)
values
  ('SR-0001','Kanchipuram Pure Silk Saree','kanchipuram-pure-silk','Handwoven Kanchipuram pure silk saree with a contrast gold zari border and matching blouse piece.',
     (select id from c where slug='silk-sarees'),'Festive 2025', 12999, 9999, 8, true, true, true, true,
     array['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1000']),
  ('SR-0002','Banarasi Silk Bridal Saree','banarasi-silk-bridal','Rich red Banarasi silk bridal saree with intricate gold brocade and heavy pallu.',
     (select id from c where slug='bridal-sarees'),'Bridal Couture', 24999, 19999, 4, true, true, false, true,
     array['https://images.unsplash.com/photo-1594387295790-5c0a2cc20b35?w=1000']),
  ('SR-0003','Soft Cotton Handloom Saree','soft-cotton-handloom','Lightweight handloom cotton saree with woven stripes, perfect for daily wear.',
     (select id from c where slug='cotton-sarees'),'Everyday Edit', 2499, 1799, 20, true, false, true, false,
     array['https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=1000']),
  ('SR-0004','Georgette Party Wear Saree','georgette-party-wear','Flowy georgette saree with sequin work and a designer blouse, made for celebrations.',
     (select id from c where slug='party-wear-sarees'),'Festive 2025', 5999, 4499, 12, true, true, true, false,
     array['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000']),
  ('SR-0005','Chanderi Daily Wear Saree','chanderi-daily-wear','Elegant Chanderi saree with a subtle sheen for comfortable everyday elegance.',
     (select id from c where slug='daily-wear-sarees'),'Everyday Edit', 3299, null, 15, true, false, false, true,
     array['https://images.unsplash.com/photo-1583391733981-8498408ab9a1?w=1000']),
  ('SR-0006','Mysore Pure Silk Saree','mysore-pure-silk','Classic Mysore silk saree with a smooth finish and gold-toned border.',
     (select id from c where slug='silk-sarees'),'Signature', 8999, 6999, 6, true, true, false, false,
     array['https://images.unsplash.com/photo-1610030469668-8e9f3f1c8d34?w=1000'])
on conflict (product_code) do nothing;

-- ---------- offers ----------
insert into public.offers (title, subtitle, description, image_url, discount_text, cta_label, cta_link, sort_order) values
  ('Festive Season Sale','Up to 30% off on silk sarees','Celebrate the festive season with our handpicked silk collection.',
     'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400','Flat 30% OFF','Shop Silk','/category/silk-sarees',1),
  ('Bridal Edit','Make your big day unforgettable','Exclusive bridal sarees crafted with love.',
     'https://images.unsplash.com/photo-1594387295790-5c0a2cc20b35?w=1400','New Collection','Explore Bridal','/category/bridal-sarees',2)
on conflict do nothing;

-- ---------- site settings ----------
insert into public.site_settings (id, nav_links, footer_text) values (
  'global',
  '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"},{"label":"Offers","href":"/offers"},{"label":"About","href":"/about"},{"label":"Contact","href":"/contact"}]'::jsonb,
  '© 2025 Saanvi Sarees. Handcrafted with love in India.'
) on conflict (id) do nothing;

-- ---------- page content ----------
insert into public.page_content (key, data) values
  ('home', '{
    "hero_title": "Timeless Sarees, Woven for You",
    "hero_subtitle": "Discover handcrafted silk, cotton and bridal sarees. Order easily on WhatsApp.",
    "hero_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600",
    "hero_cta": "Shop the Collection",
    "feature_strip": ["Handpicked Quality","Easy WhatsApp Ordering","Pan-India Delivery","Trusted by 5000+ Customers"]
  }'::jsonb),
  ('about', '{
    "title": "About Saanvi Sarees",
    "body": "Saanvi Sarees began with a simple love for India''s timeless weaves. We work directly with weavers across the country to bring you authentic, handcrafted sarees at honest prices. Every saree in our collection is chosen for its quality, craftsmanship and the story it carries.",
    "image": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1000"
  }'::jsonb),
  ('contact', '{
    "title": "Contact Us",
    "intro": "Have a question about a saree or your order? We would love to help."
  }'::jsonb),
  ('privacy', '{"title":"Privacy Policy","body":"We respect your privacy. We only collect the details you provide (name, phone, address) to process and deliver your order. We never sell your data to third parties."}'::jsonb),
  ('terms', '{"title":"Terms & Conditions","body":"By placing an order you agree that orders are confirmed over WhatsApp. Prices and availability may change. Delivery timelines are indicative. Please contact us for returns or exchanges within 7 days of delivery."}'::jsonb)
on conflict (key) do nothing;
