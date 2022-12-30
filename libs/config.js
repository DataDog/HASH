const fs = require('fs')
const yaml = require('js-yaml');
const log = require('./log')

const defaultConfig = {
    port:3000,
    headers: {} 
}

module.exports = (configFile) => {
    try {
        let config = yaml.load(fs.readFileSync(configFile, 'utf8'));
        log('Config', 'loading main config')
        return config;
    } catch (e) {
        log('Config', 'loading main config failed, make sure init.yaml is exists and have correct values', 'error')
        log('Config', 'Falling back to default config', 'warning')
        return defaultConfig;
    }
}