import path from 'node:path'
import { fileURLToPath } from 'node:url'

const seedDir = path.dirname(fileURLToPath(import.meta.url))

/** Source of truth: lingxia_home/docs/FAQ.md */
export const FAQ_MD_PATH = path.resolve(seedDir, '../../../../lingxia_home/docs/FAQ.md')
