-- Auto-generated from lingxia_home/docs/FAQ.md
-- Requires Payload PR-3 schema: faq_items + faq_items_locales + sites.slug = 'lingxia'
-- Usage: psql "$DATABASE_URI" -f deploy/sql/seed-faq.sql

BEGIN;

DELETE FROM faq_items_locales
WHERE _parent_id IN (
  SELECT f.id FROM faq_items f
  INNER JOIN sites s ON s.id = f.site_id
  WHERE s.slug = 'lingxia'
);

DELETE FROM faq_items
WHERE site_id IN (SELECT id FROM sites WHERE slug = 'lingxia');

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 10, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '灵虾是什么？', '灵虾是一款 AI 驱动的人生解释与精神陪伴产品。它不是简单给你一个“准不准”的答案，而是调用多种玄学、心理与灵性解释体系，帮助你理解情绪、看清关系、梳理人生阶段，并在迷茫时获得陪伴和方向感。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 20, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '灵虾和普通算命产品有什么不同？', '普通算命产品通常只给出单次结果，而灵虾更强调持续陪伴和个性化互动。你可以和不同角色对话，在日常问题、情绪困扰或人生选择中，获得更温柔、更贴近当下状态的指引。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 30, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '我可以向灵虾问什么问题？', '你可以向灵虾询问感情关系、事业方向、每日运势、和生活决策等问题。比如“他还在意我吗？”“我适合换工作吗？”“今天适合做什么决定？”灵虾会根据你的问题，匹配合适的玄学体系和互动角色。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 40, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '灵虾支持哪些玄学体系？', '灵虾不是简单堆叠玄学内容，而是把不同解释体系整理成300+能力系统，为不同问题提供更丰富的解读方式。包括未来趋势、身份认同、关系解释、精神安慰、人格投射和仪式陪伴。对应的内容可能包括八字、紫微、塔罗、占星、MBTI、梦境解析、今日运势、幸运数字、日签和灵性内容等。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 50, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '七个灵性角色有什么作用？', '灵虾中的不同角色拥有不同性格和擅长方向。例如，有的角色更适合感情关系，有的适合事业财富，有的适合八字流年，有的适合情绪陪伴和每日提醒。用户可以根据自己的问题选择更合适的陪伴方式。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 60, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '灵虾会自动帮我选择合适的解释方式吗？', '会。灵虾的核心思路是：用户不需要先懂体系，产品会先理解你正在经历什么，再选择更合适的解释方式。比如同样是感情问题，有时更适合用塔罗做情绪共鸣，有时更适合用占星解释关系模式，有时则适合用八字或阶段分析来理解长期课题。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 70, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '灵虾的结果是绝对准确的吗？', '灵虾提供的是基于 AI 与玄学体系生成的参考建议，不代表绝对结果，也不应该替代现实中的重要判断。它更适合作为一种自我理解、情绪梳理和生活参考工具，帮助你从不同角度看待问题。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 80, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '我可以把灵虾当作每日情绪陪伴工具吗？', '可以。灵虾不仅适合深度问题，也适合日常轻量使用。例如：灵虾不仅提供玄学解读，也关注用户的情绪状态。当你感到迷茫、焦虑或想找人倾诉时，灵虾可以用温柔的文字陪你理清思绪，让你获得一点安定感。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, 90, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT '我的聊天内容会被公开吗？', '不会。用户的聊天内容不会被公开展示。灵虾会重视用户的隐私与使用体验，具体数据使用方式应以产品正式隐私政策为准。', 'zh-Hans'::"_locales", inserted.id
FROM inserted;

COMMIT;
