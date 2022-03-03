const nano = require('nano')('http://admin:123@localhost:5984');
const db_name = 'vito_test';
const db = nano.db.use(db_name);

const fs = require('fs');


async function createDB(name) {
    await nano.db.create(name, function (error) {
        if (error) { return console.log(error.message, error['status-code']); }
        let fileContent = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'))
        for (let i = 0; i < fileContent.length; i++) {
            db.insert(fileContent[i])
        };
        console.log(`The DB ${db_name} was created and filled docs. Time to join server!`);
    });
};

createDB(db_name);