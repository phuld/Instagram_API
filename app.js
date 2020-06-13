const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
//2JodGgfjlXW0mma7

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

mongoose.connect(MONGOURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

mongoose.connection.on('connected', () => {
    console.log('Connected successfully.')
})

mongoose.connection.on('error', (err) => {
    console.log('Connected fail', err)
})

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT);
})