const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = require("graphql");

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

const Author = new GraphQLObjectType({
 name: "Author",
 description: "Author",
 fields: () => ({
  id: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  books: {
   type: new GraphQLList(Book),
   resolve: (author) => {
    return books.filter((book) => book.authorId === author.id);
   },
  },
 }),
});

const Book = new GraphQLObjectType({
 name: "Book",
 description: "Book",
 fields: () => ({
  id: { type: GraphQLNonNull(GraphQLInt) },
  name: { type: GraphQLNonNull(GraphQLString) },
  author: {
   type: Author,
   resolve: (book) => {
    return authors.find((author) => author.id === book.authorId);
   },
  },
 }),
});

const schema = new GraphQLSchema({
 query: new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
   book: {
    type: Book,
    description: "Book",
    args: { id: { type: GraphQLNonNull(GraphQLInt) } },
    resolve: (parent, args) => {
     return books.find((m) => m.id === args.id);
    },
   },
   author: {
    type: Author,
    description: "Author",
    args: { id: { type: GraphQLNonNull(GraphQLString) } },
    resolve: (parent, args) => {
     return authors.find((m) => m.id === args.id);
    },
   },
   allBooks: {
    type: new GraphQLList(Book),
    description: "All Books",
    resolve: () => {
     return books;
    },
   },
  }),
 }),
 mutation: new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
   addBook: {
    type: Book,
    description: "AddBook",
    args: { name: { type: GraphQLNonNull(GraphQLString) }, authorId: { type: GraphQLString } },
    resolve: (parent, args) => {
     const book = { id: books.length, name: args.name, authorId: args.authorId };
     books.push(book);
     return book;
    },
   },
  }),
 }),
});
const app = express();

app.use("/", graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(3000, () => "Listening on port 3000");
