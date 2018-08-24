export default `
	type User {
		id: ID!
		name: String
		email: String!
		followees: [User] @relation(name: "FOLLOW", direction: "OUT")
		followers: [User] @relation(name: "FOLLOW", direction: "IN")
		likeItems: [Item] @relation(name: "LIKE", direction: "OUT")
	}

	type Item {
		id: ID!
		name: String!
		likedByUsers: [User] @relation(name: "LIKE", direction: "IN")
	}

	type Query {
		User(id: ID!): User
		Users(orderBy: String): [User]
		Item(id: ID!): Item
		Items: [Item]
	}

	type Mutation {
		UserFollowUser(followerId: ID!, followeeId: ID!): User
		UserUnfollowUser(followerId: ID!, followeeId: ID!): User
		UserLikeItem(userId: ID!, itemId: ID!): User
		UserDislikeItem(userId: ID!, itemId: ID!): User
	}
`;
