import {Command, Flags} from '@oclif/core'
import * as fs from 'fs-extra'
import * as path from 'path'
import {Octokit} from '@octokit/core'

export default abstract class extends Command {
  static flags = {
    token: Flags.string({char: 't'})
  }

  configFilePath() {
    return path.join(this.config.configDir, 'config.json')
  }
  
  async apiCall(token: string, url: string, options: any) {
    const octokit = new Octokit({ auth: token });
    const result = await octokit.request(url, options)
    return result
  }

  async getToken(flags: any) {
    if (flags.token != null) return flags.token;

    return this.getConfig('token')
  }

  async getConfig(key: string) {
    const userConfig = await fs.readJSON(this.configFilePath())
    return userConfig[key]
  }

  async setConfig(key: string, value: any) {
    const userConfig = await fs.readJSON(this.configFilePath())
    userConfig[key] = value
    await fs.ensureFile(this.configFilePath())
    await fs.writeJSON(this.configFilePath(), userConfig)
  }
}

