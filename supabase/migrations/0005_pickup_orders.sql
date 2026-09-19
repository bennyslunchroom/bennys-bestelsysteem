-- Maakt afhaalbestellingen (via de website) mogelijk naast bestellingen aan tafel.
alter table orders alter column table_id drop not null;

alter table orders add column order_type text not null default 'dine_in'
  check (order_type in ('dine_in', 'pickup'));

alter table orders add column customer_name text;
