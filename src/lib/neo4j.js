import { v1 as neo4j } from 'neo4j-driver';

const driver = neo4j.driver(
	process.env.NEO4J_URI,
	neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

export const runCypher = async (cypher, param, debug) => {
	if (debug) console.log(cypher);
	const session = driver.session();
	try {
		const { records } = await session.run(cypher, param);
		const items = records.map(r => r.get(0).properties);
		if (debug) console.log(items);
		return items;
	} finally {
		session.close();
	}
};

export const runCypherOne = async (cypher, param, debug) => {
	if (debug) console.log(cypher);
	const session = driver.session();
	try {
		const { records } = await session.run(cypher, param);
		const items = records.map(r => r.get(0).properties);
		if (debug) console.log(items);
		return items[0];
	} finally {
		session.close();
	}
};

export const runTransaction = async (cypher, params) => {
	const session = driver.session();
	const transaction = session.beginTransaction();
	try {
		const result = [];
		params.forEach(async param => {
			const r = await transaction.run(cypher, param);
			result.push(r);
		});
		await transaction.commit();
		return result;
	} catch (e) {
		transaction.rollback();
		throw e;
	} finally {
		session.close();
	}
};

export default driver;
