import { Navigation } from 'common-components';

export class AppNavigations {

    static modules = [
        new Navigation({ name: 'APP.MAIN', url: '/main', icon: 'home' }),
        new Navigation({ name: 'APP.MAP', url: '/map', icon: 'map' }),
        new Navigation({ name: 'APP.LOCALITIES', url: '/localities', icon: 'place' }),
        new Navigation({ name: 'APP.USERS', url: '/users', icon: 'group', onlyAdmin: true }),
        new Navigation({ name: 'APP.SENSORS_SETTING', url: '/sensors', icon: 'settings', onlyAdmin: true }),

    ];

    static modulesService = [
        new Navigation({ name: 'APP.MAIN', url: '/main', icon: 'home' }),
        new Navigation({ name: 'APP.MAP', url: '/map', icon: 'map' }),
        new Navigation({ name: 'APP.LOCALITIES', url: '/localities', icon: 'place' }),
        new Navigation({ name: 'APP.SENSORS_SETTING', url: '/sensors', icon: 'settings' }),
    ];


    static application = [

    ];

    static personal = [
   // new Navigation({ name: 'APP.PROFILE', url: '/user', icon: 'person_pin' }),
        new Navigation({ name: 'AUTH.LOGOUT', url: '/logout', icon: 'power_settings_new' }),
    ];

}
