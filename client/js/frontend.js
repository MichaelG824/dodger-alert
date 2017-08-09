
//Sign in button.
$("#signupButton").on('click', function(e){
       //Input the location in the search bar.
       console.log("Hit signup button");
       
       e.preventDefault();
       
       var user = $("#username").val();
       var phone= $("#phonenumber").val();
       var pass = $("#password").val();
       console.log("Hit signup button");
       
       $.ajax({
          type:'POST',
          url:'https://dodger-alert-swaggyg55.c9users.io/signup',
          data:{username:user,phonenumber:phone,password:pass},
          success: function(data){
            if (data.status == "Success") {
                 window.location = data.redirect;
            }
          },
          error: function(err){
              console.log("que?");
              console.log(err);
          }
       });
});


//Password button.
$("#updateButton").on('click', function(e){
       //Input the location in the search bar.
       console.log("Hit signup button");
       
       e.preventDefault();
       
       var user = $("#username").val();
       var newpass = $("#newpassword").val();
       var oldpass = $("#oldpassword").val();
       console.log("Hit forget button");
       
       $.ajax({
          type:'POST',
          url:'https://dodger-alert-swaggyg55.c9users.io/forgot',
          data:{username:user,newpassword:newpass,oldpassword:oldpass},
          success: function(data){
            console.log("Hit success");
            console.log(data);
            if (data.status == "Success") {
                 console.log("Hit if success");
                 window.location = data.redirect;
            }
          },
          error: function(err){
              console.log("que?");
              console.log(err);
          }
       });
});