import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express from 'express'
import nodemailer from "nodemailer"


const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(cors())

app.post("/application", async (req, res) => {
  try {

      const {
          // general
          name,
          surname,
          phone,
          subject,
          connection,
          // kitchen
          kitchen__help,
          kitchen__shape,
          kitchen__size__A,
          kitchen__size__B,
          kitchen__size__C,
          kitchen__material,
          kitchen__fittings,
          kitchen__date,
          kitchen__budget,
          // cupboard
          cupboard__help,
          cupboard__room,
          cupboard__size__height,
          cupboard__size__width,
          cupboard__size__depth,
          cupboard__type,
          cupboard__view,
          cupboard__date,
          cupboard__budget
      } = req.body

      const date = new Date().toLocaleString().split(",").slice(0, 1).join(' ')
      // Создаем новый объект Date
      var today = new Date();

      // Получаем текущие значения часов, минут и секунд
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var seconds = today.getSeconds();

      // Форматируем значения, чтобы добавить ведущий ноль, если значение меньше 10
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;


      const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_SENDER,
              pass: process.env.PASSWORD
          }
      })
      // Send an email notification
      const mailOptions = {
          from: process.env.EMAIL_SENDER,
          to: process.env.EMAIL_RECIPIENT,
          subject: 'Новая заявка',
          html: `
          <html>
              <head>
              <title>Новая заявка</title>
              <style>
                  body {
                      font-family: 'Helvetica Neue', Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.5;
                      color: #333;
                      background-color: #fff;
                  }
                  
                  h1 {
                      font-size: 24px;
                      margin-bottom: 10px;
                  }
                  
                  p {
                      margin-bottom: 10px;
                  }
                  
                  img {
                      max-width: 100%;
                  }
              </style>
              </head>
              <body>
              <h1>Новая заявка</h1>
              <b>Здравствуйте!</b>
              <p>На вашем сайте в ${date}, ${hours + ":" + minutes + ":" + seconds} была оставлена заявка</p>
              <p>Имя: ${name}</p>
              <p>Фамилия: ${surname}</p>
              <p>Телефон: ${phone}</p>
              Клиент заказал ${subject === "kitchen" ? "кухню" : "шкаф"}.
              ${subject === "kitchen" ?
                  `${kitchen__help}.<br>
          ${kitchen__shape}.<br>
          ${kitchen__size__A ? `Размер А - ${kitchen__size__A} см <br>` : ""}
          ${kitchen__size__B ? `Размер B - ${kitchen__size__B} см <br>` : ""}
          ${kitchen__size__C ? `Размер C - ${kitchen__size__C} см <br>` : ""}
          ${kitchen__material}.<br>
          ${kitchen__fittings}.<br>
          ${kitchen__date}.<br>
          ${kitchen__budget}.<br>
          ${connection}.`
                  :
                  `${cupboard__help}.<br>
          ${cupboard__room}.<br>
          ${cupboard__size__height ? `Высота шкафа - ${cupboard__size__height} см <br>` : ""}
          ${cupboard__size__width ? `Ширина шкафа - ${cupboard__size__width} см <br>` : ""}
          ${cupboard__size__depth ? `Глубина шкафа - ${cupboard__size__depth} см <br>` : ""}
          ${cupboard__type}.<br>
          ${cupboard__view}.<br>
          ${cupboard__date}.<br>
          ${cupboard__budget}.<br>`
              }
              </body>
          </html>
          `
      };

      transporter.sendMail(mailOptions);
      res.status(200).json({
          message: "successfully"
      })
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message: "Не удалось подать заявку",
          error
      });
  }
});

// Connect to the database
import mysql from "mysql";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_database"
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});