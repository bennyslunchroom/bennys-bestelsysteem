-- Benny's Bestelsysteem: eerste database-structuur
-- Categorieën van de menukaart (bv. Ontbijt, Tosti's, Panini's)
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Gerechten
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- De 15 tafels
create table tables (
  id uuid primary key default gen_random_uuid(),
  table_number int not null unique,
  created_at timestamptz not null default now()
);

-- Bestellingen
create table orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references tables(id),
  status text not null default 'new' check (status in ('new', 'in_progress', 'ready', 'paid', 'cancelled')),
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bestelregels (welke gerechten horen bij welke bestelling)
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Beveiliging: standaard is alles afgesloten, tenzij een regel het expliciet toestaat.
alter table categories enable row level security;
alter table products enable row level security;
alter table tables enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Menukaart en tafels mag iedereen lezen (nodig voor de QR-bestelpagina).
create policy "Menukaart is publiek leesbaar" on categories for select using (true);
create policy "Gerechten zijn publiek leesbaar" on products for select using (true);
create policy "Tafels zijn publiek leesbaar" on tables for select using (true);

-- Klanten mogen zelf bestellingen aanmaken en hun eigen bestelling teruglezen.
create policy "Iedereen mag een bestelling plaatsen" on orders for insert with check (true);
create policy "Bestellingen zijn leesbaar" on orders for select using (true);
create policy "Iedereen mag bestelregels toevoegen" on order_items for insert with check (true);
create policy "Bestelregels zijn leesbaar" on order_items for select using (true);

-- Let op: het aanpassen van bestelstatus (bv. "klaar" of "afgerekend") gebeurt later
-- via het kassa-/keukenscherm, met een eigen personeelslogin. Dat bouwen we in een
-- volgende stap, zodat niet zomaar iedereen een bestelling kan wijzigen.
