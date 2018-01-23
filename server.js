var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('node-tweet-stream');
 
var t = new Twitter({
  consumer_key: 'j9DgZ5izzYW0irC8GXtAbMEvx',
  consumer_secret: 'x4Y0Bd1Kbb96GHXl5AbdcHWFMij7c2aY6OujlzNRYnoySnybxF',
  token: '714428773572149248-wBus6IStmVoQQSa07dyutwXRj4rAbCs',
  token_secret: 'yF8K4dzrvJgfWLaBM8kOpIHKFuDkwt7gAEGK1bBACnJj7'
});
 
var searchParameterList = [];
io.on('connection', function(socket){    
    io.emit("searchParameterList",searchParameterList);

    socket.on('removeSearchParam', function(data){
       var index = searchParameterList.indexOf(data);    
        if (index !== -1) {
            searchParameterList.splice(index, 1);
        }
        io.emit("searchParameterList",searchParameterList);
        t.untrack(data);        
    });
    socket.on('addSearchParam', function(data){
                             
        searchParameterList.push(data);
        io.emit("searchParameterList",searchParameterList);
        t.track(data);
    });
    
    t.on('tweet', function (tweet) {
        socket.emit('tweetData', {
            user: tweet.user.screen_name,
            text: tweet.text        
          });        
      })
      
      t.on('error', function (err) {
        console.log('Oh no')
      })            
});


app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

