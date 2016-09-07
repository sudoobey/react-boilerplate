const co = require('co');
const webpack = require('webpack');
const PassThrough = require('stream').PassThrough;

const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
const webpackDevMiddleware = require('webpack-dev-middleware')(
    compiler,
    {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true},
        lazy: false,
        headers: {'Access-Control-Allow-Origin': '*'},
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        }
    }
);

function wrapDevMiddleware(expressMiddleware) {
    return co.wrap(function*(ctx, next) {
        expressMiddleware(ctx.req, {
            setHeader: function() {
                if (!ctx.res.finished) {
                    ctx.set.apply(ctx, arguments);
                }
            },
            end: (content) => {
                if (!ctx.res.finished) {
                    ctx.body = content;
                }
            }
        }, next);
    });
}

function wrapHotMiddleware(expressMiddleware) {
    return co.wrap(function*(ctx, next) {
        let stream = new PassThrough();
        expressMiddleware(ctx.req, {
            write: function() {
                if (!ctx.res.finished) {
                    ctx.body = stream;
                    stream.write.apply(stream, arguments);
                }
            },
            writeHead: (state, headers) => {
                if (!ctx.res.finished) {
                    ctx.state = state;
                    ctx.set(headers);
                }
            }
        }, next);
    });
}

module.exports = {
    webpackDevMiddleware: wrapDevMiddleware(webpackDevMiddleware),
    webpackHotMiddleware: wrapHotMiddleware(webpackHotMiddleware)
};
