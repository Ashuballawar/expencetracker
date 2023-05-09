


body=document.querySelector('body');
let form=document.querySelector("form");
ul=document.createElement('ul');
ul.setAttribute('id','list');
form.appendChild(ul);
let token=localStorage.getItem('token')
form.addEventListener('submit',localstorage);
let leaderboardList=document.getElementById('leaderboad-list')

function showPremiumUser(){
  document.getElementById('rzp-button1').style.visibility='hidden'
  document.getElementById('premium-user').innerHTML='You are premium User'
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


function showleaderboard(){
  let leaderboad=document.createElement('button')
  document.getElementById('premium-user').appendChild(leaderboad)
   
  leaderboad.innerHTML='leaderboard'
  leaderboad.id='leaderboard'
  document.getElementById('leaderboard').onclick=async function(e){
    e.preventDefault();
    leaderboardList.innerHTML="leaderboardList";
    let token=localStorage.getItem('token')
    let board=await axios.get("http://localhost:3000/premium/leaderboard",{headers:{"Authorization":token}})//expenditureData:data,userData:allUser
      board.data.forEach(element => {
        if(element){
     leaderboardList.innerHTML+=`<li>Name-${element.Name}-TotalExpence-${element.TotalCost}</li>`}
     });
   

}

}

async function download(){
  let token=localStorage.getItem('token')
    let response=await axios.get("http://localhost:3000/user/download",{headers:{"Authorization":token}})
   console.log(response.data.fileName.fileName)
    if(response.status === 200){
      fileList.innerHTML+=`<li>${response.data.fileName.fileName}</li>`
      var a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = 'myexpense.csv';
      a.click();
}}

document.getElementById('rzp-button1').onclick=async function(e){
  e.preventDefault()
  const token=localStorage.getItem('token')
  
  const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}})
 
    let options=
    {
      "key":response.data.key_id,
      "order_id":response.data.order.id,

      "handler":async function(response){
        res=await axios.post('http://localhost:3000/purchase/premiummembership',{        
        order_id:options.order_id,
          payment_id:response.razorpay_payment_id
        },{headers:{"Authorization":token}})
        alert('You are a Premium User Now')
        localStorage.setItem('token', res.data.token)
        showPremiumUser();
        showleaderboard();
       


      }
      
    }
    const rzpl=new Razorpay(options)
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed',async function(response){
      console.log(response)
     
     let confirmation=await axios.post('http://localhost:3000/purchase/premiummembershipfailed',{        
        order_id:options.order_id,
          payment_id:response.razorpay_payment_id
        },{headers:{"Authorization":token}})
        alert(confirmation.data.message)
    })
}




async function localstorage(e){
    e.preventDefault(); 
    console.log('hissb')
    let expence={
        amount:e.target.amount.value,
        description:e.target.description.value,
       category:e.target.category.value,
      // token:localStorage.getItem('token')
       
       
    }
    console.log(expence)
    if(expence.category=='Select'){
        alert('plz choose categery')
      }
      else{
    
    try {     
      
    
      res=await axios.post("http://localhost:3000/user/addData",expence,{headers:{'Authorization':token}})
      console.log('res=====>',res)
      printuser(res.data,res.data._id);


   } catch (err) {
    console.log(err);
    document.body.innerHTML=document.body.innerHTML+`<h6>something went wrong</h6>`
   }      
    
   
}
   
    
    }
    

async function printuser(expence,m){
    document.getElementById('amount').value="";
    document.getElementById('description').value="";
    document.getElementById('category').value="Select";

    li=document.createElement('li');
   
   
   let reverse;
//await axios.get(`https://crudcrud.com/api/6702c71e62124de98339f206741442e1/expencetracker/${m}`)
  reverse=expence;
    li.id=m;
  li.appendChild( document.createTextNode(reverse.amount+"-"+reverse.description+"-"+reverse.category));
  
 delbtn=document.createElement('button');
 delbtn.value='delete';
 delbtn.appendChild(document.createTextNode('delete'))
 edit=document.createElement('button');
 edit.value='edit';
 edit.style.height='30px';
   edit.style.width='40px';
   delbtn.style.height='30px';
   delbtn.style.width='40px';
   delbtn.style.margin='5px';
   delbtn.style.padding='0px';
   delbtn.style.border='2px solid black';
   delbtn.style.fontSize='12px';
 edit.appendChild(document.createTextNode('edit'));
 delbtn.className='btn btn-danger  float-right delete' ;
   edit.className='btn btn-dark float-right edit';
   edit.style.padding='3px';
 li.appendChild(delbtn);
 li.appendChild(edit); 
 ul.appendChild(li);
}
ul.addEventListener('click',deleteitem);

