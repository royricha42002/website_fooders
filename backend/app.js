import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import cors from "cors";
import { errorMiddleware } from "./error/error.js";
import orderRouter from './routes/orderRoute.js';
import reservationRouter from "./routes/reservationRoute.js";
// import { dbConnection } from "./database/dbConnection.js";
import axios from 'axios';
import uniqid from 'uniqid';
import crypto from 'crypto';
import { Cashfree } from "cashfree-pg";


const app = express();
dotenv.config({ path: "./config/.env" });
app.use(
  cors({
    origin: `http://localhost:5173`,
    methods: ["POST"],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/reservation',reservationRouter)
app.use('/api/v1', orderRouter);
dbConnection();
app.use(errorMiddleware);
export default app;

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["POST"],
//     credentials: true,
//   })
// );


Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');

  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);

  const orderId = hash.digest('hex');

  return orderId.substring(0, 12);
}

app.get('/',(req,res)=>{
  res.send('hello');
})

app.post('/payment', async (req, res) => {
  try {
    const { finalAmount } = req.body; // Get the final amount from the request body

    let request = {
      "order_amount": finalAmount, // Use the final amount here
      "order_currency": "INR",
      "order_id": await generateOrderId(),
      "customer_details": {
        "customer_id": "webcodder01",
        "customer_phone": "7983788548",
        "customer_name": "Web Codder",
        "customer_email": "webcodder@example.com"
      },
    };

    Cashfree.PGCreateOrder("2023-08-01", request).then(response => {
      console.log(response.data);
      res.json(response.data);
    }).catch(error => {
      console.error(error.response.data.message);
    });

  } catch (error) {
    console.log(error);
  }
});

app.post('/verify', async (req, res) => {

  try {

      let {
          orderId
      } = req.body;

      Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {

          res.json(response.data);
      }).catch(error => {
          console.error(error.response.data.message);
      })


  } catch (error) {
      console.log(error);
  }
})