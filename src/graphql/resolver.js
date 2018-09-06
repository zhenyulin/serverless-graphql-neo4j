import uuid from 'uuid';

import {
	runCypher,
	runCypherReturnRecords,
	runCypherReturnOne,
} from 'lib/neo4j';

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
		ratedItems: async ({ id }) => {
			const records = await runCypherReturnRecords(
				`
				MATCH (user:User {id: "${id}"})
				OPTIONAL MATCH (user)-[rated:RATE]->(item:Item)
				RETURN item { .* } as item, rated.rating as rating
				ORDER BY item.id
			`,
			);
			const result = records.map(r => ({
				item: r.get('item'),
				rating: r.get('rating'),
			}));
			return result;
		},
	},
	Item: {
		averageRating: async ({ id }) => {
			const records = await runCypherReturnRecords(`
				MATCH (item:Item {id:"${id}"})
				OPTIONAL MATCH (item)<-[r:RATE]-(:User)
				RETURN AVG(r.rating) as averageRating
			`);
			const result = records[0].get(0);
			return result;
		},
		likedByUsers: ({ id }) =>
			runCypher(`
			MATCH (:Item{id:"${id}"})<-[:LIKE]-(users:User)
			RETURN users
		`),
		ratedByUsers: async ({ id }) => {
			const records = await runCypherReturnRecords(
				`
				MATCH (item:Item {id: "${id}"})
				OPTIONAL MATCH (user:User)-[rated:RATE]->(item)
				RETURN user { .* } as user, rated.rating as rating
				ORDER BY user.id
			`,
			);
			const result = records.map(r => ({
				user: r.get('user'),
				rating: r.get('rating'),
			}));
			return result;
		},
	},
	Mutation: {
		CreateUser: (_, { user }) =>
			runCypherReturnOne(`CREATE (u:User $user) SET u.id=$id RETURN u`, {
				user,
				id: uuid.v4(),
			}),
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
			runCypherReturnOne(`CREATE (i:Item $item) SET i.id=$id RETURN i`, {
				item,
				id: uuid.v4(),
			}),
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
		UserRateItem: async (_, { userId, itemId, rating }) =>
			runCypherReturnOne(
				`
			MATCH (user:User {id: $userId})
			MATCH (item:Item {id: $itemId})
			MERGE (user)-[rate:RATE {rating: $rating}]->(item)
			RETURN user
			`,
				{ userId, itemId, rating },
			),
	},
};
