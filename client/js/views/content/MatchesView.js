define([
	"jquery",
	"underscore",
	"backbone",
	"globals",
	"moment",
	"collections/MatchesCollection",
	"views/content/MatchRowView",
	"views/content/UpComingMatchesView",
	"text!templates/content/MatchesTemplate.html"
], function($, _, Backbone, Globals, moment, MatchesCollection, MatchRowView, UpComingMatchesView, MatchesTemplate){

	var MatchesView = Backbone.View.extend({
		el: "#matches-container",
		template:  _.template(MatchesTemplate),

		initialize: function(options) {
			var that = this;
			this.$el.html(this.template);

			this.matches = new MatchesCollection({
								isResults: false,
								isUpcoming: true
							});
		},

		render: function(collection){
			var that = this;
			this.matchRowViews = [];
			this.upComingMatchesView = [];

			this.matches.fetch({
				success: function(collection, response, options){
					that.matchesCollection = collection;
					if (that.matchesCollection.models.length) {
						var todaysMatches = [];
						var upcomingMatches = [];
						
						_.each(that.matchesCollection.models, function(model) {
							if (moment(Date.parse(model.get("date"))).format('MMMM Do YYYY') == moment.utc().format('MMMM Do YYYY')) {
								todaysMatches.push(model);
							}
							else {
								upcomingMatches.push(model);
							}
						});

						if (todaysMatches.length == 0) {
							that.$el.find("#matches-row-container").html("<p>There are no matches to display.</p>");
						}
						else {
							_.each(todaysMatches, function(matchModel) {
								var matchRowView = new MatchRowView({
													model:matchModel,
													parent_el : that.$el.find("#matches-row-container")
												});
								matchRowView.render();
								that.matchRowViews.push(matchRowView);
							});

						}

						if (upcomingMatches.length == 0) {
							that.$el.find("#upcoming-matches-container").html("<p>There are no matches to display.</p>");
						}
						else {
							var upcomingMatchesView = new UpComingMatchesView({
														collection: upcomingMatches,
														parent_el: that.$el.find("#upcoming-matches-container")
													});
							upcomingMatchesView.render();
							that.upComingMatchesView.push(upcomingMatchesView);
						}
					}
					else {
						that.$el.find("#matches-row-container").html("<p>There are no matches to display.</p>");
					}
				},
				error: function(response) {
					console.log("Error");
				}
			});
		},

		close : function(){

			_.each(this.matchRowViews, function(view) {
				view.close();
			});

			_.each(this.upComingMatchesView, function(view) {
				view.close();
			});

			this.undelegateEvents();
			this.remove();
		}
	});

	return MatchesView;
});