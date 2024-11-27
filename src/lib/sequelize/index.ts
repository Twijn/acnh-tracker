import { Sequelize } from 'sequelize';

import { DATABASE_URL } from '$env/static/private';

const sequelize = new Sequelize(DATABASE_URL);

// const models = [
// ];
//
// for (const init of models) {
//     init(sequelize);
// }

(async function() {
    try {
        console.log("Connecting to MariaDB...");
        await sequelize.authenticate();
        console.log("Connected to MariaDB! Syncing...");
        await sequelize.sync();
        console.log("Syncing completed!");
    } catch(err) {
        console.error("Failed to connect to MariaDB");
        console.error(err);
    }
})();
