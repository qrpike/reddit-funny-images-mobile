$(function(){

	var Post = Backbone.Model.extend({
		initialize: function( data ){
			_.bindAll(this, 'isImage');
		},
		isImage: function(){
			if(this.attributes.data.url.indexOf('jpg') != -1)
				return true;
			if(this.attributes.data.url.indexOf('png') != -1)
				return true;
			if(this.attributes.data.url.indexOf('jpeg') != -1)
				return true;
			if(this.attributes.data.url.indexOf('gif') != -1)
				return true;
			return false;
		}
	});

	var Posts = Backbone.Collection.extend({
		url: function(){
			this.page++;
			return 'http://www.reddit.com/r/funny/.json?jsonp=?&page='+
				this.page+'&after='+this.after;
		},
		model: Post,
		parse: function( response ){
			this.pagesFetched++;
			this.after = response.data.after;
			return response.data.children;
		},
		continueFetching: function(){
			var self = this;
			if( self.pagesFetched < self.toFetch ){
				self.fetch({
					success: self.continueFetching
				});
			}
		},
		initialize: function(){
			_.bindAll(this, 'continueFetching', 'parse', 'url');
			this.page = 0;
			this.after = '';
			this.toFetch = 2;
			this.pagesFetched = 0;
			this.fetch({
				success: this.continueFetching
			});
		}
	});

	var MainView = Backbone.View.extend({
		el: '#container',
		template: _.template( $('#mainView').html() ),
		initialize: function( posts ){
			_.bindAll(this, 'render', 'addPost', 'addLoadListener');
			this.posts = posts;
			this.render();
			this.posts.on('add', this.addPost);
			this.addLoadListener();
		},
		addPost: function( post ){
			if(post.isImage()){
				var view = new PostView( post );
				this.$el.find('#postContainer').append( view.render().el );
			}
		},
		addLoadListener: function(){
			var self = this;
			var canFetch = true;
			console.log('listening for bottom');
			$(window).scroll(function() {
				if($(window).scrollTop() >= $(document).height() - $(window).height()) {
					if(canFetch){
						canFetch = false;
						console.log('Loading More');
						self.posts.fetch({
							success: function(){
								canFetch = true;
							}
						});
					}
				}
			});
		},
		render: function(){
			this.$el.html( this.template( this ) );
			return this;
		}
	});

	var PostView = Backbone.View.extend({
		template: _.template( $('#postView').html() ),
		model: Post,
		initialize: function(){
			_.bindAll(this, 'render');
		},
		render: function(){
			this.$el.html( this.template( this ) );
			return this;
		}
	});


	var p = new Posts();
	var v = new MainView( p );

});