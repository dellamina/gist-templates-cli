import {Flags} from '@oclif/core'
import Command from '../base'
import {prompt} from 'inquirer'
import {compile} from 'handlebars'

export default class Run extends Command {
  static description = 'edit Gist'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    ...Command.flags,
  }

  static args = [
    {
      name: 'id',
      required: true,
    },
  ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Run)

    this.log('Loading Gist...')
    let res:any = await this.apiCall(await this.getToken(flags), `GET /gists/${args.id}`)
    if (res.status !== 200) {
      this.error(`Something went wrong! Can't find Gist.`)
      this.exit(1)
    }
    let gist:any = res.data
    this.log('Provide the data required to run the template')
    let data = await prompt(JSON.parse(gist.files['zeta.json'].content).questions)
    let output = ''
    for (let file in gist.files) {
      if (file == 'zeta.json') continue

      const template = compile(gist.files[file].content)
      output += (output == '' ? '' : '\n') + `// file: ${file}\n`
      output += template(data)
    }
    this.log(output)
  }
}

