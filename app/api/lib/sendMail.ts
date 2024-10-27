// Register Partials
import '../emails';

import fs from 'fs';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import { emailsDirectory } from './helper';

const getMailTemplate = (type: 'activation' | 'password-reset' | 'reset-success' | 'otp-checkin') => {
  switch (type) {
    case 'activation':
      return {
        subject: 'Welcome to SparkCare',
        dir: './auth/templates/activation-email.hbs',
      };
    case 'password-reset':
      return {
        subject: 'Password Reset Request',
        dir: './auth/templates/password-reset.hbs',
      };
    case 'reset-success':
      return {
        subject: 'Password Reset Successful',
        dir: './auth/templates/reset-success.hbs',
      };
    case 'otp-checkin':
      return {
        subject: 'OTP Check In Visit',
        dir: './visit/templates/otp-checkin.hbs',
      };
  }
};

export const sendEmail = async <T>(type: 'activation' | 'password-reset' | 'reset-success' | 'otp-checkin', toAddress: string[], data: T) => {
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SENDER_EMAIL, pass: process.env.SENDER_PASSWORD } });
  const { subject, dir } = getMailTemplate(type);

  const html = fs.readFileSync(path.join(emailsDirectory, dir), 'utf8');
  const htmlBody = Handlebars.compile(html)(data);

  const mailOptions = {
    to: toAddress,
    html: htmlBody,
    subject,
    from: process.env.SENDER_EMAIL,
  };

  const result = await transport.sendMail(mailOptions);
  return result;
};
