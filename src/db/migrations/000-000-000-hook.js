
exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP OWNED BY hook_super_admin;
DROP ROLE IF EXISTS hook_super_admin;
--||--
DROP OWNED BY hook_anonymous;
DROP ROLE IF EXISTS hook_anonymous;
--||--
DROP OWNED BY hook_user;
DROP ROLE IF EXISTS hook_user;
--||--
DROP SCHEMA IF EXISTS hook CASCADE;
`

const upScript = `
CREATE ROLE hook_super_admin login password 'secret';
--||--
CREATE ROLE hook_anonymous;
GRANT hook_anonymous TO hook_super_admin;
--||--
CREATE ROLE hook_user;
GRANT hook_user TO hook_super_admin;
--||--
CREATE SCHEMA hook;
GRANT USAGE ON SCHEMA hook TO hook_anonymous, hook_user;
--||--
SET search_path TO hook, public;
--||--
CREATE TABLE hook.email_info (
  id serial NOT NULL,
  from_address text NOT NULL,
  to_address text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  CONSTRAINT pk_email PRIMARY KEY (id)
);
--||--
GRANT SELECT, UPDATE, DELETE ON TABLE hook.email_info TO hook_user;
--||--
CREATE FUNCTION hook.send_email(
  _from_address text,
  _to_address text,
  _subject text,
  _body text
) returns hook.email_info as $$
DECLARE
  _retval hook.email_info;
BEGIN
  INSERT INTO hook.email_info(
    from_address,
    to_address,
    subject,
    body
  )
  SELECT
    _from_address,
    _to_address,
    _subject,
    _body
  RETURNING *
  INTO _retval;
      
  RETURN _retval;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
--||--
GRANT EXECUTE ON FUNCTION hook.send_email(text, text, text, text) TO hook_anonymous;
`
