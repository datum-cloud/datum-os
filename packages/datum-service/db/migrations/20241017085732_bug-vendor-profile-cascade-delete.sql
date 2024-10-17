-- Modify "vendor_profiles" table
ALTER TABLE "vendor_profiles" DROP CONSTRAINT "vendor_profiles_vendors_profile", ADD CONSTRAINT "vendor_profiles_vendors_profile" FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "vendor_profile_payment_preferences" table
ALTER TABLE "vendor_profile_payment_preferences" DROP CONSTRAINT "vendor_profile_payment_prefere_e3505e26af02e9e6b9954ff843a5335c", ADD CONSTRAINT "vendor_profile_payment_prefere_e3505e26af02e9e6b9954ff843a5335c" FOREIGN KEY ("vendor_profile_id") REFERENCES "vendor_profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
