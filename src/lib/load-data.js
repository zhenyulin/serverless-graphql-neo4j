import * as Fixtures from '__fixtures__';

import { runCypher, runTransaction } from './neo4j';

export const createUsers = () =>
	runTransaction(
		`CREATE (u:User $user) RETURN u`,
		Fixtures.USERS.map(user => ({ user })),
	);

export const createItems = () =>
	runTransaction(
		`CREATE (i:Item $item) RETURN i`,
		Fixtures.ITEMS.map(item => ({ item })),
	);

export const createUserFollowUsers = () =>
	runTransaction(
		`MATCH (follower:User), (followee:User)
			WHERE follower.id = $followerId AND followee.id = $followeeId
			CREATE (follower)-[r:FOLLOW]->(followee)
			RETURN r`,
		Fixtures.USER_FOLLOW_USERS,
	);

export const createUserLikeItems = () =>
	runTransaction(
		`MATCH (user:User), (item:Item)
			WHERE user.id = $userId AND item.id = $itemId
			CREATE (user)-[r:LIKE]->(item)
			RETURN r`,
		Fixtures.USER_LIKE_ITEMS,
	);

export const loadData = async () => {
	await createUsers();
	await createItems();
	await createUserFollowUsers();
	await createUserLikeItems();
};

export const emptyData = () => runCypher(`MATCH (n) DETACH DELETE n`);
