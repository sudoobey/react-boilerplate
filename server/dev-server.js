const co = require('co');
const webpack = require('webpack');

const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
const webpackDevMiddleware = require('webpack-dev-middleware')(
    compiler,
    {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true},
        hot: true,
        lazy: false,
        headers: {'Access-Control-Allow-Origin': '*'},
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        }
    }
);

const PassThrough = require('stream').PassThrough;
const app = require('./index').app;

function wrap(expressMiddleware) {
    return co.wrap(function*(ctx, next) {
        let stream = new PassThrough();
        ctx.body = stream;
        ctx.status = 200;
        expressMiddleware(ctx.req, {
            write: stream.write.bind(stream),
            setHeader: ctx.set.bind(ctx),
            end: (content) => {
                ctx.body = content;
            },
            writeHead: (state, headers) => {
                ctx.state = state;
                ctx.set(headers);
            }
        }, next);
    });
}
app.use(wrap(webpackDevMiddleware));
app.use(wrap(webpackHotMiddleware));

app.listen(5000, () => console.log('Run dev server on http://localhost:5000'));
