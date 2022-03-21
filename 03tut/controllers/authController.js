const usersDB = {
    users : require('../model/users.json'),
    setUsers : function(data){this.users == data}
} 

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleLogin = async(req, res) => {
    const { user, pass} = req.body
    if(!user || !pass) return res.status(400).json({"message" : "Username and password are required !"})
    const foundUser = usersDB.users.find(person => person.username == user)
    if(!foundUser) return res.sendStatus(401)//Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pass, foundUser.password)
    if(match){
        res.json({'Success' : `User ${user} is logged in`})
    }else{
        res.statusCode(401)
    }

} 

module.exports = {handleLogin}