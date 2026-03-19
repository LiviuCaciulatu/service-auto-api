CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clients 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,

    country VARCHAR(20) NOT NULL,
    serie VARCHAR(10) NOT NULL,
    number VARCHAR(10) NOT NULL,
    nationality VARCHAR(30) NOT NULL,
    cnp VARCHAR(20) NOT NULL,
    birth_place VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    issued_by VARCHAR(50) NOT NULL,
    validity VARCHAR(50) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_documents
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    property_A VARCHAR(20),
    property_J VARCHAR(20),
    property_D_1 VARCHAR(50),
    property_D_2 VARCHAR(20),
    property_D_3 VARCHAR(30),
    property_E VARCHAR(30),
    property_K VARCHAR(30),
    property_C_2_1 VARCHAR(30),
    property_C_2_2 VARCHAR(40),
    property_C_2_3 VARCHAR(100),
    property_C_3_1 VARCHAR(255),
    property_C_3_2 VARCHAR(255),
    property_C_3_3 VARCHAR(255),
    property_B VARCHAR(15),
    property_H VARCHAR(15),
    property_I VARCHAR(10),
    property_I_1 VARCHAR(15),
    property_F_1 VARCHAR(15),
    property_G VARCHAR(15),
    property_P_1 VARCHAR(15),
    property_P_2 VARCHAR(15),
    property_P_3 VARCHAR(30),
    property_Q VARCHAR(30),
    property_R VARCHAR(30),
    property_S_1 VARCHAR(10),
    property_S_2 VARCHAR(20),
    property_V_7 VARCHAR(30),
    property_V_10 VARCHAR(30),
    property_Y VARCHAR(30),
    property_Z VARCHAR(30),
    observatii TEXT,
    numar_certificat VARCHAR(50),
    property_C_2_equals_C_1 BOOLEAN,
    property_C_3_equals_C_1 BOOLEAN,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

--voi modifica tabela de car documents adaugand o coloana de referinta la client
--relatia este: un client are mai multe car documents
--comportament de stergere: la stergerea clientului se sterge toate car documents asociate
ALTER TABLE car_documents
ADD COLUMN IF NOT EXISTS client_id UUID NOT NULL;

ALTER TABLE car_documents
DROP CONSTRAINT IF EXISTS fk_car_documents_client;

ALTER TABLE car_documents
ADD CONSTRAINT fk_car_documents_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS driver_licenses
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(20) NOT NULL,
    birth_place VARCHAR(50) NOT NULL,
    issued_date VARCHAR(20) NOT NULL,
    expiration_date VARCHAR(20) NOT NULL,
    issued_by VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE driver_licenses
DROP CONSTRAINT IF EXISTS fk_driver_licenses_client;

ALTER TABLE driver_licenses
ADD CONSTRAINT fk_driver_licenses_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE driver_licenses
ADD COLUMN IF NOT EXISTS vehicle_codes VARCHAR(5)[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS compensation_claims
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    attention_to VARCHAR(50) NOT NULL,
    claim_file_number VARCHAR(20) NOT NULL,
    claimant_name VARCHAR(50) NOT NULL,
    cnp VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    registration_number VARCHAR(15) NOT NULL,
    claim_number VARCHAR(20) NOT NULL,
    observations TEXT,
    date VARCHAR(20) NOT NULL,
    signature VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
    );

ALTER TABLE compensation_claims
DROP CONSTRAINT IF EXISTS fk_compensation_claims_client;

ALTER TABLE compensation_claims
ADD CONSTRAINT fk_compensation_claims_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS compensated_drivers
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL,

    amount VARCHAR(15) NOT NULL,
    bank VARCHAR(50) NOT NULL,
    iban VARCHAR(50) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compensated_drivers
DROP CONSTRAINT IF EXISTS fk_compensated_drivers_claim;

ALTER TABLE compensated_drivers
ADD CONSTRAINT fk_compensated_drivers_claim
FOREIGN KEY (claim_id) REFERENCES compensation_claims(id) ON DELETE CASCADE;

ALTER TABLE compensated_drivers
ADD COLUMN IF NOT EXISTS account_holder VARCHAR(50) NOT NULL;

CREATE TABLE IF NOT EXISTS contracte_cesiune_creanta
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    claim_number VARCHAR(20) NOT NULL,
    claim_date VARCHAR(20) NOT NULL,
    claimant_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cnp VARCHAR(20) NOT NULL,
    contract_value VARCHAR(15) NOT NULL,
    insurance_company VARCHAR(50) NOT NULL,
    insurance_company_address VARCHAR(255) NOT NULL,
    insurance_company_cui VARCHAR(20) NOT NULL,
    insurance_company_j VARCHAR(20) NOT NULL,
    complaint_number VARCHAR(20) NOT NULL,
    vehicle_registration_number VARCHAR(15) NOT NULL,
    invoice_number VARCHAR(20) NOT NULL,
    invoice_value VARCHAR(15) NOT NULL,
    cedent VARCHAR(50) NOT NULL,
    cesionar VARCHAR(50) NOT NULL,
    administrator VARCHAR(50),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contracte_cesiune_creanta
