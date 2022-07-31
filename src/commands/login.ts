import {Flags, CliUx} from '@oclif/core'
import Command from '../base'

export default class Login extends Command {
  static description = 'Login to Github'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = [
    {
      name: 'token',
      description: 'API key generated from Github',
    }
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Login)
    let token = args.token;

    if (!token) {
      token = await CliUx.ux.prompt('Insert your API key generated from Github, check https://github.com/settings/tokens', {type: 'mask'});
    }

    if (token.length != 40) {
      this.error(`Invalid token`)
      this.exit(1)
    }

    await this.setConfig('token', token);
    this.log(`Token saved succesfully!`)
  }
}
