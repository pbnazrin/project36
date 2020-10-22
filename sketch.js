//Create variables here
var dog,happyDog,database,foodS,foodStock;
var sadDog,garden,bedroom,washroom;
var fedTime,lastFed;
var foodObj;
var gameState,readState;
function preload()
{
  //load images here
  doggyHappy = loadImage("images/happydog.png")
  doggy = loadImage("images/Dog.png");
 
  garden= loadImage("images/Garden.png");
  bedroom= loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  dog = createSprite(500,300,50,50);
  dog.addImage(doggy);
  dog.scale= 0.3;

    
  foodStock = database.ref('Food');
  foodStock.on("value",readStock,showError)
  
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  fedtime = database.ref('FeedTime');
  fedtime.on("value",function(data){
  lastFed = data.val();
})

}


function draw() {  
//background(46,139,87);
//foodObj.display();

currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
 feed.show();
 addFood.show();
 dog.addImage(doggy);
}
  //add styles here
  
 
drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(doggyHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour(),
    gameState : "Hungry"
  })
}
//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })

}
/*function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update(
    {
      Food : x
    }
  )
}*/

function showError(){
  console.log("ERROR");
}

