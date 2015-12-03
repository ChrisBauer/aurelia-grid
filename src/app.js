import {Router, Redirect} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export class Home {
    constructor (router) {
        this.router = router;
        this.router.configure(config => {
            config.title = 'aurelia-grid demo site';
            config.map([
                {route: '', name:'home', moduleId: 'paths/home', nav: true, title: 'Home'}
            ]);
        });
    }
}
