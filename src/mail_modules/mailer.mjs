import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import {host, port, user, pass} from './config.json'

export const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

transport.use('compile', hbs({
    'viewEngine':'handlebars',
    'viewPath':'./resources/mail/',
    'extName':'.html',
}))