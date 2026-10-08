-- SV-Creative CMS schema
-- Requires PostgreSQL 13+ (gen_random_uuid() is built in).
-- Apply to a new database; credentials and seed accounts are intentionally omitted.

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size >= 0),
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL CHECK (length(password_hash) > 0),
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    status TEXT NOT NULL DEFAULT 'disabled' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX admin_users_email_lower_uq ON admin_users (lower(email));

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    image UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    price NUMERIC(12, 2) CHECK (price IS NULL OR price >= 0),
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (service_id, language_code)
);

CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    category TEXT NOT NULL,
    image UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    project_url TEXT,
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolio_items (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (portfolio_id, language_code)
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    website_url TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    image UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    project_url TEXT,
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE case_study_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_study_id UUID NOT NULL REFERENCES case_studies (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (case_study_id, language_code)
);

CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    thumbnail UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_post_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID NOT NULL REFERENCES blog_posts (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (blog_post_id, language_code)
);

CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faq_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID NOT NULL REFERENCES faqs (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (faq_id, language_code)
);

CREATE TABLE about_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE CHECK (section_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'),
    image UUID REFERENCES media_assets (id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'unpublished' CHECK (status IN ('draft', 'published', 'unpublished')),
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE about_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    about_section_id UUID NOT NULL REFERENCES about_sections (id) ON DELETE CASCADE,
    language_code VARCHAR(35) NOT NULL CHECK (language_code ~ '^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (about_section_id, language_code)
);

CREATE TABLE site_settings (
    setting_key TEXT PRIMARY KEY CHECK (setting_key ~ '^[a-z][a-z0-9_.-]*$'),
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Child rows are deleted with their parent; media deletion preserves content records.
CREATE INDEX services_image_idx ON services (image);
CREATE INDEX services_status_sort_idx ON services (status, sort_order);
CREATE INDEX portfolio_items_image_idx ON portfolio_items (image);
CREATE INDEX portfolio_items_status_sort_idx ON portfolio_items (status, sort_order);
CREATE INDEX clients_logo_idx ON clients (logo);
CREATE INDEX clients_status_sort_idx ON clients (status, sort_order);
CREATE INDEX case_studies_image_idx ON case_studies (image);
CREATE INDEX case_studies_status_sort_idx ON case_studies (status, sort_order);
CREATE INDEX gallery_items_image_idx ON gallery_items (image);
CREATE INDEX gallery_items_status_sort_idx ON gallery_items (status, sort_order);
CREATE INDEX blog_posts_thumbnail_idx ON blog_posts (thumbnail);
CREATE INDEX blog_posts_status_idx ON blog_posts (status);
CREATE INDEX blog_posts_published_at_idx ON blog_posts (published_at DESC) WHERE status = 'published';
CREATE INDEX faqs_status_sort_idx ON faqs (status, sort_order);
CREATE INDEX about_sections_image_idx ON about_sections (image);
CREATE INDEX about_sections_status_sort_idx ON about_sections (status, sort_order);

CREATE FUNCTION set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER media_assets_set_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER admin_users_set_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER service_translations_set_updated_at BEFORE UPDATE ON service_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER portfolio_items_set_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER portfolio_translations_set_updated_at BEFORE UPDATE ON portfolio_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER clients_set_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER case_studies_set_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER case_study_translations_set_updated_at BEFORE UPDATE ON case_study_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER gallery_items_set_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blog_post_translations_set_updated_at BEFORE UPDATE ON blog_post_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER faqs_set_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER faq_translations_set_updated_at BEFORE UPDATE ON faq_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER about_sections_set_updated_at BEFORE UPDATE ON about_sections FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER about_translations_set_updated_at BEFORE UPDATE ON about_translations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
