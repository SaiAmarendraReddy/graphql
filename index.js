const express = require("express")
const app = express()
const { buildSchema } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const PORT = 3214

let dynamicUser = []

// schema
const schema = buildSchema(`
    type User{
        name: String
        age: Int
        phoneNumber: String
    }

    type Query{
        hello: String
        getUser(age:Int):User
        getAllUsers:[User]
    }

    input InputUser{
        name: String!
        age: Int!
        phoneNumber: String!
    }

    input UpdateData{
        name: String
        age: Int
        phoneNumber: String
    }

    type Mutation {
        addUser(user:InputUser): [User]
        deleteUser(age:Int): String 
        updateUser(age:Int,update:UpdateData) : String
    }

`)

const root = {
    // get user based on ID
    getUser: (args) => {
        return dynamicUser.filter((value) => value.age == args.age)[0]
    },
    // get all users
    getAllUsers: () => {
        return dynamicUser
    },
    // to add new user
    addUser: (args) => {
        // console.log(args.user)
        dynamicUser.push(args.user)
        return dynamicUser
    },
    // to update user
    updateUser: (args) => {
        const { age, update } = args
        let responseString = "not found"
        // find the index of ID
        const index = dynamicUser.findIndex(value => value.age == age)
        // get the data from array
        if (index != -1) {
            // 
            let data = dynamicUser[index]
            // update the data and store in the index
            dynamicUser[index] = { ...data, ...update }
            responseString = "updated data"
        }
        return responseString
    },
    // to delete an user
    deleteUser: (args) => {
        dynamicUser = dynamicUser.filter((value) => value.age != args.age)
        return "successfull deleted"
    }
}

app.use("/testGraphql", graphqlHTTP({
    rootValue: root,
    schema: schema,
    graphiql: true,
}))

app.listen(PORT, () => {
    console.log(`CONNECTION ESTABLISH ${PORT}`);
})