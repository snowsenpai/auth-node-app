const fileSystem = require('fs');
const path = require('path');

const { makeId } = require('../util/make-id');

const pathToUsersCollection = path.join(__dirname, '..', 'data', 'users.json');

// callBack function is recieved as an argument from a controller
// when calling a class method, the callback will hold the data returned
const getUsersFromCollection = callBack =>{
    // will return either an empty array or an array of users to the callback
    fileSystem.readFile(pathToUsersCollection,(error, usersData) =>{
        if(error){
            callBack([]);
        } else{
            callBack(JSON.parse(usersData));
        }
    });
};

module.exports = class User{
    constructor(id, email, password, firstName, lastName, address, role){
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.role = role 
    }

    save(){
        getUsersFromCollection(users => {
            // if this.id is set user already exists, else its a new user
            if (this.id) {
                const existingUserIndex = users.findIndex(user => user.id === this.id);

                const existingUsers = [...users];
                existingUsers[existingUserIndex] = this;

                fileSystem.writeFile(pathToUsersCollection,
                    JSON.stringify(existingUsers,null,2),
                    error => {
                        console.log('write file err =>',error);
                    }
                );
            } else {
                // number of bytes to generate -> 7, using node:crypto
                const id = makeId(7);
                this.id = id;

                // set user role
                let role;
                if (this.email === process.env.ADMIN_EMAIL ) {
                    role = 'ADMIN';        
                } else{
                    role = 'USER';
                }
                this.role = role

                users.push(this);
                fileSystem.writeFile(pathToUsersCollection, 
                    JSON.stringify(users,null,2),
                    error => {
                        console.log('write file err =>',error);
                    }
                );
            }
        });
    }

    // 
    static fetchAllUsers(callBack){
        getUsersFromCollection(callBack);
    }

    // 
    static findById(id, callBack){
        getUsersFromCollection(users => {
            const requestedUser = users.find(user => user.id === id);
            callBack(requestedUser);
        });
    }

    // 
    static findByEmail(email, callBack){
        getUsersFromCollection(users => {
            const requestedUser = users.find(user => user.email === email);
            callBack(requestedUser);
        });
    }
};