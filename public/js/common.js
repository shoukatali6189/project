

let allLikeBtn = document.querySelectorAll('.like-btn');

async function likeButton(productId , btn) {
    try {

        // first implement the css tna upadte in db
        if(btn.children[0].classList.contains('fa-regular')){
            btn.children[0].classList.remove('fa-regular')
            btn.children[0].classList.add('fa-solid')
        }else{
    
            btn.children[0].classList.remove('fa-solid')
            btn.children[0].classList.add('fa-regular')
        }
        
    let response = await axios({    
        method: 'post',
        url: `/products/${productId}/like`,
        headers: { 'X-Requested-With': 'XMLHttpRequest' } // if you not define the heder --> the response did't know thta which request you send xhr-request or not --> for check usr ("req.xhr") in you requested sended place --> productAPI.js or middelewere "isLogin"       
    })

    }
    catch(e) {
        window.location.replace('/login')
        // res.status(500).render('error' , {err:e.message}); --> we can't use this because did't have access of req and res obje       
    }
    
}

for (let btn of allLikeBtn) {
    
    btn.addEventListener('click', () => {
        
        // check the common.js line-18
        let productId = btn.getAttribute('product-id')
        likeButton(productId,btn);      
        
    })
};