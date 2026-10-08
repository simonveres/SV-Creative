# SV-Creative CMS Database

PostgreSQL schema for the future SV-Creative CMS. This phase defines the database only; it does not add API routes, authentication, admin pages, or public-site integration.

## Requirements

- PostgreSQL 13 or newer (`gen_random_uuid()` is built in).
- Apply `schema.sql` to a new, empty database. The file intentionally has no seed content or default administrator.
- Store image files in object storage. PostgreSQL stores their metadata and storage references, never image binaries.

## Tables

| Table | Purpose |
| --- | --- |
| `admin_users` | Admin/editor identity, password hash, role, and account status. |
| `services` | Service slug, optional price/image, publication status, and display order. |
| `service_translations` | Localized service title and descriptions. |
| `portfolio_items` | Portfolio slug, category, optional image/project URL, status, and display order. |
| `portfolio_translations` | Localized portfolio title and description. |
| `clients` | Client name, optional logo/website/description, status, and display order. |
| `case_studies` | Case-study slug, optional image/project URL, status, and display order. |
| `case_study_translations` | Localized case-study title and description. |
| `gallery_items` | Gallery title, category, optional image/description, status, and display order. |
| `blog_posts` | Blog slug, optional thumbnail, publication status, and publication timestamp. |
| `blog_post_translations` | Localized blog title, excerpt, and content. |
| `faqs` | FAQ publication status and display order. |
| `faq_translations` | Localized FAQ question and answer. |
| `about_sections` | Stable section key, optional image, publication status, and display order. |
| `about_translations` | Localized about-section title and description. |
| `site_settings` | Key/value site settings stored as JSONB. |
| `media_assets` | File metadata, object-storage key, URL, MIME type, size, and alt text. |

All entity IDs use UUIDs. Translation rows have one row per entity and language, enforced by a unique constraint. Their foreign keys cascade when their parent entity is deleted. Image references point to `media_assets`; deleting an asset sets those references to `NULL` instead of deleting the related content.

## Status and Ordering

Content tables use `draft`, `published`, or `unpublished`. New content defaults to `unpublished` (blog posts default to `draft`). Public queries should explicitly select `status = 'published'`. Admin accounts use `active` or `disabled`; roles are `admin` or `editor`. `sort_order` is a non-negative integer, with lower values intended to appear first. Database triggers maintain `updated_at` on updates.

## Languages

`language_code` accepts flexible language tags such as `id`, `en`, `zh-CN`, `ja`, `ko`, `es`, `fr`, `de`, `ar`, and `pt`. The existing site selector uses `zh` while its Chinese dictionary key is `zh-CN`; the future API should normalize or consistently map that value. This schema does not alter `assets/js/main.js`.

## Site Settings

`site_settings.setting_key` is the key and `setting_value` is JSONB so values may be strings, arrays, objects, or structured hours. Suggested keys include:

- `whatsapp`
- `email`
- `instagram`
- `address`
- `business_hours`
- `website_name`
- `website_description`

No real settings are seeded. Add further keys without a schema migration unless a setting needs relational constraints or querying of its own.

## Credentials and Deployment

The schema contains no database credentials or administrator password. Configure database connection values as environment variables in the local runtime and Vercel project settings, for example `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`. Never commit their values. Do not create a committed `.env`; the repository's ignore rules must be updated to exclude local secret files before introducing one. Prefer the managed provider's TLS-enabled connection settings in deployment.

`admin_users.password_hash` is required and has no default. A future authentication implementation must generate hashes with a secure password-hashing API such as PHP `password_hash()` and verify them with `password_verify()`; plaintext passwords must never be stored.

## Apply and Validate

Use a PostgreSQL client with credentials supplied through the environment or a secure connection string. For example:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/schema.sql
```

The schema is intended for a new database, not as an in-place migration. Back up any existing database before applying future migrations. Syntax validation can also be run without applying the schema using a PostgreSQL parser/tool; actual application should be tested against the chosen managed PostgreSQL provider before deployment.