//deleting item
async function deleteitem(e){
    e.preventDefault();
    if(e.target.classList.contains('delete')){
        li=e.target.parentElement;
       // localStorage.removeItem(li.id);
       try {
        let token=localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/user/deleteData/${li.id}`,{headers:{'Authorization':token}})
        console.log("deleted successfully")
        ul.removeChild(li);
       } catch (error) {
        document.body.innerHTML=document.body.innerHTML+`<h6>something went wrong</h6>`
        console.log(error);
      
         
       } 
      
}}



ul.addEventListener('click',edititem)
  async function edititem(e){
    let token=localStorage.getItem('token')
    e.preventDefault();
    if(e.target.classList.contains('edit')){
        li=e.target.parentElement;
        try {
            let res=await axios.get(`http://localhost:3000/user/getdata/${li.id}`,{headers:{'Authorization':token}})
            reverse=res.data;
            document.getElementById('amount').value=reverse.amount;
            document.getElementById('description').value=reverse.description;
            document.getElementById('category').value=reverse.category;
            ul.removeChild(li);
            await axios.delete(`http://localhost:3000/user/deleteData/${li.id}`,{headers:{'Authorization':token}})
        } catch (err) {
            document.body.innerHTML=document.body.innerHTML+`<h6>something went wrong</h6>`
            console.log(err)
        }        
    }}
    
    let fileList=document.getElementById('listOfFile')
    window.addEventListener('DOMContentLoaded',reload);
    async function reload(e){
      let res;
      e.preventDefault();
        try {

           const token=localStorage.getItem('token')
           const decodeToken=parseJwt(token)
           const ispremiuruser=decodeToken.ispremiuruser
           if(ispremiuruser){
            showPremiumUser();
            showleaderboard();
           }
            res=await axios.get("http://localhost:3000/user/getdata",{headers:{'Authorization':token}});
             console.log(res)
                    server=res.data.data;
               console.log(res)
            server.forEach(element => {
              
                  printuser(element,element._id);
            })   
            
            
        } catch (error) {
          console.log(error)
            // document.body.innerHTML=document.body.innerHTML+`<h6>No data found</h6>`
            
        }  
       
       
    }



    window.addEventListener('DOMContentLoaded',reload1);
   
    async function reload1(e){
      let res;
      fileList.innerHTML='<h5>downladed Files</h5>';
      e.preventDefault();
        try {
            sizeofpage=localStorage.getItem('pagesize')||5
            document.getElementById('sizeofpage').value= sizeofpage
           const token=localStorage.getItem('token')
          
            res=await axios.get(`http://localhost:3000/user/getdata?pagesize=${sizeofpage}`,{headers:{'Authorization':token}});
           
            
                    server=res.data.data;
               console.log(res)
           
            let pagitationbutton=document.getElementById('pagitation')
            pagitationbutton.innerHTML="";
            res.data.listOfDowloadedfile.forEach(element => {
              fileList.innerHTML+=`<li>${element.fileName}</li>`
              
                  });
               
                printButton(res)
                  
               
               
               
             
                   } catch (error) {
                    if(error.response.status==404){
                      console.log(error)
                      // document.body.innerHTML=document.body.innerHTML+`<h6>no data found</h6>`
                    }
                    else{
            // document.body.innerHTML=document.body.innerHTML+`<h6>something went wrong</h6>`
            console.log(error.response.status)}
        }  
       
       
    }

   
  document.getElementById('sizeofpage').addEventListener('change',(e)=>{
    e.preventDefault()
    localStorage.setItem('pagesize',document.getElementById('sizeofpage').value)
    reload1(e);
  })
   
   
function printButton(res){
  let pagitationbutton=document.getElementById('pagitation')
  pagitationbutton.innerHTML="";
  console.log(res.data.hasPreviousPage)
  if(res.data.hasPreviousPage){
    const btn1=document.createElement('button')
    btn1.innerHTML=res.data.previousPage
    btn1.style.margin='5px'
    btn1.addEventListener('click',()=>{
      
      getProducts(res.data.previousPage)
    })
    pagitationbutton.appendChild(btn1)
    }
    const btn2=document.createElement('button')
    btn2.innerHTML=res.data.currentPage
    btn2.style.backgroundColor='pink'
    btn2.style.margin='5px'
    btn2.style.height='50px'
    btn2.addEventListener('click',()=>{
      getProducts(res.data.currentPage)
    })
    pagitationbutton.appendChild(btn2)

    if(res.data.hasNextPage){
      const btn3=document.createElement('button')
      btn3.innerHTML=res.data.nextPage
      btn3.style.margin='5px'
      btn3.addEventListener('click',()=>{
        getProducts(res.data.nextPage)
      })
      pagitationbutton.appendChild(btn3)
      }


  }
     
async function getProducts(page){

  try{
  sizeofpage=localStorage.getItem('pagesize')
  document.getElementById('sizeofpage').value= sizeofpage
 const token=localStorage.getItem('token')
 
  let res=await axios.get(`http://localhost:3000/user/getdata?page=${page}&pagesize=${sizeofpage}`,{headers:{'Authorization':token}})
  console.log('=====>',res)
  if(res.status==200){
  fileList.innerHTML="";
  fileList.innerHTML='<h5>downladed Files</h5>'
  res.data.listOfDowloadedfile.forEach(element => {
     fileList.innerHTML+=`<li>${element.fileName}</li>`
            printButton(res)       
                       });
}
else if(res.status==404){
  console.log('hi')
  fileList.innerHTML+='no file downloaded'

}
}
catch(err){
     console.log('===>',err.response.status)
}}
 

   document.getElementById('logout').onclick=function(e){
   e.preventDefault()
    alert('logout successful')
   
    window.location.href="./login.html"
   }

    

