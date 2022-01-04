import 'dotenv/config'
import { ApolloServer, UserInputError, gql } from 'apollo-server'
// import {v1 as uuid} from 'uuid'
import './db.js'
import Person from './models/person.js'
import User from './models/user.js'
const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    street: String!
    address: Address!
    id: ID!
  }
  type User {
    username: String!
    friends: [Person]!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
        if (!args.phone){
          return Person.find({})
        }
        return Person.find({phone: { $exists: args.phone === 'YES' }})
      },
    findPerson: (root, args) => {
      const {name} = args
      return Person.findOne({ name}).exec()
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args})
      try {
        await person.save()
      } catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({name: args.name}).exec()
      if ( !person ) return 
      person.phone = args.phone
      try {
        await person.save()
      } catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return person
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server Ready at ${url}`)
})