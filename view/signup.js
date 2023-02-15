signupform=document.getElementById('signupform');
signupform.addEventListener('submit',signup);
async function signup(e){
     e.preventDefault();
     userinfo={
      Name:e.target.Name.value,
      Email:e.target.Email.value,
      Password:e.target.Password.value
     }
     console.log(userinfo)
     try{
     responce=await axios.post("http://localhost:4000/user/signup",userinfo)
      if(responce.status===201){
        alert('succesfully created accout')
        window.location.href="./login.html"
      }
      else{
        throw new Error('failed to sign up')
      }
    }
    catch(err){
         document.body.innerHTML+=`<div style="color:red;">${err}</div>`

    }
    }
