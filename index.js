const express = require('express'); // express js
const db = require('./connection/db.js');

const app = express();
const PORT = 5002;

let isLogin = true; // islogin

let blogs = [
				{
					title: 'Pasar Coding di Indonesia Dinilai Masih Menjanjikan',
					content: 'Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan. Berdasarkan penelitian ManpowerGroup, ketimpangan SDM global, termasuk Indonesia, meningkat dua kali lipat dalam satu dekade terakhir. Khusus di sektor teknologi yang berkembang pesat, menurut Kemendikbudristek, Indonesia kekurangan sembilan juta pekerja teknologi hingga tahun 2030. Hal itu berarti Indonesia memerlukan sekitar 600 ribu SDM digital yang memasuki pasar setiap tahunnya.',
					author: 'Ichsan Emrald Alamsyah',
					post_at: '12 Jul 2021 22:30 WIB'
				}
			]

month = [ 
                'January', 
                'February', 
                'March', 
                'April', 
                'May', 
                'June', 
                'July', 
                'August', 
                'September', 
                'October', 
                'November', 
                'December'
            ]

app.set('view engine', 'hbs'); // set template engine

app.use('/public', express.static(__dirname+'/public')); // static folder
app.use(express.urlencoded({ extended: false}));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/index', function(req, res){
	res.render('index');
});

app.get('/blog', function(req, res){

	db.connect(function(err, client, done){
		if (err) throw err

		client.query('SELECT * FROM blog_coba', function(err, result){
			if (err) throw err

			let data = result.rows

			let dataBlogs = data.map((data)=>{
				return {
					...data,
					isLogin: isLogin
					}
		})

			res.render('blog', {isLogin: isLogin, blogs: dataBlogs});
		})
	})

});

app.post('/blog', function(req, res){

	db.connect(function(err, client, done){

		let cols = [req.body.title, req.body.content];

    client.query('INSERT INTO blog_coba(title, content) VALUES($1, $2) RETURNING *', cols, function (err, result) {
        if (err) {
            console.log("Error Saving : %s ", err);
        }
        res.redirect('/blog');
    });
	})
})

app.get('/delete-blog/:index', function(req, res){

	db.connect(function(err, client, done){

	let index = req.params.index;

    client.query("DELETE FROM blog_coba WHERE id=$1", [index], function (err, rows) {
        if (err) {
            console.log("Error deleting : %s ", err);
        }
        res.redirect('/blog');
    });
})
})

app.get('/add-blog', function(req, res){
	res.render('add-blog');
});

app.get('/update-blog/:index', function(req, res){

	db.connect(function(err, client, done){

		let index = req.params.index;

    client.query('SELECT * FROM blog_coba WHERE id=$1', [index], function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        data = result.rows
	        res.render('update-blog', { blogs: data });
    	});
    });
})

app.post('/update-blog/:index', function(req, res){

	db.connect(function(err, client, done){

		let cols = [req.body.title, req.body.content, req.params.index];

    client.query('UPDATE blog_coba SET title=$1, content=$2 WHERE id=$3', cols, function (err, result) {
        if (err) {
            console.log("Error Updating : %s ", err);
        }
        res.redirect('/blog');
    });
    });
})

function getFullTime(time) {

    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    let result = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

    return result
}

// app.get('/blog-detail', function(req, res){
// 	res.render('blog-detail');
// });

app.get('/blog-detail/:index', function(req, res){

	db.connect(function(err, client, done){

		let index = req.params.index;

    client.query('SELECT * FROM blog_coba WHERE id=$1', [index], function (err, result) {
	        if (err) {
	            console.log(err);
	            res.status(400).send(err);
	        }
	        data = result.rows
	        res.render('blog-detail', { index: index, blogs: data });
    	});
    });
});

app.get('/contact-form', function(req, res){
	res.render('contact-form');
});

// app.get('/', (req, res) => {
// 	res.send('ini halaman utama');
// });

app.listen(PORT, function(){
	console.log(`Server starting on PORT: ${PORT}`);
});