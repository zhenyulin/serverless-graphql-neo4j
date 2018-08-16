export default `
	type User {
		id: ID!
		name: String
		email: String!
		follows: [User] @relation(name: "FOLLOWS", direction: "OUT")
		followers: [User] @relation(name: "FOLLOWS", direction: "IN")
		likes: [Item] @relation(name: "LIKES", direction: "OUT")
	}

	type Item {
		id: ID!
		name: String
		likedBy: [User] @relation(name: "LIKES", direction: "IN")
	}

	type Query {
		user(id: ID!): User
		item(id: ID!): Item
	}
`;
