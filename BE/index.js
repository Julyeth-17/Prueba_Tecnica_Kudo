const express = require('express')
const dbConnect = require('./config/db')

const app = express();
dbConnect();

app.use(express.json())
app.use('/api/user', require('./routes/user'));
app.use('/api/movie', require('./routes/movie'))

const port = process.env.port || 4000
app.listen(port, () => {
    console.log(`server up on port ${port}`)
})