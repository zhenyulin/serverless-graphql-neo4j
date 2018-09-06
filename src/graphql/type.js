export default `
	type User {
		id: ID!
		name: String
		email: String!
		followees: [User]
		followers: [User]
		likeItems: [Item]
		similarUsersLiked: [Item]
		ratedItems: [ItemRating]
	}

	input UserCreate {
		name: String
		email: String!
	}

	input UserUpdate {
		name: String
		email: String
	}

	type Item {
		id: ID!
		name: String!
		averageRating: Float
		likedByUsers: [User]
		ratedByUsers: [ItemRating]
	}

	input ItemCreate {
		name: String!
	}

	input ItemUpdate {
		name: String
	}

	type ItemRating {
		item: Item
		user: User
		rating: Int
	}

	type Query {
		User(id: ID!): User
		Users: [User]
		Item(id: ID!): Item
		Items: [Item]
	}

	type Mutation {
		CreateUser(user: UserCreate): User
		UpdateUser(id: ID!, user: UserUpdate): User
		DeleteUser(id: ID!): User
		CreateItem(item: ItemCreate): Item
		UpdateItem(id: ID!, item: ItemUpdate): Item
		DeleteItem(id: ID!): Item
		UserFollowUser(followerId: ID!, followeeId: ID!): User
		UserUnfollowUser(followerId: ID!, followeeId: ID!): User
		UserLikeItem(userId: ID!, itemId: ID!): User
		UserDislikeItem(userId: ID!, itemId: ID!): User
		UserRateItem(userId: ID!, itemId: ID!, rating: Int!): User
	}
`;
