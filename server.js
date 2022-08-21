const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const user = require("./models/user");
// const timetable = require("./models/timtable");
// const todos = require("./models/todos");

 const ejs = require("ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/delta-hackathon");

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/mainpage",(req,res)=>{
  objectid=req.query.objectid
  res.render("mainpage.ejs", { objectid });

})
// app.get("/mainpage/edit",(req,res)=>{
//   object=req.query.object
//   objectid=object.objectid
//   list=object.list2
//   res.render("mainpage1.ejs",{objectid},{list})
// })


app.post("/login", async (req, res) => {
  const name = req.body.username;
  const password = req.body.psw;

  const currentuser = await user.findOne({ username: name });

  if (currentuser === null) {
    console.log("invalid username");
    res.redirect("/login");
  } else {
    console.log(password);
    console.log(currentuser.password);
    if (await bcrypt.compare(password, currentuser.password)) {
      const objectid = currentuser.id;
      console.log("success");
      // res.send("hello")

      res.redirect("/mainpage?objectid=" + objectid)
    } else {
      res.send("wrong pasword");
    }
  }
});
app.post("/signup", async (req, res) => {
  try {
    const hashedpassword = await bcrypt.hash(req.body.psw, 10);
    const name = req.body.username;

    console.log(hashedpassword);
    console.log(name);

    const response = await user.create({
      username: name,
      password: hashedpassword,
    });

    console.log("user created successfully", response);
    res.redirect("/login");
  } catch (error) {
    if (error.code === 11000) {
      console.log("username alredy in use");
    }
    console.log(error);
    res.redirect("/signup");
    console.log("failed");
  }
});

app.get("/booklist/:objectid", async (req, res) => {

  objectid=req.params.objectid
  console.log(scheme.authorname)

  res.render("booklist.ejs")
});

app.get("/addbook/:objectid", async (req, res) => {
  objectid=req.params.objectid
  await console.log(objectid);

  res.render("addbookpage.ejs",{objectid:objectid})
});

app.post("/bookadded/:objectid",async (req,res)=>{
  objectid=req.params.objectid
  loop = req.body.counter;
  console.log();
  list = [];
  count = "1";
  
  list = Object.values(req.body);
  console.log(list);

  list.pop();
  pair = [];
  console.log(list.length);

  pair.push(list[0]);
  pair.push(list[list.length - 1]);
  list[0] = pair;
  list.pop();
  bookname = [];
  authorname = [];

  list2 = list;

  for (i = 0; i < list.length; i++) {
    bookname.push(list[i][0]);
  }
  for (i = 0; i < list.length; i++) {
    authorname.push(list[i][1]);
  }
  console.log(bookname);
  // console.log(typesarr);


  
  const response1 = await user.findByIdAndUpdate(
     objectid,
     {bookname:bookname
  });
  const response2 = await user.findByIdAndUpdate(
    objectid,
     {authorname:authorname
  });
  const response3 = await user.findByIdAndUpdate(
    objectid,
     {list:list2
  });

  // object={
    // objectid:objectid,
    // list:list2
  // }

  res.redirect("/mainpage?objectid=" + objectid)



})


app.listen(port);
