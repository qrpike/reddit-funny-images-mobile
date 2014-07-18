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
			this.toFetch = 10;
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
			_.bindAll(this, 'render', 'addPost', 'getCol', 'checkIfMobile');
			this.mobile = this.checkIfMobile();
			this.posts = posts;
			this.render();
			this.posts.on('add', this.addPost);
			console.log('Mobile:', this.mobile);
		},
		checkIfMobile: function(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
		},
		addPost: function( post ){
			if(post.isImage()){
				var self = this;
				var view = new PostView( post );
				var cb = function(){
					self.getCol().append( view.render().el );
				}
				if(self.mobile){
					cb = function(){
						self.$el.find('#col1').append( view.render().el );
					}	
				}
				view.buildImage(cb);
			}
		},
		getCol: function(){
			var x = 1;
			var chosen = undefined;
			var chosenHeight = 0;
			while(x<7){
				var col = this.$el.find('#col'+x);
				var height = col.height();
				if( height < chosenHeight ){
					chosen = col;
					chosenHeight = height;
				}
				if( chosen == undefined ){
					chosen = col;
					chosenHeight = height;
				}
				x++;
			}
			return chosen;
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
			_.bindAll(this, 'render', 'buildImage');
			this.img = null;
		},
		buildImage: function( callback ){
			this.img = document.createElement('img');
			this.img.onload = callback;
			this.img.src = this.attributes.data.url;
		},
		render: function(){
			this.$el.html( this.template( this ) );
			return this;
		}
	})


	var p = new Posts();
	var v = new MainView( p );

});