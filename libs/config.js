const fs = require('fs')
const yaml = require('js-yaml');

const defaultConfig = {
    port:3000,
    headers: {}
}

module.exports = (configFile) => {
    try {
        let config = yaml.load(fs.readFileSync(configFile, 'utf8'));
        console.log('loading main config: success')
        return config;
    } catch (e) {
        console.log('loading main config failed, make sure init.yaml is exists and have correct values')
        console.log('Falling back to default config')
        return defaultConfig;
    }
}