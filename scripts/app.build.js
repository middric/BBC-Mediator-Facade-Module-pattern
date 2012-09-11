({
    appDir: "../",
    baseUrl: "scripts",
    dir: "../built",
    paths: {
        text: 'lib/require/plugins/text',
        json: 'lib/require/plugins/json',
        jquery: 'empty:',
        signals: 'empty:'
    },
    modules: [
        {
            name: "pageMediator"
        }
    ],
    inlineText: true,
    preserveLicenseComments: false
})