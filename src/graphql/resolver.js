import { runCypher, runCypherReturnOne } from 'lib/neo4j';

export default {
	Query: {
		User: async (_, { id }) =>
			runCypherReturnOne(`MATCH (u:User {id:$id}) RETURN u`, { id }),
		Users: () => runCypher(`MATCH (u:User) RETURN u ORDER BY u.id`),
		Item: async (_, { id }) =>
			runCypherReturnOne(`MATCH (i:Item {id:$id}) RETURN i`, { id }),
		Items: () => runCypher(`MATCH (i:Item) RETURN i ORDER BY i.id`),
	},
	User: {
		followees: ({ id }) =>
			runCypher(`
			MATCH (:User{id:"${id}"})-[:FOLLOW]->(followees:User)
			RETURN followees
		`),
		followers: ({ id }) =>
			runCypher(`
			MATCH (:User{id:"${id}"})<-[:FOLLOW]->(followers:User)
			RETURN followers
		`),
		likeItems: ({ id }) =>
			runCypher(`
			MATCH (:User{id:"${id}"})-[:LIKE]->(items:Item)
			RETURN items
		`),
	},
	Item: {
		likedByUsers: ({ id }) =>
			runCypher(`
			MATCH (:Item{id:"${id}"})<-[:LIKE]-(users:User)
			RETURN users
		`),
	},
	Mutation: {
		CreateUser: (_, { user }) =>
			runCypherReturnOne(`CREATE (u:User $user) RETURN u`, { user }),
		UpdateUser: (_, { id, user }) =>
			runCypherReturnOne(`MATCH (u:User {id:$id}) SET u+=$user RETURN u`, {
				id,
				user,
			}),
		DeleteUser: (_, { id }) =>
			runCypherReturnOne(`MATCH (u:User {id: $id}) DETACH DELETE u`, {
				id,
			}),
		CreateItem: (_, { item }) =>
			runCypherReturnOne(`CREATE (i:Item $item) RETURN i`, { item }),
		UpdateItem: (_, { id, item }) =>
			runCypherReturnOne(`MATCH (i:Item {id:$id}) SET i+=$item RETURN i`, {
				id,
				item,
			}),
		DeleteItem: (_, { id }) =>
			runCypherReturnOne(`MATCH (i:Item {id: $id}) DETACH DELETE i`, {
				id,
			}),
		UserFollowUser: async (_, { followerId, followeeId }) =>
			runCypherReturnOne(`
				MATCH (follower:User {id: "${followerId}"})
				MATCH (followee:User {id: "${followeeId}"})
				MERGE (follower)-[:FOLLOW]->(followee)
				RETURN follower
			`),
		UserUnfollowUser: async (_, { followerId, followeeId }) =>
			runCypherReturnOne(`
					MATCH (follower:User {id: "${followerId}"})
					MATCH (followee:User {id: "${followeeId}"})
					OPTIONAL MATCH (follower)-[follow:FOLLOW]->(followee)
					DELETE follow
					RETURN follower
				`),
		UserLikeItem: async (_, { userId, itemId }) =>
			runCypherReturnOne(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					MERGE (user)-[:LIKE]->(item)
					RETURN user
				`),
		UserDislikeItem: async (_, { userId, itemId }) =>
			runCypherReturnOne(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					OPTIONAL MATCH (user)-[like:LIKE]->(item)
					DELETE like
					RETURN user
				`),
	},
};
