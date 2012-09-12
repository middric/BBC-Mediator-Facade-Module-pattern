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
            name: "pageMediator",
            exclude: [
                'lib/require/require'
            ]
        }
    ],
    uglify: {
        no_mangle: true
    },
    inlineText: true,
    inlineJSON: true,
    preserveLicenseComments: false
})