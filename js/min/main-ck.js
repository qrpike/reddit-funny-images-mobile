$(function(){var t=Backbone.Model.extend({initialize:function(t){_.bindAll(this,"isImage")},isImage:function(){return-1!=this.attributes.data.url.indexOf("jpg")?!0:-1!=this.attributes.data.url.indexOf("png")?!0:-1!=this.attributes.data.url.indexOf("jpeg")?!0:-1!=this.attributes.data.url.indexOf("gif")?!0:!1}}),e=Backbone.Collection.extend({url:function(){return this.page++,"http://www.reddit.com/r/funny/.json?jsonp=?&page="+this.page+"&after="+this.after},model:t,parse:function(t){return this.pagesFetched++,this.after=t.data.after,t.data.children},continueFetching:function(){var t=this;t.pagesFetched<t.toFetch&&t.fetch({success:t.continueFetching})},initialize:function(){_.bindAll(this,"continueFetching","parse","url"),this.page=0,this.after="",this.toFetch=10,this.pagesFetched=0,this.fetch({success:this.continueFetching})}}),i=Backbone.View.extend({el:"#container",template:_.template($("#mainView").html()),initialize:function(t){_.bindAll(this,"render","addPost"),this.posts=t,this.render(),this.posts.on("add",this.addPost)},addPost:function(t){if(t.isImage()){var e=this,i=new n(t);e.$el.find("#postContainer").append(i.render().el)}},render:function(){return this.$el.html(this.template(this)),this}}),n=Backbone.View.extend({template:_.template($("#postView").html()),model:t,initialize:function(){_.bindAll(this,"render")},render:function(){return this.$el.html(this.template(this)),this}}),s=new e,a=new i(s)});