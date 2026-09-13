import { describe, expect, it } from 'vitest'
import { parseDriveFileId, toDrivePreviewEmbedUrl, toDriveVideoSrc } from '@/lib/drive-embed'

const FILE_ID = '1cIZ9ZbGAmhUO7DG9Pg1WQnEMdjXSfNTU'

describe('parseDriveFileId', () => {
  it('reads share, preview, open, and uc URLs', () => {
    expect(parseDriveFileId(`https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing`)).toBe(
      FILE_ID,
    )
    expect(parseDriveFileId(`https://www.drive.google.com/file/d/${FILE_ID}/preview`)).toBe(FILE_ID)
    expect(parseDriveFileId(`https://drive.google.com/open?id=${FILE_ID}`)).toBe(FILE_ID)
    expect(parseDriveFileId(`https://drive.google.com/uc?export=view&id=${FILE_ID}`)).toBe(FILE_ID)
  })

  it('rejects non-Drive hosts', () => {
    expect(parseDriveFileId(`https://evil.example/file/d/${FILE_ID}/view`)).toBeNull()
    expect(parseDriveFileId(`https://evil.example/open?id=${FILE_ID}`)).toBeNull()
  })
})

describe('Drive preview / video URLs', () => {
  it('normalizes to preview and download endpoints', () => {
    expect(toDrivePreviewEmbedUrl(`https://drive.google.com/open?id=${FILE_ID}`)).toBe(
      `https://drive.google.com/file/d/${FILE_ID}/preview`,
    )
    expect(toDriveVideoSrc(`https://drive.google.com/file/d/${FILE_ID}/view`)).toBe(
      `https://drive.google.com/uc?export=download&id=${FILE_ID}`,
    )
  })
})
