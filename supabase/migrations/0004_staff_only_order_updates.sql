-- Vervangt de tijdelijke "iedereen mag wijzigen"-regel uit migratie 0003:
-- vanaf nu mag alleen ingelogd personeel de status van een bestelling aanpassen.
drop policy "Iedereen mag bestelstatus aanpassen (tijdelijk)" on orders;

create policy "Ingelogd personeel mag bestelstatus aanpassen" on orders
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
