const fs = require('fs');
const yaml = require('js-yaml');

const defaultConfig = {
    name: "hash-default-name",
    port: 3000,
    headers: {},
};

module.exports = (app) => {
    try {
        let config = yaml.load(fs.readFileSync(app.initFile, 'utf8'));
        return config;
    } catch (e) {
        console.error(
            'Config -> loading main config failed, make sure init.yaml is exists and have correct values'
        );
        console.error('Config -> Falling back to default config');
        return defaultConfig;
    }
};