DROP CONSTRAINT IF EXISTS fk_contracte_cesiune_creanta_client;

ALTER TABLE contracte_cesiune_creanta
ADD CONSTRAINT fk_contracte_cesiune_creanta_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS contract_inlocuire_temporara
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    contract_number VARCHAR(20) NOT NULL,
    contract_date VARCHAR(20) NOT NULL,
    client_name VARCHAR(50) NOT NULL,
    representing VARCHAR(50) NOT NULL,
    cui VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    damaged_vehicle_make VARCHAR(50) NOT NULL,
    damaged_vehicle_registration_number VARCHAR(20) NOT NULL,
    damaged_vehicle_year VARCHAR(6) NOT NULL,
    damaged_vehicle_vin VARCHAR(25) NOT NULL,
    damaged_vehicle_type VARCHAR(25) NOT NULL,
    complaint_number VARCHAR(20) NOT NULL,
    replacement_vehicle_make VARCHAR(50) NOT NULL,
    replacement_vehicle_registration_number VARCHAR(20) NOT NULL,
    replacement_vehicle_year VARCHAR(6) NOT NULL,
    replacement_vehicle_delivery_date VARCHAR(20) NOT NULL,
    replacement_vehicle_return_date VARCHAR(20) NOT NULL,
    vehicle_returned_date VARCHAR(20),
    return_condition VARCHAR(30),
    price VARCHAR(15) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_inlocuire_temporara
DROP CONSTRAINT IF EXISTS fk_contract_inlocuire_temporara_client;

ALTER TABLE contract_inlocuire_temporara
ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT '';

ALTER TABLE contract_inlocuire_temporara
ADD COLUMN IF NOT EXISTS vehicle_returned_date VARCHAR(20);

ALTER TABLE contract_inlocuire_temporara
ADD COLUMN IF NOT EXISTS return_condition VARCHAR(30);

ALTER TABLE contract_inlocuire_temporara
ADD CONSTRAINT fk_contract_inlocuire_temporara_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS contract_reparatii_auto
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    contract_number VARCHAR(20) NOT NULL,
    contract_date VARCHAR(20) NOT NULL,
    client_name VARCHAR(50) NOT NULL,
    client_address VARCHAR(255) NOT NULL,
    client_phone VARCHAR(30) NOT NULL DEFAULT '',
    vehicle_make_model VARCHAR(50) NOT NULL,
    vehicle_registration_number VARCHAR(20) NOT NULL,
    vehicle_vin VARCHAR(20) NOT NULL,
    client_requested_works VARCHAR(255) NOT NULL,
    reinspections VARCHAR(255) NOT NULL,
    execution_period VARCHAR(10) NOT NULL,
    driver_belts VARCHAR(20),
    brake_lines VARCHAR(20),
    cooling_pipes VARCHAR(20),
    fuel_leaks VARCHAR(20),
    brake_pads VARCHAR(20),
    headlights VARCHAR(20),
    engine VARCHAR(20),
    gearbox VARCHAR(20),
    brake_fluid VARCHAR(20),
    washer_fluid VARCHAR(20),
    brake_test VARCHAR(20),
    exhaust_emissions VARCHAR(20),
    wheel_alignment VARCHAR(20),
    ac VARCHAR(20),
    central_locking VARCHAR(20),
    battery_charging VARCHAR(20),
    test_drive VARCHAR(20),
    rust VARCHAR(20),
    looseness VARCHAR(20),
    paint_color VARCHAR(20),
    paint_gloss VARCHAR(20),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_reparatii_auto
DROP CONSTRAINT IF EXISTS fk_contract_reparatii_auto_client;

ALTER TABLE contract_reparatii_auto
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(30) NOT NULL DEFAULT '';

ALTER TABLE contract_reparatii_auto
ADD CONSTRAINT fk_contract_reparatii_auto_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_allianz_tiriac
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    complaint_number VARCHAR(50) NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_email VARCHAR(100),
    claimant_mobile_phone VARCHAR(20),
    claimant_landline_phone VARCHAR(20),
    representing_name VARCHAR(100),
    incident_date VARCHAR(20) NOT NULL,
    incident_hour VARCHAR(20),
    location VARCHAR(150),
    vehicle_make VARCHAR(50),
    registration_number VARCHAR(20),
    vin VARCHAR(50),
    owned_by VARCHAR(100),
    casco_number VARCHAR(50),
    insurance_company VARCHAR(100),
    parked_at BOOLEAN DEFAULT FALSE,
    driven_by VARCHAR(100),
    material_damage BOOLEAN DEFAULT FALSE,
    injured BOOLEAN DEFAULT FALSE,
    name_of_injured VARCHAR(100),
    party_responsible VARCHAR(100),
    party_responsible_vehicle_make VARCHAR(50),
    party_responsible_registration_number VARCHAR(20),
    party_responsible_rca VARCHAR(50),
    party_responsible_insurance_company VARCHAR(100),
    diagram TEXT,
    description TEXT,
    casco VARCHAR(50),
    rcs VARCHAR(50),
    date VARCHAR(20),
    signature TEXT
    created_at TIMESTAMPTZ DEFAULT NOW()
)

