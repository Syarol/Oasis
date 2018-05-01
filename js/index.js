
for (item of document.querySelectorAll('.arrival-item-inf h3')){
    if (item.textContent.length > 12) item.style.fontSize  = '1em'
}


var closeModal = document.getElementById('close-modal');

closeModal.addEventListener('click', function(){
    document.getElementById('bestseller_modal_wrapper').style.display = 'none';
})

document.getElementById('open_bestseller_modal').addEventListener('click', function(){
    document.getElementById('bestseller_modal_wrapper').style.display = 'flex';
})

window.onclick = function(e) {
  if (e.target == document.getElementById('bestseller_modal_wrapper')) {
    document.getElementById('bestseller_modal_wrapper').style.display = 'none';
  }
}; 