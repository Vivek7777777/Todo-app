//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//including date.js 
// const date = require(__dirname + "/date.js");   
// console.log(date);

const app = express();

app.set("view engine", "ejs");//using ejs

app.use(bodyParser.urlencoded({extended: true}));
//including static css file in public folder
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser: true})

//creating schema
const itemsSchema = {
    name: String
}

//creating model 
const Item = mongoose.model("Item", itemsSchema)

//creating the document
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add new item"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item.>"
});

const defaultItems = [item1,item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

//inserting default items in the collection

app.get("/" , function (req , res) {
    // res.send("hello");
    // let day = date;//For single exported function
    // let day = date.getDate; // when multiple functoins are exported
    
    // const foundItems = Item.find({},homepage(foundItems));
    // function homepage(foundItems){
    //     res.render("list", {listTitle: "Today", newListItems: foundItems});
    // }
    Item.find({}).then(function(foundItems){
        if(foundItems.length === 0){    
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });

});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    // if(customListName != "favicon.ico"){
        List.findOne({name: customListName}).then(function(foundList){                                                                                         
            if(foundList){    
                // console.log("Exist");

                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
            else{
                // console.log("Do not exist");

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();

                res.redirect("/" + customListName);
            }
        });
    // }
    

});

app.post("/" , function (req, res) {
    const itemName = req.body.newItem;
    const listName= req.body.list;
     
    const item = new Item({
        name: itemName
    });

    //if item is added to homepage it will be added to it else it will be added to working directory
    if(listName === "Today"){
        item.save();
        res.redirect("/");  
    }
    else{
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
    
    // item.save();
    
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId).then(console.log("deleted task"));
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList) {
            res.redirect("/" + listName);
        });    
    }

});


app.get("/about", function(req, res){
    res.render("about");
})


app.listen(3000 , function () {
    console.log("server started on port 3000");
});