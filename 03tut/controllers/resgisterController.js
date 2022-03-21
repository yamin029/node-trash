const usersDB= {
    users : require('../model/users.json'),
    setUsers : function(data){this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path')
// to do the password hashing
const bcrypt = require('bcrypt')

const handleNewUser = async(req, res)=>{
    const {user, pass} = req.body
    if(!user || !pass) return res.status(400).json({'message':'username and password are required.'})
    //check for duplicate users in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    if(duplicate) return res.sendStatus(409)//Conflict
    try {
        //encrypt the new user
        const hashedPass = await bcrypt.hash(pass, 10);
        //store the new user
        const newUser = {"username" : user, "password" : hashedPass}
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..','model','users.json'),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users)
        res.status(201).json({'success' : `New User ${user} Created`})
    } catch (error) {
        res.status(500).json({'message' : error});//500 for surver error
    }
}

module.exports = {handleNewUser}
// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');
// const bcrypt = require('bcrypt');

// const handleNewUser = async (req, res) => {
//     const { user, pwd } = req.body;
//     if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
//     // check for duplicate usernames in the db
//     // const duplicate = usersDB.users.find(person => person.username === user);
//     // if (duplicate) return res.sendStatus(409); //Conflict 
//     try {
//         //encrypt the password
//         const hashedPwd = await bcrypt.hash(pwd, 10);
//         //store the new user
//         const newUser = { "username": user, "password": hashedPwd };
//         usersDB.setUsers([...usersDB.users, newUser]);
//         await fsPromises.writeFile(
//             path.join(__dirname, '..', 'model', 'users.json'),
//             JSON.stringify(usersDB.users)
//         );
//         console.log(usersDB.users);
//         res.status(201).json({ 'success': `New user ${user} created!` });
//     } catch (err) {
//         res.status(500).json({ 'message': err.message });
//     }
// }

// module.exports = { handleNewUser };