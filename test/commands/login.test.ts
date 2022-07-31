import {expect, test} from '@oclif/test'

describe('login', () => {
  test
  .stdout()
  .command(['login'])
  .it('runs login', ctx => {
    expect(ctx.stdout).to.contain('Token saved succesfully')
  })

  test
  .stdout()
  .command(['login', '--token', 'ghp_dfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdf'])
  .it('runs login --token *****', ctx => {
    expect(ctx.stdout).to.contain('Token saved succesfully')
  })
})
