import { ApolloServer, UserInputError, gql } from 'apollo-server'
import {v1 as uuid} from 'uuid'
import axios from 'axios'
const persons = [
  {
    name: 'dfar',
    phone: '3333 3333',
    street: 'calle 3 4-23',
    city: 'Mia',
    id: '123412341234'
  },
  {
    name: 'aoeuaoe',
    phone: '3122332 3333',
    street: 'calle 4 4-23',
    city: 'tuya',
    id: '63456345634'
  },
  {
    name: 'pedro',
    street: 'calle 5 4-23',
    city: 'suya',
    id: '12348765845'
  },
]
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
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      
      if(!args.phone) return persons

      const byPhone = person => args.phone === "YES" ? person.phone : !person.phone

      return persons.filter(byPhone)
      },
    findPerson: (root, args) => {
      const {name} = args
      return persons.find(person => person.name === name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)){
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name
        })
      }
      const person = {...args, id:uuid()}
      persons.push(person) // update database with new person 
      return person
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex(p => p.name === args.name)
      if(personIndex === -1) return null

      const person = persons[personIndex]
      const updatedPerson = {...person, phone: args.phone}
      persons[personIndex] = updatedPerson
      return updatedPerson
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