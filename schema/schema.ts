const graphql = require('graphql');
//const connections = require('graphql-connections')

const nano = require('nano')('http://admin:123@localhost:5984');
const test_db = nano.db.use('vito_test_db');

const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLScalarType } = graphql;

async function getUserCard(id) {
    const doc = await test_db.get(id);
    return doc;
};

async function findByFullName(fullName) {
    let indStr = fullName.indexOf(" ");
    const data = {
        selector: {
            "$and": [
                {
                    first_name: { "$eq": fullName.slice(0, indStr) }
                },
                {
                    last_name: { "$eq": fullName.slice(indStr + 1) }
                }
            ]
        },
        fields: ["_id", "user_id", "first_name", "last_name", "phone_number"]
    };
    const response = await test_db.find(data);
    const file = JSON.parse(JSON.stringify(response));
    return file.docs;
};

async function friendList() {
    const doclist = await test_db.list({ include_docs: true });
    let dataList = [];
    for (let i = 0; i < doclist.rows.length; i++) {
        dataList.push(doclist.rows[i].doc);
    };
    return dataList;
};

async function findByArbitraryStringKey(stringKey) {
    let indStr = stringKey.indexOf(" ");

    if (indStr == -1) {
        var endStr = stringKey.length;
    } else {
        var endStr = indStr;
    }

    const data = {
        selector: {
            "$or": [
                {
                    user_id: { "$eq": stringKey.slice(0, endStr) }
                },
                {
                    first_name: { "$eq": stringKey.slice(0, endStr) }
                },
                {
                    last_name: { "$eq": stringKey.slice(0, endStr) }
                },
                {
                    phone_number: { "$elemMatch": { "$eq": stringKey.slice(0, endStr) } }
                },
            ]
        },
        fields: ["_id", "user_id", "first_name", "last_name", "phone_number"]
    };
    const response = await test_db.find(data);
    const file = JSON.parse(JSON.stringify(response));
    return file.docs;
};

const friendType = new GraphQLObjectType({
    name: "Friend",
    fields: () => ({
        _id: { type: GraphQLID },
        user_id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        phone_number: { type: new GraphQLList(GraphQLString) },
    }),
});

// Pagination scheme should be here

const queryRootType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        findByStringKey: {
            type: new GraphQLList(friendType),
            args: { stringKey: { type: GraphQLString } },
            resolve(source, { stringKey }) {
                return findByArbitraryStringKey(stringKey)
            }
        },
        friendByID: {
            type: friendType,
            args: { id: { type: GraphQLID } },
            resolve(source, { id }) {
                return getUserCard(id);
            }
        },
        friendByName: {
            type: new GraphQLList(friendType),
            args: { name: { type: GraphQLString } },
            resolve(source, { name }) {
                return findByArbitraryStringKey(name);
            }
        },
        friendByFullName: {
            type: new GraphQLList(friendType),
            args: { fullName: { type: GraphQLString } },
            resolve(source, { fullName }) {
                return findByFullName(fullName);
            }
        },
        friendByPhone: {
            type: new GraphQLList(friendType),
            args: { phone: { type: GraphQLString } },
            resolve(source, { phone }) {
                return findByArbitraryStringKey(phone);
            }
        },
        friends: {
            type: new GraphQLList(friendType),
            resolve() {
                return friendList();
            }
        }
    }),
});

const appSchema = new GraphQLSchema({
    query: queryRootType,
});

module.exports = appSchema;