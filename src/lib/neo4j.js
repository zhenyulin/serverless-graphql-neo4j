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
	} catch (e) {
		console.log(e);
		throw e;
	} finally {
		session.close();
	}
};

export const runCypherReturnOne = async (cypher, param, debug) => {
	if (debug) console.log(cypher);
	const session = driver.session();
	try {
		const { records } = await session.run(cypher, param);
		const items = records.map(r => r.get(0).properties);
		if (debug) console.log(items);
		return items[0];
	} catch (e) {
		if (
			e.code &&
			e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
		) {
			e.message = 'Node with constraint properties already exists';
		}
		throw e;
	} finally {
		session.close();
	}
};

export const runTransactionWithArray = async (cypher, params, debug) => {
	const session = driver.session();
	const transaction = session.beginTransaction();
	try {
		const result = [];
		params.forEach(async param => {
			if (debug) console.log(cypher, param);
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

export const runCyphersAsTransactions = async cyphers => {
	const session = driver.session();
	const transaction = session.beginTransaction();
	try {
		const result = [];
		cyphers.forEach(async cypher => {
			const r = await transaction.run(cypher);
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
