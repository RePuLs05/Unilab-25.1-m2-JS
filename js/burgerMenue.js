function burgerMenue(x) {

  x.classList.toggle("change");
  if(x){
    document.querySelector('.navigation-burger-menu').classList.toggle('active');
  }
  
};