ALTER TABLE avizare_allianz_tiriac
DROP CONSTRAINT IF EXISTS fk_avizare_allianz_tiriac_client;

ALTER TABLE avizare_allianz_tiriac
ADD CONSTRAINT fk_avizare_allianz_tiriac_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_asirom
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_birth_date VARCHAR(20),
    claimant_address VARCHAR(255),
    claimant_cnp VARCHAR(20),
    claimant_driver_license_category VARCHAR(10),
    claimant_driver_license_number VARCHAR(50),
    claimant_driver_license_expiration_date VARCHAR(20),
    claimant_driver_license_experience VARCHAR(20),
    claimant_phone VARCHAR(30),
    claimant_email VARCHAR(100),
    representative_name VARCHAR(100),
    representative_birth_date VARCHAR(20),
    representative_address VARCHAR(255),
    representative_cnp VARCHAR(20),
    representative_driver_license_category VARCHAR(10),
    representative_driver_license_number VARCHAR(50),
    representative_driver_license_expiration_date VARCHAR(20),
    representative_driver_license_experience VARCHAR(20),
    representative_phone VARCHAR(30),
    representative_email VARCHAR(100),
    representative_of VARCHAR(100),
    incident_location VARCHAR(255),
    incident_type VARCHAR(100),
    incident_date VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_registration_number VARCHAR(20),
    person_driving VARCHAR(100),
    person_driving_capacity VARCHAR(100),
    owner_damaged_vehicle VARCHAR(100),
    claim_number VARCHAR(50),
    claim_validity VARCHAR(50),
    responsible_party VARCHAR(100),
    bodily_injury BOOLEAN DEFAULT FALSE,
    injured_person_name_first VARCHAR(100),
    injured_person_name_second VARCHAR(100),
    damage TEXT,
    damaged_area VARCHAR(255),
    circumstances TEXT,
    informed_services VARCHAR(100),
    service VARCHAR(100),
    service_address VARCHAR(255),
    service_phone_email VARCHAR(100),
    light_conditions VARCHAR(100),
    road_conditions VARCHAR(100),
    other_damaged_vehicles BOOLEAN DEFAULT FALSE,
    damaged_vehicles_number VARCHAR(10),
    other_damages TEXT,
    other_vechicle_driver VARCHAR(100),
    diagram TEXT,
    owner_permision BOOLEAN DEFAULT FALSE,
    compensation_received BOOLEAN DEFAULT FALSE,
    substance_use BOOLEAN DEFAULT FALSE,
    preexisting_damage BOOLEAN DEFAULT FALSE,
    preexisting_damage_description TEXT,
    insurance_declaration BOOLEAN DEFAULT FALSE,
    signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
)

ALTER TABLE avizare_asirom
DROP CONSTRAINT IF EXISTS fk_avizare_asirom_client;

ALTER TABLE avizare_asirom
ADD CONSTRAINT fk_avizare_asirom_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS avizare_omniasig
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_birth_date VARCHAR(20),
    claimant_address VARCHAR(255),
    claimant_cnp VARCHAR(20),
    claimant_driver_license_category VARCHAR(10),
    claimant_driver_license_number VARCHAR(50),
    claimant_driver_license_expiration_date VARCHAR(20),
    claimant_driver_license_experience VARCHAR(20),
    claimant_phone VARCHAR(30),
    claimant_email VARCHAR(100),
    representative_name VARCHAR(100),
    representative_birth_date VARCHAR(20),
    representative_address VARCHAR(255),
    representative_cnp VARCHAR(20),
    representative_driver_license_category VARCHAR(10),
    representative_driver_license_number VARCHAR(50),
    representative_driver_license_expiration_date VARCHAR(20),
    representative_driver_license_experience VARCHAR(20),
    representative_phone VARCHAR(30),
    representative_email VARCHAR(100),
    representative_of VARCHAR(100),
    incident_location VARCHAR(255),
    incident_type VARCHAR(100),
    incident_date VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_registration_number VARCHAR(20),
    person_driving VARCHAR(100),
    person_driving_capacity VARCHAR(100),
    owner_damaged_vehicle VARCHAR(100),
    claim_number VARCHAR(50),
    claim_validity VARCHAR(50),
    responsible_party VARCHAR(100),
    bodily_injury BOOLEAN DEFAULT FALSE,
    injured_person_name_first VARCHAR(100),
    injured_person_name_second VARCHAR(100),
    damage TEXT,
    damaged_area VARCHAR(255),
    circumstances TEXT,
    informed_services VARCHAR(100),
    service VARCHAR(100),
    service_address VARCHAR(255),
    service_phone_email VARCHAR(100),
    light_conditions VARCHAR(100),
    road_conditions VARCHAR(100),
    other_damaged_vehicles BOOLEAN DEFAULT FALSE,
    damaged_vehicles_number VARCHAR(10),
    other_damages TEXT,
    other_vehicle_driver VARCHAR(100),
    diagram TEXT,
    owner_permission BOOLEAN DEFAULT FALSE,
    compensation_received BOOLEAN DEFAULT FALSE,
    substance_use BOOLEAN DEFAULT FALSE,
    preexisting_damage BOOLEAN DEFAULT FALSE,
    preexisting_damage_description TEXT,
    insurance_declaration BOOLEAN DEFAULT FALSE,
    signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
    )

