const express = require('express')
const dbConnect = require('./config/db')

const app = express();
dbConnect();

app.use(express.json())
app.use('/api/user', require('./routes/user'));
app.use('/api/movie', require('./routes/movie'))

app.listen(4000, () => {
    console.log("server up")
})