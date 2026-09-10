import { describe, expect, it } from 'vitest'
import {
  describeTeamConflict,
  galleryTeamPresentation,
  isMemberOfTeam,
  pickMembershipRow,
  teammatesForSave,
  zipTeammateColumns,
} from '@/lib/project-team'

const ownerRow = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'ada@example.com',
  name: 'Ada',
  projectTitle: 'Demo Bot',
  githubUrl: 'https://github.com/ada/demo-bot',
  teammateEmails: ['bob@example.com'],
}

describe('zipTeammateColumns / galleryTeamPresentation', () => {
  it('zips parallel name and email columns and hides emails from the public gallery', () => {
    const teammates = zipTeammateColumns(
      ['bob@example.com', 'cara@example.com'],
      ['Bob', ''],
    )
    expect(teammates).toEqual([
      { email: 'bob@example.com', name: 'Bob' },
      { email: 'cara@example.com', name: '' },
    ])

    const publicTeam = galleryTeamPresentation('Ada', teammates, false)
    expect(publicTeam).toEqual({
      submitterName: 'Ada',
      teammateNames: ['Bob'],
    })
    expect(publicTeam).not.toHaveProperty('teammateEmails')

    const judgeTeam = galleryTeamPresentation('Ada', teammates, true)
    expect(judgeTeam.teammateEmails).toEqual(['bob@example.com', 'cara@example.com'])
  })
})

describe('isMemberOfTeam / pickMembershipRow', () => {
  it('treats submitter and listed teammates as members', () => {
    expect(isMemberOfTeam('Ada@Example.com', ownerRow)).toBe(true)
    expect(isMemberOfTeam('bob@example.com', ownerRow)).toBe(true)
    expect(isMemberOfTeam('cara@example.com', ownerRow)).toBe(false)
  })

  it('prefers the caller submitter row over a teammate listing', () => {
    const listedOnOther = {
      ...ownerRow,
      id: '22222222-2222-2222-2222-222222222222',
      email: 'other@example.com',
      teammateEmails: ['ada@example.com'],
    }
    const picked = pickMembershipRow('ada@example.com', [listedOnOther, ownerRow])
    expect(picked?.id).toBe(ownerRow.id)
  })
})

describe('teammatesForSave', () => {
  it('keeps a listed teammate on the team when they update', () => {
    const saved = teammatesForSave({
      callerEmail: 'bob@example.com',
      callerName: 'Bob',
      ownerEmail: 'ada@example.com',
      formTeammates: [{ email: 'cara@example.com', name: 'Cara' }],
    })
    expect(saved.ok).toBe(true)
    if (saved.ok) {
      expect(saved.teammates).toEqual([
        { email: 'cara@example.com', name: 'Cara' },
        { email: 'bob@example.com', name: 'Bob' },
      ])
    }
  })

  it('strips the owner email from teammate slots', () => {
    const saved = teammatesForSave({
      callerEmail: 'ada@example.com',
      callerName: 'Ada',
      ownerEmail: 'ada@example.com',
      formTeammates: [
        { email: 'ada@example.com', name: 'Ada' },
        { email: 'bob@example.com', name: 'Bob' },
      ],
    })
    expect(saved.ok).toBe(true)
    if (saved.ok) {
      expect(saved.teammates).toEqual([{ email: 'bob@example.com', name: 'Bob' }])
    }
  })
})

describe('describeTeamConflict', () => {
  it('explains a duplicate GitHub repo', () => {
    const described = describeTeamConflict({
      callerEmail: 'cara@example.com',
      proposedGithubUrl: 'https://github.com/ada/demo-bot',
      proposedMemberEmails: ['cara@example.com'],
      conflict: ownerRow,
    })
    expect(described.code).toBe('github')
    expect(described.message).toMatch(/Demo Bot/)
  })

  it('explains when a listed teammate is already on another project', () => {
    const described = describeTeamConflict({
      callerEmail: 'cara@example.com',
      proposedGithubUrl: 'https://github.com/cara/other',
      proposedMemberEmails: ['cara@example.com', 'bob@example.com'],
      conflict: ownerRow,
    })
    expect(described.code).toBe('membership')
    expect(described.message).toMatch(/bob@example.com/)
    expect(described.message).toMatch(/Demo Bot/)
  })
})
