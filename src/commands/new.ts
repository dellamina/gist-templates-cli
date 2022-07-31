import {Flags} from '@oclif/core'
import Command from '../base'
import {prompt} from 'inquirer'

export default class New extends Command {
  static description = 'create new jist'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    ...Command.flags,
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(New)

    let gist:any = {files: {}}

    let data = await prompt([
      {
        type: 'confirm',
        name: 'public',
        message: 'Public',
      },
      {
        type: 'text',
        name: 'description',
        message: 'Description',
      },
      //{
      //  type: 'confirm',
      //  name: 'runnable snipper'
      //},
    ])
    gist = {...data, ...gist}

    let stopped: boolean = false
    while (!stopped) {
      let file = await prompt([
        {
          type: 'text',
          name: 'name',
          message: 'File',
        },
        {
          type: 'editor',
          name: 'content',
          message: 'Content',
        }
      ])
      gist.files[file.name] = {content: file.content}
      let addNew = await prompt([{
        type: 'confirm',
        name: 'value',
        message: 'Add new file'
      }])
      if (!addNew.value) {
        stopped = true
      }
    }

    let result = await this.apiCall(await this.getToken(flags), 'POST /gists', {data: gist})
    if (result.status != 201) {
      this.error(`Something went wrong! Gist wasn't saved.`)
      this.exit(1)
    }

    this.log(`Gist ${result.data.id} saved successfully, go look at it: ${result.data.html_url}`)
  }
}
