export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('aurelia-grid');

    aurelia.start().then(main => main.setRoot());
}
