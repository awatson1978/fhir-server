
// Router.configure({
//   layoutTemplate: 'mainLayout'
// });

Router.route('/', {
  name: 'fhirWelcomePage',
  template: 'fhirWelcomePage'
});

Router.onBeforeAction(function () {
  if (!Meteor.loggingIn() && !Meteor.user()) {
    console.info('Not logged in.  Rerouting to sign-in page.');
    this.redirect('/entrySignIn');
  } else {
    this.next();
  }
},{
  except: [
    'homeRoute',
    'dashboardRoute',

    //errors
    'browserNotSupportedRoute',
    'pageNotFoundRoute',
    'loadingPageRoute',

    // static pages
    'appMenuRoute',
    'termsOfUseRoute',
    'marketingRoute',
    'aboutRoute',
    'landingRoute',
    'privacyRoute',
    'supportRoute',
    'infoRoute',

    'themingPage',

    // entry pages
    // TODO: move these exclusions into clinical:entry
    'entrySignUp',
    'entrySignIn',
    'forgotPassword',

    'conformanceRoute'
  ]
});


// Router.route('/oauth', {
//   name: 'authorizeRoute',
//   template: 'authorizePage'
// });
