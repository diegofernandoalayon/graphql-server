import { ApolloServer, gql } from 'apollo-server'

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
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    address: String!
    check: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const {name} = args
      return persons.find(person => person.name === name)
    }
  },
  Person: {
    address: (root) => `${root.street}, ${root.city}`,
    check: () => "hola"
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server Ready at ${url}`)
})