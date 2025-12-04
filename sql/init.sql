CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clients 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,

    country TEXT NOT NULL,
    serie TEXT NOT NULL,
    number TEXT NOT NULL,
    nationality TEXT NOT NULL,
    cnp TEXT NOT NULL,
    birth_place TEXT NOT NULL,
    address TEXT NOT NULL,
    issued_by TEXT NOT NULL,
    validity TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
)