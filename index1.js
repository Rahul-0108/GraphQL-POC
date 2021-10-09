const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const books = [
 { id: 0, name: "A", authorId: "A1" },
 { id: 1, name: "B", authorId: "A2" },
 { id: 2, name: "C", authorId: "A3" },
 { id: 3, name: "D", authorId: "A4" },
 { id: 4, name: "E", authorId: "A2" },
 { id: 5, name: "B" },
];

const authors = [
 { id: "A1", name: "Author1" },
 { id: "A2", name: "Author2" },
 { id: "A3", name: "Author3" },
 { id: "A4", name: "Author4" },
 { id: "A5", name: "Author5" },
];

const defination = `
type Author {
  id: String!
  name : String!
  books : [Book]
}
type Book {
  id: Int!
  name: String!
  author : Author
}

type Query {
  book(id: Int!) : Book
  allBooks : [Book]!
  author(id: String!) : Author
}

type  Mutation {
  addBook(name : String! , authorId : String) : Book
}
`;

const rootValue = {
 Query: {
  book: (root, { id }) => {
   const book = books.find((m) => m.id === id);
   if (book) {
    return { id: book.id, name: book.name, author: authors.find((m) => m.id === book.authorId) };
   } else {
    return undefined;
   }
  },
  author: (root, { id }) => {
   const author = authors.find((m) => m.id === id);
   if (author) {
    return { id: author.id, name: author.name, books: books.filter((m) => m.authorId === author.id) };
   } else {
    return undefined;
   }
  },
  allBooks: () =>
   books.map((book) => {
    return { id: book.id, name: book.name, author: authors.find((m) => m.id === book.authorId) };
   }),
 },
 Mutation: {
  addBook: (root, { name, authorId }) => {
   books.push({ id: books.length, name: name, authorId: authorId });
   const book = books.find((m) => m.id === books.length - 1);
   return { id: book.id, name: book.name, author: authors.find((m) => m.id === book.authorId) };
  },
 },
};

const schema = makeExecutableSchema({ typeDefs: defination, resolvers: rootValue });
const app = express();

app.use("/", graphqlHTTP({ schema, graphiql: true }));
app.listen(3000, () => "Listening on port 3000");
