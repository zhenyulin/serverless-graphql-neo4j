export default `
	type User {
		id: ID!
		name: String
		email: String!
		address: Address @relation(name: "HAS_ADDRESS", direction: "OUT")
		paymentCard: PaymentCard @relation(name: "HAS_PAYMENT_CARD", direction: "OUT")
		follows: [User] @relation(name: "FOLLOWS", direction: "OUT")
		followers: [User] @relation(name: "FOLLOWS", direction: "IN")
		likes: [Item] @relation(name: "LIKES", direction: "OUT")
	}

	type Item {
		likedBy: [User] @relation(name: "LIKES", direction: "IN")
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
		User(id: ID!): User
		Items: [Item]
		Item(id: ID!): Item
	}

	type Mutation {
		AddUserFollower(userId: ID!, followerId: ID!): User
		RemoveUserFollower(userId: ID!, followerId: ID!): User
		AddUserItem(userId: ID!, itemId: ID!): User
	}
`;
