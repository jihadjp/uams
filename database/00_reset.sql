-- ============================================================
-- UAMS — DBMS Lab Project
-- File 00: Reset — drop & recreate the database (optional but
-- RECOMMENDED). This guarantees the lab schema below is the one
-- being used, and eliminates every "old layout" error at once:
--   ERROR 1364 "Field 'x' doesn't have a default value"
--   ERROR 1054 "Unknown column 'term' in 'field list'"
--   ERROR 1265 "Data truncated for column 'target_role'"
--
-- ⚠ WARNING: this DELETES everything in the `uams` database,
-- including data added through the Spring Boot app. The app
-- recreates its own tables automatically on next start
-- (spring.jpa.hibernate.ddl-auto=update).
-- ============================================================

DROP DATABASE IF EXISTS uams;
CREATE DATABASE uams
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;