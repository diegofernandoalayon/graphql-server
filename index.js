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
    phone: '1233 3344',
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
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server Ready at ${url}`)
})