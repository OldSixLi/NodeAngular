for(var i=0;i<10;i++){
  setTimeout((function(j){
      return function(){
         console.log(j)
      }
  })(i),20)
}
