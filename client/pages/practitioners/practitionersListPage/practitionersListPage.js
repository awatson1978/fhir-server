Session.setDefault( 'practitionerSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/practitioners/', {
  name: 'practitionersListPage',
  template: 'practitionersListPage',
  data: function () {
    return Practitioners.find();
  }
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.practitionersListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/practitioner' );
  },
  'click .practitionerItem': function () {
    Router.go( '/view/practitioner/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #practitionerSearchInput': function () {
    Session.set( 'practitionerSearchFilter', $( '#practitionerSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.practitionersListPage.rendered = function () {
  console.log( 'trying to update layout...' );

  Template.appLayout.delayedLayout( 20 );
};


Template.practitionersListPage.helpers( {
  hasNoContent: function () {
    if ( Practitioners.find()
      .count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  practitionersList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return Practitioners.find( {
      'name.text': {
        $regex: Session.get( 'practitionerSearchFilter' ),
        $options: 'i'
      }
    } );
  }
} );