ALTER TABLE avizare_omniasig
DROP CONSTRAINT IF EXISTS fk_avizare_omniasig_client;

ALTER TABLE avizare_omniasig
ADD CONSTRAINT fk_avizare_omniasig_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_generali
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_cnp VARCHAR(20),
    claimant_address VARCHAR(255),
    claimant_correspondence_address VARCHAR(255),
    claimant_phone VARCHAR(30),
    claimant_email VARCHAR(100),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_registration_number VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_owner VARCHAR(100),
    incident_location VARCHAR(255),
    incident_street VARCHAR(255),
    incident_direction_from VARCHAR(255),
    incident_direction_to VARCHAR(255),
    incident_description TEXT,
    incident_damages TEXT,
    other_vehicle_details TEXT,
    other_vehicles_registration_numbers TEXT,
    diagram_before TEXT,
    diagram_at_time_of_incident TEXT,
    diagram_after TEXT,
    claim_date VARCHAR(20),
    date VARCHAR(20),
    signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
)

ALTER TABLE avizare_generali
DROP CONSTRAINT IF EXISTS fk_avizare_generali_client;

ALTER TABLE avizare_generali
ADD CONSTRAINT fk_avizare_generali_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_axeria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claim_number VARCHAR(50),
    existing_damage VARCHAR(1000),
    inspection_date VARCHAR(20),
    vehicle_repair_authorisation_document VARCHAR(255),
    claims_inspection_signature VARCHAR(255),
    claimant_signature VARCHAR(255),
    fault_determination VARCHAR(500),
    claimant_name VARCHAR(120),
    claimant_father_name VARCHAR(120),
    claimant_mother_name VARCHAR(120),
    claimant_birth_date VARCHAR(20),
    claimant_birth_place VARCHAR(120),
    claimant_citizenship VARCHAR(60),
    claimant_address VARCHAR(255),
    claimant_cnp VARCHAR(13),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_id_issued_by VARCHAR(120),
    claimant_license_category VARCHAR(10),
    claimant_license_number VARCHAR(30),
    claimant_license_issued_by VARCHAR(120),
    claimant_license_issued_date VARCHAR(20),
    claimant_license_experience VARCHAR(20),
    claimant_profession VARCHAR(120),
    claimant_employer VARCHAR(150),
    claimant_employer_address VARCHAR(255),
    claimant_employer_phone VARCHAR(30),
    claimant_employer_email VARCHAR(150),
    claimant_policy_series VARCHAR(20),
    claimant_policy_number VARCHAR(50),
    claimant_policy_start_date VARCHAR(20),
    claimant_policy_end_date VARCHAR(20),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_registration_number VARCHAR(15),
    vehicle_make VARCHAR(80),
    vehicle_model VARCHAR(80),
    vehicle_color VARCHAR(40),
    vehicle_vin VARCHAR(17),
    vehicle_owner VARCHAR(120),
    vehicle_owner_cnp VARCHAR(13),
    incident_location VARCHAR(255),
    incident_county VARCHAR(80),
    incident_street VARCHAR(150),
    incident_direction_from VARCHAR(120),
    incident_direction_to VARCHAR(120),
    incident_place VARCHAR(120),
    incident_km VARCHAR(20),
    incident_intersection VARCHAR(120),
    incident_outside_of VARCHAR(120),
    incident_highway VARCHAR(120),
    incident_damages VARCHAR(1000),
    incident_deceased BOOLEAN,
    incident_other_damages BOOLEAN,
    incident_deceased_name VARCHAR(120),
    casco_number VARCHAR(50),
    casco_company VARCHAR(120),
    casco_validity_start_date VARCHAR(20),
    casco_validity_end_date VARCHAR(20),
    light_conditions VARCHAR(60),
    road_conditions VARCHAR(60),
    weather_conditions VARCHAR(60),
    road_surface_type VARCHAR(60),
    vehicle_category VARCHAR(40),
    vehicle_speed VARCHAR(20),
    vehicle_break_mark VARCHAR(20),
    damage_area VARCHAR(500),
    other_vehicle_damage_area VARCHAR(500),
    diagram_before VARCHAR(255),
    diagram_at_time_of_incident VARCHAR(255),
    diagram_after VARCHAR(255),
    other_victim_name VARCHAR(120),
    other_victim_address VARCHAR(255),
    other_victim_property VARCHAR(255),
    authorities_document_series VARCHAR(20),
    authorities_document_number VARCHAR(40),
    repair_authorisation_series VARCHAR(20),
    repair_authorisation_number VARCHAR(40),
    repair_authorisation_date VARCHAR(20),
    incident_responsible_name VARCHAR(120),
    incident_responsible_address VARCHAR(255),
    incident_responsible_phone VARCHAR(30),
    incident_responsible_email VARCHAR(150),
    incident_responsible_vehicle_registration_number VARCHAR(15),
    incident_responsible_vehicle_make VARCHAR(80),
    incident_responsible_vehicle_model VARCHAR(80),
    incident_responsible_vehicle_color VARCHAR(40),
    incident_responsible_rca VARCHAR(120),
    incident_responsible_rca_series VARCHAR(20),
    incident_responsible_rca_number VARCHAR(50),
    incident_responsible_rca_validity_start_date VARCHAR(20),
    incident_responsible_rca_validity_end_date VARCHAR(20),
    claim_date VARCHAR(20),
    signature VARCHAR(255),
    created_at VARCHAR(40)
)

