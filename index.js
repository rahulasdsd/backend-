const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db')

const PORT = process.env.PORT || 5000

app.get('/ping',(req,res) =>{
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors({
  origin: '*' // Allow any origin (not recommended for production)
}));
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
