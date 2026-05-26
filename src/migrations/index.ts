import * as migration_20260519_133146 from './20260519_133146';
import * as migration_20260520_050509__ from './20260520_050509__';
import * as migration_20260519_180000_rbac_users from './20260519_180000_rbac_users';
import * as migration_20260519_190000_audit_fields from './20260519_190000_audit_fields';

import * as migration_20260519_200000_audit_logs from './20260519_200000_audit_logs';
import * as migration_20260520_090500_users_api_key from './20260520_090500_users_api_key';
import * as migration_20260520_120000_rbac_v2 from './20260520_120000_rbac_v2';
import * as migration_20260519_160000_chapter_show_flags from './20260519_160000_chapter_show_flags';
import * as migration_20260522_100000_article_author_display_name from './20260522_100000_article_author_display_name';

export const migrations = [
  {
    up: migration_20260519_133146.up,
    down: migration_20260519_133146.down,
    name: '20260519_133146',
  },
  {
    up: migration_20260520_050509__.up,
    down: migration_20260520_050509__.down,
    name: '20260520_050509__'
  },
  {
    up: migration_20260519_180000_rbac_users.up,
    down: migration_20260519_180000_rbac_users.down,
    name: '20260519_180000_rbac_users',
  },
  {
    up: migration_20260519_190000_audit_fields.up,
    down: migration_20260519_190000_audit_fields.down,
    name: '20260519_190000_audit_fields',
  },
  {
    up: migration_20260519_200000_audit_logs.up,
    down: migration_20260519_200000_audit_logs.down,
    name: '20260519_200000_audit_logs',
  },
  {
    up: migration_20260520_090500_users_api_key.up,
    down: migration_20260520_090500_users_api_key.down,
    name: '20260520_090500_users_api_key',
  },
  {
    up: migration_20260520_120000_rbac_v2.up,
    down: migration_20260520_120000_rbac_v2.down,
    name: '20260520_120000_rbac_v2',
  },
  {
    up: migration_20260519_160000_chapter_show_flags.up,
    down: migration_20260519_160000_chapter_show_flags.down,
    name: '20260519_160000_chapter_show_flags',
  },
  {
    up: migration_20260522_100000_article_author_display_name.up,
    down: migration_20260522_100000_article_author_display_name.down,
    name: '20260522_100000_article_author_display_name',
  },
];
