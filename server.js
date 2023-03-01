const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}))

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:admin@cluster0.3juyfhs.mongodb.net/?retryWrites=true&w=majority', function(에러, clinet){
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


    if(에러) return console.log(에러)

     db = clinet.db('todoapp');

    // db.collection('post').insertOne( {이름 : 'John', _id : 200}, function(에러, 결과){
    //     console.log('저장완료');
    // });


    app.listen(8080, function(){
        console.log('listening on 8080')
    });

})
//  얘네들 중요함!
app.post('/add', function(요청, 응답){
    응답.send('전송완료')
    
    db.collection('counter').findOne({name : '게시물갯수'}, function(err, result){
        console.log(result.totalPost)
        var 총게시물갯수 = result.totalPost;

        db.collection('post').insertOne( { _id : 총게시물갯수 + 1, 제목 :요청.body.title,  날짜 : 요청.body.date}, function(에러, 결과){
            console.log('저장완료');
            
            db.collection('counter').updateOne( {name:'게시물갯수'}, { $inc : {totalPost:1} }, function(err, result){
                if(err){return console.log(err)}
            })
        });

    

    });

    
});

app.get('/list', function(req, res){

    db.collection('post').find().toArray(function(err, result){
        console.log(result);
        res.render('list.ejs', { posts : result});
    });

});

app.get('/write', function(req, res){
    // res.sendFile(__dirname + '/index.ejs')
    res.render('write.ejs', {});
});

app.get('/index', function(req, res){
    // res.sendFile(__dirname + '/write.ejs')
    res.render('index.ejs', {});
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(err, result){
        console.log('삭제완료');
        res.status(200).send({ message : '성공했습니다'});
    })
});

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        console.log(result);
        res.render('detail.ejs', { data : result});
    })
})



