const fs = require('fs');
const yaml = require('js-yaml');

const defaultConfig = {
    port: 3000,
    headers: {},
};

module.exports = (app) => {
    try {
        let config = yaml.load(fs.readFileSync(app.initFile, 'utf8'));
        app.logger.info('Config -> loading main config');
        return config;
    } catch (e) {
        app.logger.error(
            'Config -> loading main config failed, make sure init.yaml is exists and have correct values'
        );
        app.logger.error('Config -> Falling back to default config');
        return defaultConfig;
    }
};
