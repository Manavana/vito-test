const graphql = require('graphql');
//const connections = require('graphql-connections')

const nano = require('nano')('http://admin:123@localhost:5984');
const test_db = nano.db.use('vito_test_db');

const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLScalarType } = graphql;

async function getCard(id) {
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
                },
            ]
        },
        fields: ["_id", "user_id", "first_name", "last_name", "phone_number"]
    };
    const response = await test_db.find(data);
    return response.docs;
};

async function viewAll(type) {
    const doclist = await test_db.list({ include_docs: true });
    var userList = [];
    var phoneList = [];
    for (let i = 0; i < doclist.rows.length; i++) {
        if (doclist.rows[i].doc.user_id) {
            userList.push(doclist.rows[i].doc);
        } else {
            phoneList.push(doclist.rows[i].doc);
        };
    };
    if (type == "user") {
        return userList;
    } else {
        return phoneList;
    }
};

async function findByStringKey(stringKey) {
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
                {
                    userID: { "$elemMatch": { "$eq": stringKey.slice(0, endStr) } }
                },
                {
                    brand: { "$eq": stringKey.slice(0, endStr) }
                },
                {
                    model: { "$elemMatch": { "$eq": stringKey.slice(0, endStr) } }
                },
            ]
        },
        fields: ["_id", "user_id", "first_name", "last_name", "phone_number", "userID", "brand", "model"]
    };
    const response = await test_db.find(data);
    return response.docs;
};

async function separateLists(stringKey, type) {
    const docList = await findByStringKey(stringKey);

    var userList = [];
    var phoneList = [];

    for (let i = 0; i < docList.length; i++) {
        if (docList[i].user_id) {
            userList.push(docList[i]);
        } else {
            phoneList.push(docList[i]);
        };
    };
    if (type == "user") {
        return userList;
    } else {
        return phoneList;
    };
};

async function createUserList(arr) {
    var userList = [];
    for (let i = 0; i < arr.length; i++) {
        let item = await separateLists(arr[i], "user")
        userList.push(item[0])
    };
    return userList;
};

const userType = new GraphQLObjectType({
    name: "Friend",
    fields: () => ({
        _id: { type: GraphQLID },
        user_id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        phone_number: { type: new GraphQLList(GraphQLString) },
        phone_model: {
            type: new GraphQLList(brandType),
            resolve(source, args) {
                return separateLists(source.user_id, "phone");
            },
        },
    }),
});

const brandType = new GraphQLObjectType({
    name: "Brand",
    fields: () => ({
        _id: { type: GraphQLID },
        userID: { type: new GraphQLList(GraphQLString) },
        brand: { type: GraphQLString },
        model: { type: GraphQLString },
        users: {
            type: new GraphQLList(userType),
            resolve(source, args) {
                return createUserList(source.userID);
            },
        },
    }),
});

// Pagination scheme should be here

const queryRootType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        /*findByStringKey: {
            type: new GraphQLList(friendType), // ¬ќ«ћќ∆Ќќ Ќјƒќ ѕ≈–≈ƒ≈Ћј“№, чтобы поиск был во всех доках и дл€ всех типов ??UNION?? или как-то иначе объединить типы??
            args: { stringKey: { type: GraphQLString } },
            resolve(source, { stringKey }) {
                return findByArbitraryStringKey(stringKey)
            }
        },*/
        userByID: {
            type: userType,
            args: { id: { type: GraphQLID } },
            resolve(source, { id }) {
                return getCard(id);
            }
        },
        userByName: {
            type: new GraphQLList(userType),
            args: { name: { type: GraphQLString } },
            resolve(source, { name }) {
                return findByStringKey(name);
            }
        },
        userByFullName: {
            type: new GraphQLList(userType),
            args: { fullName: { type: GraphQLString } },
            resolve(source, { fullName }) {
                return findByFullName(fullName);
            }
        },
        userByPhoneNum: {
            type: new GraphQLList(userType),
            args: { num: { type: GraphQLString } },
            resolve(source, { num }) {
                return findByStringKey(num);
            }
        },
        users: {
            type: new GraphQLList(userType),
            resolve() {
                return viewAll("user");
            }
        },
        phoneByID: {
            type: brandType,
            args: { id: { type: GraphQLID } },
            resolve(source, { id }) {
                return getCard(id);
            }
        },
        phoneByBrand: {
            type: new GraphQLList(brandType),
            args: { brand: { type: GraphQLString } },
            resolve(source, { brand }) {
                return findByStringKey(brand);
            }
        },
        phones: {
            type: new GraphQLList(brandType),
            resolve() {
                return viewAll("phone");
            }
        },
    }),
});

const appSchema = new GraphQLSchema({
    query: queryRootType,
});

module.exports = appSchema;