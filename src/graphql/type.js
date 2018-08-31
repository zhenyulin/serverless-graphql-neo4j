export default `
	type User {
		id: ID!
		name: String
		email: String!
		followees: [User]
		followers: [User]
		likeItems: [Item]
	}

	input UserInput {
		name: String
		email: String
	}

	type Item {
		id: ID!
		name: String!
		likedByUsers: [User]
	}

	input ItemInput {
		name: String
	}

	type Query {
		User(id: ID!): User
		Users: [User]
		Item(id: ID!): Item
		Items: [Item]
	}

	type Mutation {
		CreateUser(user: UserInput): User
		UpdateUser(id: ID!, user: UserInput): User
		DeleteUser(id: ID!): User
		CreateItem(item: ItemInput): Item
		UpdateItem(id: ID!, item: ItemInput): Item
		DeleteItem(id: ID!): Item
		UserFollowUser(followerId: ID!, followeeId: ID!): User
		UserUnfollowUser(followerId: ID!, followeeId: ID!): User
		UserLikeItem(userId: ID!, itemId: ID!): User
		UserDislikeItem(userId: ID!, itemId: ID!): User
	}
`;
