Session.setDefault('practitionerReadOnly', true);


Router.map(function () {
  this.route('newPractitionerRoute', {
    path: '/insert/practitioner',
    template: 'practitionerUpsertPage',
    onAfterAction: function () {
      Session.set('practitionerReadOnly', false);
    }
  });

});
Router.route('/upsert/practitioner/:id', {
  name: 'upsertPractitionerRoute',
  template: 'practitionerUpsertPage',
  data: function () {
    return Practitioners.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('practitionerReadOnly', false);
  }
});
Router.route('/view/practitioner/:id', {
  name: 'viewPractitionerRoute',
  template: 'practitionerUpsertPage',
  data: function () {
    return Practitioners.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('practitionerReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.practitionerUpsertPage.rendered = function () {
  Template.appLayout.layout();
};


Template.practitionerUpsertPage.helpers({
  getName: function(){
    return this.name[0].text;
  },
  getEmailAddress: function () {
    if (this.telecom && this.telecom[0] && (this.telecom[0].system === "email")) {
      return this.telecom[0].value;
    } else {
      return "";
    }
  },
  isNewPractitioner: function () {
    if (this._id) {
      return false;
    } else {
      return true;
    }
  },
  isReadOnly: function () {
    if (Session.get('practitionerReadOnly')) {
      return 'readonly';
    }
  },
  getPractitionerId: function () {
    if (this._id) {
      return this._id;
    } else {
      return '---';
    }
  }
});

Template.practitionerUpsertPage.events({
  'click #removeUserButton': function () {
    Practitioners.remove(this._id, function (error, result) {
      if (error) {
        console.log("error", error);
      };
      if (result) {
        Router.go('/list/practitioners');
      }
    });
  },
  'click #saveUserButton': function () {
    //console.log( 'this', this );

    Template.practitionerUpsertPage.savePractitioner(this);
    Session.set('practitionerReadOnly', true);
  },
  'click .barcode': function () {
    // TODO:  refactor to Session.toggle('practitionerReadOnly')
    if (Session.equals('practitionerReadOnly', true)) {
      Session.set('practitionerReadOnly', false);
    } else {
      Session.set('practitionerReadOnly', true);
      console.log('Locking the practitioner...');
      Template.practitionerUpsertPage.savePractitioner(this);
    }
  },
  'click #lockPractitionerButton': function () {
    //console.log( 'click #lockPractitionerButton' );

    if (Session.equals('practitionerReadOnly', true)) {
      Session.set('practitionerReadOnly', false);
    } else {
      Session.set('practitionerReadOnly', true);
    }
  },
  'click #practitionerListButton': function (event, template) {
    Router.go('/list/practitioners');
  },
  'click .imageGridButton': function (event, template) {
    Router.go('/grid/practitioners');
  },
  'click .tableButton': function (event, template) {
    Router.go('/table/practitioners');
  },
  'click #previewPractitionerButton': function () {
    Router.go('/customer/' + this._id);
  },
  'click #upsertPractitionerButton': function () {
    console.log('creating new Practitioners...');
    Template.practitionerUpsertPage.savePractitioner(this);
  }
});


Template.practitionerUpsertPage.savePractitioner = function (practitioner) {
  // TODO:  add validation functions

  if (practitioner._id) {
    var practitionerOptions = {
      practitionername: $('#practitionernameInput').val(),
      emails: [{
        address: $('#practitionerEmailInput').val()
      }],
      profile: {
        fullName: $('#practitionerFullNameInput').val(),
        avatar: $('#practitionerAvatarInput').val(),
        description: $('#practitionerDescriptionInput').val()
      }
    };

    Practitioners.update({
      _id: practitioner._id
    }, {
      $set: practitionerOptions
    }, function (error, result) {
      if (error) console.log(error);
      Router.go('/view/practitioner/' + practitioner._id);
    });

    if (practitioner.emails[0].address !== $('#practitionerEmailInput')
      .val()) {
      var options = {
        practitionerId: practitioner._id,
        email: $('#practitionerEmailInput')
          .val()
      };
      Meteor.call('updateEmail', options);
    }


  } else {
    var practitionerOptions = {
      practitionername: $('#practitionernameInput').val(),
      email: $('#practitionerEmailInput').val(),
      profile: {
        fullName: $('#practitionerFullNameInput').val(),
        avatar: $('#practitionerAvatarInput').val(),
        description: $('#practitionerDescriptionInput').val()
      }
    };
    //console.log( 'practitionerOptions', practitionerOptions );

    practitionerOptions.password = $('#practitionernameInput')
      .val();
    Meteor.call('addUser', practitionerOptions, function (error, result) {
      if (error) {
        console.log('error', error);
      }
      if (result) {
        console.log('result', result);
        Router.go('/view/practitioner/' + result);
      }
    });

  }
};