ALTER TABLE avizare_axeria
DROP CONSTRAINT IF EXISTS fk_avizare_axeria_client;

ALTER TABLE avizare_axeria
ADD CONSTRAINT fk_avizare_axeria_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_dallbog(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    existing_damaged_vehicle VARCHAR(500),
    claim_date VARCHAR(20),
    claim_time VARCHAR(10),
    claim_series VARCHAR(20),
    claim_number VARCHAR(50),
    claim_inspector_signature VARCHAR(255),
    claimant_signature VARCHAR(255),
    claimant_name VARCHAR(120),
    claimant_father_name VARCHAR(120),
    claimant_mother_name VARCHAR(120),
    claimant_birth_date VARCHAR(20),
    claimant_birth_place VARCHAR(120),
    claimant_citizenship VARCHAR(60),
    claimant_address VARCHAR(255),
    claimant_cnp VARCHAR(13),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_license_category VARCHAR(10),
    claimant_license_number VARCHAR(30),
    claimant_license_issued_by VARCHAR(120),
    claimant_license_issued_date VARCHAR(20),
    claimant_license_experience VARCHAR(20),
    claimant_profession VARCHAR(120),
    claimant_employer VARCHAR(150),
    claimant_employer_phone VARCHAR(30),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_state VARCHAR(50),
    vehicle_registration_number VARCHAR(15),
    vehicle_make_model VARCHAR(120),
    vehicle_color VARCHAR(40),
    vehicle_owner VARCHAR(120),
    incident_location VARCHAR(255),
    incident_street VARCHAR(150),
    incident_direction_from VARCHAR(120),
    incident_direction_to VARCHAR(120),
    incident_place VARCHAR(120),
    incident_intersection VARCHAR(120),
    incident_outside_of VARCHAR(120),
    incident_highway VARCHAR(120),
    vehicle_damages VARCHAR(1000),
    existing_casco BOOLEAN,
    casco_company VARCHAR(120),
    casco_validity_end_date VARCHAR(20),
    light_conditions VARCHAR(60),
    road_conditions VARCHAR(60),
    vehicle_category VARCHAR(40),
    past_damages VARCHAR(500),
    diagram VARCHAR(255),
    signature VARCHAR(255)
)

ALTER TABLE avizare_dallbog
DROP CONSTRAINT IF EXISTS fk_avizare_dallbog_client;

ALTER TABLE avizare_dallbog
ADD CONSTRAINT fk_avizare_dallbog_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_eazy(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claimant_name VARCHAR(120),
    claimant_father_name VARCHAR(120),
    claimant_mother_name VARCHAR(120),
    claimant_birth_date VARCHAR(20),
    claimant_birth_place VARCHAR(120),
    claimant_address VARCHAR(255),
    claimant_cnp VARCHAR(13),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_id_issued_by VARCHAR(120),
    claimant_phone VARCHAR(30),
    claimant_email VARCHAR(150),
    other_victims BOOLEAN,
    other_damages BOOLEAN,
    other_damages_description VARCHAR(500),
    incident_date VARCHAR(20),
    incident_location VARCHAR(255),
    incident_time VARCHAR(10),
    vehicle_state VARCHAR(50),
    incident_street VARCHAR(150),
    incident_notes VARCHAR(1000),
    diagram_before VARCHAR(255),
    diagram_at_time_of_incident VARCHAR(255),
    diagram_after VARCHAR(255),
    vehicle_diagram VARCHAR(255),
    vehicle_diagram_description VARCHAR(500),
    other_vehicle_diagram VARCHAR(255),
    other_vehicle_diagram_description VARCHAR(500),
    police_section VARCHAR(120),
    police_report_series VARCHAR(20),
    police_report_number VARCHAR(40),
    repair_authorisation_series VARCHAR(20),
    repair_authorisation_number VARCHAR(40),
    police_presence VARCHAR(10),
    ambulance_presence VARCHAR(10),
    towing_used BOOLEAN,
    towing_contact_person VARCHAR(120),
    towing_company VARCHAR(120),
    towing_cost VARCHAR(30),
    photo_video BOOLEAN,
    relationship_with_involved_party BOOLEAN,
    related_person_name VARCHAR(120),
    relationship_type VARCHAR(80),
    at_fault_person_name VARCHAR(120),
    at_fault_person_address VARCHAR(255),
    at_fault_person_phone VARCHAR(30),
    at_fault_person_email VARCHAR(150),
    at_fault_vehicle_registration_number VARCHAR(15),
    other_details VARCHAR(1000),S
    claim_date VARCHAR(20),
    signature VARCHAR(255)
)

