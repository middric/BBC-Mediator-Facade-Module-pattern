({
    appDir: "../scripts",
    baseUrl: "./",
    dir: "../built",
    paths: {
        text: 'lib/require/plugins/text',
        json: 'lib/require/plugins/json',
        jquery: 'empty:',
        signals: 'empty:',
        require: 'empty:',
        jRespond: 'empty:'
    },
    modules: [
        {
            name: "components/showcase/showcaseMediator",
            exclude: [
                'superclasses/class',
                'superclasses/facade',
                'superclasses/mediator'
            ]
        },
        {
            name: "pageMediator",
            exclude: [
                'lib/require/require',
                'components/showcase/showcaseMediator'
            ]
        }
    ],
    uglify: {
        no_mangle: true
    },
    inlineText: true,
    inlineJSON: true,
    preserveLicenseComments: false,
    removeCombined: true
})