({
    appDir: "../scripts",
    baseUrl: "./",
    dir: "../built",
    paths: {
        text: 'lib/require/plugins/text',
        json: 'lib/require/plugins/json',
        jquery: 'empty:',
        signals: 'empty:',
        require: 'empty:'
    },
    modules: [
        {
            name: "pageMediator"
        }
    ],
    uglify: {
        no_mangle: true
    },
    inlineText: true,
    preserveLicenseComments: false
})