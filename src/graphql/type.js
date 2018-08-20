export default `
	type User {
		id: ID!
		name: String
		email: String!
		address: Address
		paymentCard: PaymentCard
		follows: [User] @relation(name: "FOLLOWS", direction: "OUT")
		followers: [User] @relation(name: "FOLLOWS", direction: "IN")
		likes: [Item] @relation(name: "LIKES", direction: "OUT")
	}

	type Item {
		id: ID!
		name: String
	}

	type Address {
		line1: String,
		line2: String,
		line3: String,
		city: String,
		country: String,
		postcode: String,
	}

	type PaymentCard {
		cardType: PaymentCardType
		nameOnCard: String
		cardNumber: String
		expireDate: String
	}

	enum PaymentCardType {
		Visa,
		MasterCard,
		AmericanExpress
	}

	type Query {
		Users: [User]
		User(id: ID, email: String): User
		UserLikesItem(itemId: ID!): [User] @cypher(statement: "MATCH (i:Item) <- [r:LIKES] - (u:User) RETURN u")
		UserFollowsdUser(userId: ID!): [User] @cypher(statement: "MATCH (u:user) <- [r:FOLLOWS] - (followers:User) RETURN followers")
		Items: [Item]
		Item(id: ID!): Item
	}

	type Mutation {
		AddUserFollower(userId: ID!, followerId: ID!): User
	}
`;
