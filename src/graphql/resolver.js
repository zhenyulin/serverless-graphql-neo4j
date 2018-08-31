import { neo4jgraphql } from 'neo4j-graphql-js';
import { runCypher } from 'lib/neo4j';

export default {
	Query: {
		User: (...args) => neo4jgraphql(...args, false),
		Users: (...args) => neo4jgraphql(...args, false),
		Item: (...args) => neo4jgraphql(...args, false),
		Items: (...args) => neo4jgraphql(...args, false),
	},
	User: {
		followees: ({ id }) =>
			runCypher(
				`
			MATCH (:User{id:${id}})-[:FOLLOW]->(followees:User)
			RETURN followees
		`,
				{},
				true,
			),
		followers: ({ id }) =>
			runCypher(
				`
			MATCH (:User{id:${id}})<-[:FOLLOW]->(followers:User)
			RETURN followers
		`,
				{},
				true,
			),
	},
	Mutation: {
		UserFollowUser: (_, { followerId, followeeId }) =>
			runCypher(`
				MATCH (follower:User {id: "${followerId}"})
				MATCH (followee:User {id: "${followeeId}"})
				MERGE (follower)-[:FOLLOW]->(followee)
				RETURN follower
			`),
		UserUnfollowUser: async (_, { followerId, followeeId }) =>
			runCypher(`
					MATCH (follower:User {id: "${followerId}"})
					MATCH (followee:User {id: "${followeeId}"})
					OPTIONAL MATCH (follower)-[follow:FOLLOW]->(followee)
					DELETE follow
					RETURN follower
				`),
		UserLikeItem: async (_, { userId, itemId }) =>
			runCypher(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					MERGE (user)-[:LIKE]->(item)
					RETURN user { .*, likeItems: [(user)-[:LIKE]->(items:Item) | items { .* }] } AS user
				`),
		UserDislikeItem: async (_, { userId, itemId }) =>
			runCypher(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					OPTIONAL MATCH (user)-[like:LIKE]->(item)
					DELETE like
					RETURN user { .*, likeItems: [(user)-[:LIKE]->(items:Item) | items { .* }] } AS user
				`),
	},
};
