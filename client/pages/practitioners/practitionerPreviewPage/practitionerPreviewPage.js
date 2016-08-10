
Router.map(function(){
  this.route('practitionerPreviewPage', {
    path: '/practitioner/:id',
    template: 'practitionerPreviewPage',
    data: function () {
      return Practitioners.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.practitionerPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.practitionerPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/practitioners');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/practitioners');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/practitioners');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/practitioners');
  },
  "click .practitionerId": function(){
    Router.go('/upsert/practitioner/' + this._id);
  }
});
