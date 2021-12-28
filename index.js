let express		=		require("express");
let app			=		express();
let path 		=		require("path")
let axios 		= 		require('axios');
let cheerio 	= 		require('cheerio');
let monk		=		require("monk")

//set database
let url = "mongodb+srv://pokman2018:lion4333@cluster0.0q5we.mongodb.net/YOURBLOG?authSource=admin&replicaSet=atlas-qcra61-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
let db = monk(url);
db.then(()=> {
	console.log("CONNECTION DATABASE")
})
let boy = db.get("boyweb");

//set view
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"view"))
app.use(express.static(path.join(__dirname,"public")))
//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))



app.get('/api',(req,res)=> {
		
			axios.get("https://coinmarketcap.com/th/currencies/bombcrypto/").then(doc=> {
			let $ = cheerio.load(doc.data)
			let value = $(".priceValue > span").text()
			let lowvalue = $(".dBJPYV > span").text()
			
			let onlynum = value.replace("฿","")
			return res.status(200).json({api:onlynum,landh:lowvalue})
			})
		
})



//router
app.get("/",(req,res)=> {
	boy.find({}).then(doc=> {
		res.render("index",{fail:"",list:doc})
	})
	
})
app.post("/",(req,res)=> {
	let start = req.body.start;
	let numhero = req.body.numhero;
	let statushero = req.body.statushero;
	let date = req.body.date;
	let bd = req.body.bd;
	let total = req.body.total;

	//check form
	if (!start || !numhero || !statushero || !date || !bd || !total) {
		console.log("FAIL")
		res.render("index",{fail:"กรุณาใส่ขอมูลให้ครบ"})
	}else{
		boy.insert({start:start,numhero:numhero,statushero:statushero,date:date,bd:bd,total:total}).then(()=> {
			console.log("INSERT TO DATABASE")
		})
		res.redirect('/')
	}
})

//edit
app.get('/edit:id',(req,res)=> {
	let ii = req.params["id"]
	let id = ii.replace(":","")
	boy.findOne({_id:id}).then(doc => {
		res.render("edit",{fail:"",list:doc})
	})
	
})
app.post('/edit:id',(req,res)=> {
	let ii = req.params["id"]
	let id = ii.replace(":","")
	let start = req.body.start;
	let numhero = req.body.numhero;
	let statushero = req.body.statushero;
	let date = req.body.date;
	let bd = req.body.bd;
	let total = req.body.total;

	if (!start || !numhero || !statushero || !date || !bd || !total) {
		console.log("FAIL")
		boy.findOne({_id:id}).then(doc=> {
			res.render("edit",{fail:"กรุณาใส่ขอมูลให้ครบ",list:doc})
		})
	}else {

	boy.findOneAndUpdate({_id:id},{ $set: { start:start,numhero:numhero,statushero:statushero,date:date,bd:bd,total:total } }).then(()=> {
		res.redirect("/")
	})
}

})


//delete
app.get("/del:id",(req,res)=> {
	let ii = req.params["id"]
	let id = ii.replace(":","")
	boy.findOneAndDelete({_id:id}).then(()=> {
		res.redirect('/')
	})
})

//start
app.listen(5000,()=> {
	console.log(`START SERVER AT PORT 3000`)
})