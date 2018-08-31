import { runCypher, runCypherOne } from 'lib/neo4j';

export default {
	Query: {
		User: async (_, { id }) =>
			runCypherOne(`MATCH (u:User {id:$id}) RETURN u`, { id }),
		Users: () => runCypher(`MATCH (u:User) RETURN u`),
		Item: async (_, { id }) =>
			runCypherOne(`MATCH (i:Item {id:$id}) RETURN i`, { id }),
		Items: () => runCypher(`MATCH (i:Item) RETURN i`),
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
			runCypherOne(`CREATE (u:User $user) RETURN u`, { user }),
		UpdateUser: (_, { id, user }) =>
			runCypherOne(`MATCH (u:User {id:$id}) SET u+=$user RETURN u`, {
				id,
				user,
			}),
		DeleteUser: (_, { id }) =>
			runCypherOne(`MATCH (u:User {id: $id}) DETACH DELETE u RETURN u`, { id }),
		CreateItem: (_, { item }) =>
			runCypherOne(`CREATE (i:Item $item) RETURN i`, { item }),
		UpdateItem: (_, { id, item }) =>
			runCypherOne(`MATCH (i:Item {id:$id}) SET i+=$item RETURN i`, {
				id,
				item,
			}),
		DeleteItem: (_, { id }) =>
			runCypherOne(`MATCH (i:Item {id: $id}) DETACH DELETE i RETURN i`, { id }),
		UserFollowUser: async (_, { followerId, followeeId }) =>
			runCypherOne(`
				MATCH (follower:User {id: "${followerId}"})
				MATCH (followee:User {id: "${followeeId}"})
				MERGE (follower)-[:FOLLOW]->(followee)
				RETURN follower
			`),
		UserUnfollowUser: async (_, { followerId, followeeId }) =>
			runCypherOne(`
					MATCH (follower:User {id: "${followerId}"})
					MATCH (followee:User {id: "${followeeId}"})
					OPTIONAL MATCH (follower)-[follow:FOLLOW]->(followee)
					DELETE follow
					RETURN follower
				`),
		UserLikeItem: async (_, { userId, itemId }) =>
			runCypherOne(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					MERGE (user)-[:LIKE]->(item)
					RETURN user
				`),
		UserDislikeItem: async (_, { userId, itemId }) =>
			runCypherOne(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					OPTIONAL MATCH (user)-[like:LIKE]->(item)
					DELETE like
					RETURN user
				`),
	},
};
