import { neo4jgraphql } from 'neo4j-graphql-js';
import { driver } from '../server';

export default {
	Query: {
		User: (...args) => neo4jgraphql(...args),
		Users: (...args) => neo4jgraphql(...args),
		Item: (...args) => neo4jgraphql(...args),
		Items: (...args) => neo4jgraphql(...args),
	},
	Mutation: {
		UserFollowUser: async (_, { followerId, followeeId }) => {
			const session = driver.session();
			try {
				const result = await session.run(`
					MATCH (follower:User {id: "${followerId}"})
					MATCH (followee:User {id: "${followeeId}"})
					MERGE (follower)-[:FOLLOW]->(followee)
					RETURN follower { .*, followees: [(follower)-[:FOLLOW]->(user_followees:User) | user_followees { .* }] } AS user
				`);
				return result.records[0].get(0);
			} finally {
				session.close();
			}
		},
		UserUnfollowUser: async (_, { followerId, followeeId }) => {
			const session = driver.session();
			try {
				const result = await session.run(`
					MATCH (follower:User {id: "${followerId}"})
					MATCH (followee:User {id: "${followeeId}"})
					OPTIONAL MATCH (follower)-[follow:FOLLOW]->(followee)
					DELETE follow
					RETURN follower { .*, followees: [(follower)-[:FOLLOW]->(followees:User) | followees { .* }] } AS user;
				`);
				return result.records[0].get(0);
			} finally {
				session.close();
			}
		},
		UserLikeItem: async (_, { userId, itemId }) => {
			const session = driver.session();
			try {
				const result = await session.run(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					MERGE (user)-[:LIKE]->(item)
					RETURN user { .*, likeItems: [(user)-[:LIKE]->(items:Item) | items { .* }] } AS user
				`);
				return result.records[0].get(0);
			} finally {
				session.close();
			}
		},
		UserDislikeItem: async (_, { userId, itemId }) => {
			const session = driver.session();
			try {
				const result = await session.run(`
					MATCH (user:User {id: "${userId}"})
					MATCH (item:Item {id: "${itemId}"})
					OPTIONAL MATCH (user)-[like:LIKE]->(item)
					DELETE like
					RETURN user { .*, likeItems: [(user)-[:LIKE]->(items:Item) | items { .* }] } AS user
				`);
				return result.records[0].get(0);
			} finally {
				session.close();
			}
		},
	},
};
