import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import jwt from "jsonwebtoken";

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendEMail = (email) => {
  const options = {
    auth: {
      api_key: process.env.SENDGRID_PASSWORD,
    },
  };
  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
};

export const sendSecretMail = (adress, secret) => {
  const email = {
    from: "dopza86@gmail.com",
    to: adress,
    subject: "🔒마이스타그램 로그인 시크릿키🔒",
    html: `로그인 시크릿키는 <strong>${secret}</strong> 입니다.<br/>
    로그인시 복사 붙여넣기 해주세요`,
  };
  return sendEMail(email);
};

export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);