ALTER TABLE avizare_eazy
DROP CONSTRAINT IF EXISTS fk_avizare_eazy_client;

ALTER TABLE avizare_eazy
ADD CONSTRAINT fk_avizare_eazy_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_grawe(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    existing_damages VARCHAR(255),
    presentation_date VARCHAR(20),
    presentation_time VARCHAR(10),
    inspector_signature VARCHAR(255),
    claimant_signature VARCHAR(255),
    claimant_name VARCHAR(120),
    claimant_cnp VARCHAR(13),
    claimant_phone VARCHAR(30),
    claimant_landline VARCHAR(30),
    claimant_email VARCHAR(150),
    claimant_birthplace VARCHAR(120),
    claimant_citizenship VARCHAR(60),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_id_issued_by VARCHAR(120),
    claimant_address VARCHAR(255),
    claimant_license_category VARCHAR(10),
    claimant_license_number VARCHAR(30),
    claimant_license_issued_by VARCHAR(120),
    claimant_license_issued_date VARCHAR(20),
    claimant_license_experience VARCHAR(20),
    claimant_profession VARCHAR(120),
    claimant_employer VARCHAR(150),
    claimant_employer_address VARCHAR(255),
    claimant_declaration VARCHAR(255),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_registration_number VARCHAR(15),
    vehicle_make VARCHAR(80),
    vehicle_color VARCHAR(40),
    vehicle_owner VARCHAR(120),
    incident_location VARCHAR(255),
    incident_street VARCHAR(150),
    incident_direction_from VARCHAR(120),
    incident_direction_to VARCHAR(120),
    incident_place VARCHAR(120),
    incident_intersection VARCHAR(120),
    incident_outside_of VARCHAR(120),
    incident_highway VARCHAR(120),
    vehicle_damages VARCHAR(255),
    substance_use BOOLEAN,
    other_damages BOOLEAN,
    other_damages_description VARCHAR(255),
    police_investigation BOOLEAN,
    existing_report BOOLEAN,
    police_section VARCHAR(120),
    theft_date VARCHAR(20),
    theft_report_proof_number VARCHAR(50),
    theft_report_date VARCHAR(20),
    claim_date VARCHAR(20),
    signature VARCHAR(255),
    existing_rca BOOLEAN,
    existing_rca_number VARCHAR(50),
    existing_casco BOOLEAN,
    existing_casco_number VARCHAR(50),
    at_fault_person_name VARCHAR(120),
    at_fault_vehicle_make VARCHAR(80),
    at_fault_vehicle_model VARCHAR(80),
    at_fault_insurance_company VARCHAR(120),
    at_fault_insurance_policty_series VARCHAR(20),
    at_fault_insurance_policy_number VARCHAR(50),
    at_fault_insurance_policy_start_date VARCHAR(20),
    at_fault_insurance_policy_end_date VARCHAR(20),
    lighting_conditions VARCHAR(60),
    road_conditions VARCHAR(60),
    weather_conditions VARCHAR(60),
    road_surface_type VARCHAR(60),
    vehicle_category VARCHAR(40),
    diagram VARCHAR(255),
    other_optional_insurance BOOLEAN,
    claimed_compensation_other_insurer BOOLEAN,
    received_compensation_other_insurer BOOLEAN,
    other_policy_number VARCHAR(50),
    other_insurance_company VARCHAR(120),
    other_policy_valid_from VARCHAR(20),
    other_policy_valid_to VARCHAR(20),
    repair_authorisation_series VARCHAR(20),
    repair_authorisation_number VARCHAR(40)
)

ALTER TABLE avizare_grawe
DROP CONSTRAINT IF EXISTS fk_avizare_grawe_client;

