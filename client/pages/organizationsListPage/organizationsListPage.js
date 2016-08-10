Session.setDefault( 'organizationSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/organizations/', {
  name: 'organizationsListPage',
  template: 'organizationsListPage',
  data: function () {
    return Organizations.find();
  }
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.organizationsListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/organization' );
  },
  'click .organizationItem': function () {
    Router.go( '/view/organization/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #organizationSearchInput': function () {
    Session.set( 'organizationSearchFilter', $( '#organizationSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.organizationsListPage.rendered = function () {
  console.log( 'trying to update layout...' );

  Template.appLayout.delayedLayout( 20 );
};


Template.organizationsListPage.helpers( {
  hasNoContent: function () {
    if ( Organizations.find()
      .count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  organizationsList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return Organizations.find( {
      'profile.fullName': {
        $regex: Session.get( 'organizationSearchFilter' ),
        $options: 'i'
      }
    } );
  }
} );
