Session.setDefault( 'locationSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/locations/', {
  name: 'locationsListPage',
  template: 'locationsListPage',
  data: function () {
    return Locations.find();
  }
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.locationsListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/location' );
  },
  'click .locationItem': function () {
    Router.go( '/view/location/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #locationSearchInput': function () {
    Session.set( 'locationSearchFilter', $( '#locationSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.locationsListPage.rendered = function () {
  console.log( 'trying to update layout...' );

  Template.appLayout.delayedLayout( 20 );
};


Template.locationsListPage.helpers( {
  hasNoContent: function () {
    if ( Locations.find()
      .count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  locationsList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return Locations.find( {
      'profile.fullName': {
        $regex: Session.get( 'locationSearchFilter' ),
        $options: 'i'
      }
    } );
  }
} );