ALTER TABLE avizare_grawe
ADD CONSTRAINT fk_avizare_grawe_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_groupama (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    claimant_name VARCHAR(120),
    claimant_cnp VARCHAR(13),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_phone VARCHAR(30),
    claimant_email VARCHAR(150),
    incident_type VARCHAR(50),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_state VARCHAR(50),
    vehicle_make VARCHAR(80),
    vehicle_model VARCHAR(80),
    vehicle_registration_number VARCHAR(15),
    vehicle_owner VARCHAR(120),
    casco_number VARCHAR(50),
    rca_number VARCHAR(50),
    rca_date VARCHAR(20),
    trailer_make VARCHAR(80),
    trailer_type VARCHAR(50),
    trailer_registration_number VARCHAR(15),
    trailer_owner VARCHAR(120),
    trailer_casco VARCHAR(50),
    trailer_rca VARCHAR(50),
    incident_city VARCHAR(100),
    incident_county VARCHAR(80),
    incident_street VARCHAR(150),
    incident_building VARCHAR(50),
    incident_km VARCHAR(20),
    incident_direction_from VARCHAR(120),
    incident_direction_to VARCHAR(120),
    incident_description VARCHAR(1000),
    incident_damages VARCHAR(1000),
    incident_other_damages BOOLEAN,
    incident_other_damages_description VARCHAR(500),
    police_investigation BOOLEAN,
    contravention_report_issued BOOLEAN,
    diagram VARCHAR(255),
    at_fault_vehicle_rca_series VARCHAR(20),
    at_fault_vehicle_rca_number VARCHAR(50),
    at_fault_vehicle_rca_insurer VARCHAR(120),
    at_fault_vehicle_optional_insurance BOOLEAN,
    agree_pre_reparir_payment BOOLEAN,
    claim_date VARCHAR(20),
    signature VARCHAR(255)
)

ALTER TABLE avizare_groupama
DROP CONSTRAINT IF EXISTS fk_avizare_groupama_client;

ALTER TABLE avizare_groupama
ADD CONSTRAINT fk_avizare_groupama_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS avizare_hellas_direct (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    existing_damages VARCHAR(255),
    presentation_date VARCHAR(20),
    presentation_time VARCHAR(10),
    inspector_signature VARCHAR(255),
    claimant_signature VARCHAR(255),
    claimant_name VARCHAR(120),
    claimant_cnp VARCHAR(13),
    claimant_phone VARCHAR(30),
    claimant_landline VARCHAR(30),
    claimant_email VARCHAR(150),
    claimant_birthplace VARCHAR(120),
    claimant_citizenship VARCHAR(60),
    claimant_id_series VARCHAR(10),
    claimant_id_number VARCHAR(20),
    claimant_id_issued_by VARCHAR(120),
    claimant_address VARCHAR(255),
    claimant_license_category VARCHAR(10),
    claimant_license_number VARCHAR(30),
    claimant_license_issued_by VARCHAR(120),
    claimant_license_issued_date VARCHAR(20),
    claimant_license_experience VARCHAR(20),
    claimant_profession VARCHAR(120),
    claimant_employer VARCHAR(150),
    claimant_employer_address VARCHAR(255),
    claimant_declaration VARCHAR(255),
    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    vehicle_registration_number VARCHAR(15),
    vehicle_make VARCHAR(80),
    vehicle_color VARCHAR(40),
    vehicle_owner VARCHAR(120),
    incident_location VARCHAR(255),
    incident_street VARCHAR(150),
    incident_direction_from VARCHAR(120),
    incident_direction_to VARCHAR(120),
    incident_place VARCHAR(120),
    incident_intersection VARCHAR(120),
    incident_outside_of VARCHAR(120),
    incident_highway VARCHAR(120),
    vehicle_damages VARCHAR(255),
    substance_use BOOLEAN,
    other_damages BOOLEAN,
    other_damages_description VARCHAR(255),
    police_investigation BOOLEAN,
    existing_report BOOLEAN,
    police_section VARCHAR(120),
    theft_date VARCHAR(20),
    theft_report_proof_number VARCHAR(50),
    theft_report_date VARCHAR(20),
    claim_date VARCHAR(20),
    signature VARCHAR(255),
    existing_rca BOOLEAN,
    existing_rca_number VARCHAR(50),
    at_fault_person_name VARCHAR(120),
    at_fault_vehicle_make VARCHAR(80),
    at_fault_vehicle_model VARCHAR(80),
    at_fault_insurance_company VARCHAR(120),
    at_fault_insurance_policty_series VARCHAR(20),
    at_fault_insurance_policy_number VARCHAR(50),
    at_fault_insurance_policy_start_date VARCHAR(20),
    at_fault_insurance_policy_end_date VARCHAR(20),
    lighting_conditions VARCHAR(60),
    road_conditions VARCHAR(60),
    weather_conditions VARCHAR(60),
    road_surface_type VARCHAR(60),
    vehicle_category VARCHAR(40),
    diagram VARCHAR(255),
    other_optional_insurance BOOLEAN,
    claimed_compensation_other_insurer BOOLEAN,
    received_compensation_other_insurer BOOLEAN,
    other_policy_number VARCHAR(50),
    other_insurance_company VARCHAR(120),
    other_policy_valid_from VARCHAR(20),
    other_policy_valid_to VARCHAR(20),
    repair_authorisation_series VARCHAR(20),
    repair_authorisation_number VARCHAR(40),
    created_at VARCHAR(40)
)

