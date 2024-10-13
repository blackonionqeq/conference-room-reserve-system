import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'node:path'
import { v4 } from 'uuid'

export const storage = multer.diskStorage({
  destination(_, file, cb) {
    try {
      fs.mkdirSync('uploads')
    } catch (e) {
      console.error(e)
    }
    cb(null, 'uploads')
  },
  filename(_, file, cb) {
    const name = `${+new Date()}-${v4()}${path.extname(file.originalname)}`
    cb(null, name)
  },
})
