const IS_PROD = process.env.NODE_ENV !== 'development';
const {resolve} = require('path');

const cfg = {};
cfg.STYLE_NAME_TEMPLATE = '[name]_[local]_[hash:base64:3]';
cfg.FILENAME_TEMPLATE = IS_PROD ? '[name].[hash]' : '[name]';
cfg.FILENAME_CHUNK_TEMPLATE = IS_PROD ? '[name].chunk.[hash]' : '[name].chunk';
cfg.OUTPUT_DIR_WEB = resolve('./dist-web/');  // also hardcoded in package.json
cfg.OUTPUT_DIR_NODE = resolve('./dist-node/');  // also hardcoded in package.json
cfg.NODE_BUNDLE_FILENAME = 'node-main.js';
cfg.NODE_BUNDLE = resolve(cfg.OUTPUT_DIR_NODE, cfg.NODE_BUNDLE_FILENAME);
cfg.INDEX_TMPL_FILENAME = 'index.tmpl.html';
cfg.INDEX_TMPL = resolve('./view/', cfg.INDEX_TMPL_FILENAME);
cfg.INDEX_TMPL_BUILDED = resolve(cfg.OUTPUT_DIR_WEB, cfg.INDEX_TMPL_FILENAME);

module.exports = cfg;
