ampersand-orchestrate
=====================

```js
var db = require('ampersand-orchestrate')(token);
var Model = db.Model;
var Collection = db.Collection;

var WallPost = Model.Event.extend({
  type: 'wallPost',
  props: {
  
  }
})

var Movie = Model.extend({
  collection: 'movies',
  props: {
    title: 'string'
  }
})

var LikedMovies = Collection.Graph.extend({
  relationship: 'likes',
  model: Movie
})

var User = Model.extend({
  collection: 'users',
  props: {
    name: 'string'
  },
  collections: {
    wallPosts: Collection.Events.extend({ model: WallPost }),
    likedMovies: LikedMovies
  }
})

var me = new User({ key: 'agon' })

me.get('wallPosts');
==> db.newEventBuilder().from('users', 'agon').type('wall_post')

var moviesIlike = me.get('likedMovies'); 
==> db.newGraphReader().get().from('users', 'agon').related('likes')

moviesIlike.add({ title: 'Titanic' }) 
==> db.newGraphBuilder().create().from('users', 'agon').related('likes').to('movies', 'Titanic')
```


