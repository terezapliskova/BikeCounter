# BikeCounter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

This app was made as PWA.
Can be also build as hybrid mobile app with Capacitor. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` (set in angular.json "outputPath" to "dist") directory. Use the `--prod` flag for a production build. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Mobile app building
For building mobile app you have to set in angular.json "outputPath" to "www", then run "start:android" or "start:ios" or "start:electron" it will build an application and open native IDE or start electron app

### Android app settings
To run android app in emulator (or connected mobile) for a first time some operations have to be done:
1. copy google-services.json to android > app
2. set icons - icons are in android > app > main > res, you can generate new ones by right click on the res folder in Android studio and select new > Image Asset. Then in AndroidManifest.xml in provider section set path to the icon <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@mipmap/ic_launcher_round" />
3. set splash screen - to set up splash screen follow this tutorial https://capacitor.ionicframework.com/docs/apis/splash-screen/ (capacitor.config.json is already set up)

If your project already contains folder ./android and previous operations were done then after running "start:android" native IDE (Android Studio) will be opened and you can just run app in emulator or install it to real mobile device.

### iOS app settings
!! it needs to be run on MacOS !!
Before running app (in native IDE) for a first time set up:
1. add GoogleService-Info.plist (downloaded from Firebase console > Project settings > iOS apps) to ios > App
2. instal cocoapods by running "sudo gem install cocoapods" then run "pod update" and then "pod install"
3. set up Firebase Authentication by following this https://github.com/baumblatt/capacitor-firebase-auth

If your project already contains folder ./ios and previous operations were done then after running "start:ios" native IDE (XCode) will be opened and you can just run app in emulator or install it to real mobile device.

## Authentication options
Default authentication is set up to be served by Firebase but it can be served by REST API 