ALTER TABLE avizare_hellas_direct
DROP CONSTRAINT IF EXISTS fk_avizare_hellas_direct_client;

ALTER TABLE avizare_hellas_direct
ADD CONSTRAINT fk_avizare_hellas_direct_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS contract_mandat (
    id VARCHAR(50) PRIMARY KEY,
    client_id VARCHAR(50),
    principal_name VARCHAR(120),
    principal_address VARCHAR(255),
    principal_cnp VARCHAR(13),
    principal_id_series VARCHAR(10),
    principal_id_number VARCHAR(20),
    agent_name VARCHAR(120),
    agent_address VARCHAR(255),
    agent_cnp VARCHAR(13),
    agent_id_series VARCHAR(10),
    agent_id_number VARCHAR(20),
    agent_id_issued_by VARCHAR(120),
    vehicle_make VARCHAR(80),
    vehicle_model VARCHAR(80),
    vehicle_registration_number VARCHAR(15),
    vehicle_vin VARCHAR(17),
    incident_date VARCHAR(20),
    contract_date VARCHAR(20),
    principal_signature VARCHAR(255),
    agent_signature VARCHAR(255),
    created_at VARCHAR(40)
)

ALTER TABLE contract_mandat
DROP CONSTRAINT IF EXISTS fk_contract_mandat_client;

ALTER TABLE contract_mandat
ADD CONSTRAINT fk_contract_mandat_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS imputernicire(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_id VARCHAR(255),
    authorization_number VARCHAR(255),
    authorization_date VARCHAR(255),
    company_name VARCHAR(255),
    company_registered_address VARCHAR(255),
    company_trage_register_number VARCHAR(255),
    company_cui VARCHAR(255),
    company_representative_name VARCHAR(255),
    company_representative_role VARCHAR(255),
    agent_name VARCHAR(255),
    agent_address VARCHAR(255),
    agent_cnp VARCHAR(255),
    agent_id_series VARCHAR(255),
    agent_id_number VARCHAR(255),
    agent_id_issued_by VARCHAR(255),
    incident_date VARCHAR(255),
    vehicle_make VARCHAR(255),
    vehicle_model VARCHAR(255),
    vehicle_vin VARCHAR(255),
    vehicle_registration_number VARCHAR(255),
    principal_signature VARCHAR(255)
)

ALTER TABLE imputernicire
DROP CONSTRAINT IF EXISTS fk_imputernicire_client;

ALTER TABLE imputernicire
ADD CONSTRAINT fk_imputernicire_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_asirom(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    signature VARCHAR(255),
    created_at VARCHAR(40)
)

ALTER TABLE gdpr_asirom
DROP CONSTRAINT IF EXISTS fk_gdpr_asirom_client;

ALTER TABLE gdpr_asirom
ADD CONSTRAINT fk_gdpr_asirom_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_axeria(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    client_id_series VARCHAR(5),
    client_id_number VARCHAR(20),
    signature VARCHAR(255),
    created_at VARCHAR(40)
    )

ALTER TABLE gdpr_axeria
DROP CONSTRAINT IF EXISTS fk_gdpr_axeria_client;

ALTER TABLE gdpr_axeria
ADD CONSTRAINT fk_gdpr_axeria_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_grawe(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    signature VARCHAR(255),
    created_at VARCHAR(40)
    )

ALTER TABLE gdpr_grawe
DROP CONSTRAINT IF EXISTS fk_gdpr_grawe_client;

ALTER TABLE gdpr_grawe
ADD CONSTRAINT fk_gdpr_grawe_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_groupama(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    capacity VARCHAR(100),
    signature VARCHAR(255),
    created_at VARCHAR(40)
    )

ALTER TABLE gdpr_groupama
DROP CONSTRAINT IF EXISTS fk_gdpr_groupama_client;

ALTER TABLE gdpr_groupama
ADD CONSTRAINT fk_gdpr_groupama_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_hellas_direct(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    signature VARCHAR(255),
    gdpr_date VARCHAR(15),
    created_at VARCHAR(40)
    )

ALTER TABLE gdpr_hellas_direct
DROP CONSTRAINT IF EXISTS fk_gdpr_hellas_direct_client;

ALTER TABLE gdpr_hellas_direct
ADD CONSTRAINT fk_gdpr_hellas_direct_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS gdpr_generali(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    client_name VARCHAR(50),
    signature VARCHAR(255),
    created_at VARCHAR(40)
    )

ALTER TABLE gdpr_generali
DROP CONSTRAINT IF EXISTS fk_gdpr_generali_client;

ALTER TABLE gdpr_generali
ADD CONSTRAINT fk_gdpr_generali_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;