// Set up the server
const express = require('express')
const server = express()

// Set up the server to show static files
server.use(express.static('public'))

// Allow form body
server.use(express.urlencoded({ extended: true }))

// Set up connection with database
const Pool = require('pg').Pool //.Pool automates the database conection
const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'donate'
})

// Set up the template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// Set up the apresentation page
server.get('/', function(req, res){
    
    db.query('select * from donors', function(err, result){
        if (err)
            return res.send('database error')

        const donors = result.rows
        return res.render('index.html', { donors })

    })

})

server.post('/', function(req, res){
    // get form data
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send('Todos os campos são obrigatórios.')
    }

    // Put the values inside the database
    const query = `
        insert into donors ("name", "email", "blood") 
        values ($1, $2, $3)`
    
    const values = [name, email, blood]
    db.query(query, values, function(err){
        if (err) 
            return res.send('database error')
        
        return res.redirect('/')
    })

})

// Starts the app and allow the access in port 3000
server.listen(3000, function(){
    console.log('Server started')
}) 
