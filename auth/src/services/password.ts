import {scrypt,randomBytes} from 'crypto'
import {promisify} from 'util'


const asyncScript = promisify(scrypt)


export class Password {

   static async toHash (password:string ){
      const salt = randomBytes(8).toString('hex')
      const buff = (await asyncScript(password,salt,64)) as Buffer

      return `${buff.toString('hex')}.${salt}`
   }

   static async toCompare ( storedPassword: string, suppliedPassword: string){
      const [hashedPassword,salt] = storedPassword.split('.')
      const buff = (await asyncScript(suppliedPassword,salt,64)) as Buffer
      
      return buff.toString('hex') === hashedPassword
    }
}