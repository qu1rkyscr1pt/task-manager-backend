const { sequelize } = require('./src/models');
const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  console.log('[jest.setup] Running migrations before tests...');
  
  const configPath = path.resolve(__dirname, 'src', 'config', 'database.js');
  execSync(`npx sequelize-cli db:migrate --env development --config="${configPath}"`, {
    stdio: 'inherit'
  });

  await sequelize.sync(); // Optional, adds safety
};
