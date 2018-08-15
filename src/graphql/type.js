export default `
	type User {
		id: ID!,
		name: String,
		email: String!
		followers: [User]
		likes: [Item]
	}

	type Item {
		id: ID!,
		name: String,
		model: String
	}

	type Query {
		user(id: ID!): User,
		item(id: ID!): Item,
	}
`;
