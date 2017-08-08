$("#signupButton").on('click', function(){
       //Input the location in the search bar.
       console.log("Hit signup button");
       
       var user = $("#username").val();
       var phone= $("#phonenumber").val();
       var pass = $("#password").val();
       console.log("Hit signup button");
       
       $.ajax({
          type:'POST',
          url:'https://dodger-alert-swaggyg55.c9users.io/signup',
          data:{username:user,phonenumber:phone,password:pass},
          success: function(data){
            if (data.status === "Success") {
                 window.location = data.redirect;
            }
          },
          error: function(err){
              console.log("que?");
              console.log(err);
          }
       });
});