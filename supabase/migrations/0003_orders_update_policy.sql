-- TIJDELIJK: personeel kan de status van een bestelling aanpassen (bv. naar "klaar").
-- Dit staat nu nog open voor iedereen omdat er nog geen personeelslogin bestaat.
-- Voordat het systeem live gaat met echte klanten moet dit vervangen worden door
-- een regel die alleen ingelogd personeel toestaat.
create policy "Iedereen mag bestelstatus aanpassen (tijdelijk)" on orders
  for update using (true) with check (true);

-- Zet live-updates (realtime) aan voor bestellingen en bestelregels,
-- zodat het keukenscherm automatisch nieuwe bestellingen laat verschijnen.
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
