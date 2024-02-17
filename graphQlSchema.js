const { gql }  = require('apollo-server-express')
const User = require('./model/UserModel')
const mongoose = require('mongoose')

exports.typeDefs = gql`
    type User{
        id: ID!
        name: String!
        age: Int!
        email: String!
    }

    type Query {
        getUserList: [User]
        getUser(id: ID!): [User]
    }

    type Mutation {
        addUser(name: String!, age: Int! ,email: String!): User
        updateUser(id: ID!, name: String!, age: Int! ,email: String!): User
        deleteUser(id: ID!): Boolean!
    }
`

const connect = async () => {
    await mongoose.connect(
        "mongodb+srv://huzaif:huzaifmtb@cluster0.tkpiyzu.mongodb.net/Cluster0?retryWrites=true&w=majority",
    ).then(() => console.log('db connected'))
    .catch((err) => console.log(err))
}

exports.resolvers = {
    Query: {
        getUserList: async (parent, args) => {
            await connect();
            
            const result = User.find({}).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;
        },

        getUser: async (parent, args) => {
            await connect();

            try {
                const result = await User.findById(args.id);
                return [result];
            } catch (err) {
                console.error(err);
                return null; // or throw error based on your requirement
            }
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            await connect();

            const email_exists = await User.findOne({email: args.email})

            if (email_exists) {
                throw new Error("Email alredy exists")
            }

            let user = new User({
                name: args.name,
                age: args.age,
                email: args.email
            })

            const result = user.save().then((res) => {
                if (res) {
                    return res
                }
            })
            return result
        },

        updateUser: async (parent, args) => {
            await connect();

            const result = User.findByIdAndUpdate(args.id, {
                name: args.name,
                age: args.age,
                email: args.email
            }, {new: true}).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;
        },

        deleteUser: async (parent, args) => {
            try {
                await connect();
                await User.findOneAndDelete({_id: args.id})
                return true;
            } catch (err) {
                console.log('Error while delete: ', err)
                return false;
            }
        }


    }

    


}