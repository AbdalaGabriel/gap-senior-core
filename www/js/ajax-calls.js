// Funcion automatizada para hace run AJAX request
// -----------------------------------------------------------------------
console.log("- Listen for ajax calls");
function callAJAX(requesturl, ajaxmethod, callbackFunction)
{
    if(ajaxmethod == "simple")
    {
        console.log("- Funcion simple de peticiòn AJAX");
        var ajax =  $.get(requesturl, function(res)
        {
            //console.log(res);
        })

        .done(function(res) 
        {
            //console.log( "- Exito Ajax Carga" );
            consulta = res;
            switch(callbackFunction) 
            {
         
                case "projects": 
                renderProjects(consulta);
                break;                
               
                case "blog":
                renderBlog(consulta);
                break;

                case "resources":
                renderResources(consulta);
                break;
            }           
        })

        .fail(function()
        { 
            //console.log( "- Error en carga Ajax" );
        })
    }
    else if (ajaxmethod == "complete")
    {
        console.log("Completo");
        $.ajax(
        {
            url: requesturl,

            
            crossOrigin: true,
            type: 'GET',
            dataType: 'json',
            //data: {neworder: cardsPosition},

            success: function(res){
                //console.log( "- Exito Ajax Carga" );
                consulta = res;

                switch(callbackFunction) 
                {
                    case "cards": 
                    renderCards(consulta);
                    break;                
                   
                    case "comments":
                    newComentForAppended = true;
                    renderComments(newComentForAppended);
                    break;

                    case "phases":
                    console.log("success");
                    break;

                    case "newprojects":
                    console.log( "Exito en carga Ajax" );
                    $("#proyectos").append('<div class="projectContainer" data-position="0" data-project-id="'+res["id"]+'">'+title+'</div></div>');
                    break;

                    case "newTask":
                    console.log( "Exito en carga Ajax" );
                    $("#todo-column").append('<div class="task-container" data-array-position="0" data-from-phase="'+consulta["phase_id"]+'" data-task-order="'+consulta["order"]+'" data-task-status="'+consulta["status"]+'" data-task-id="'+consulta["id"]+'"><span data-status="4" data-id="'+consulta["id"]+'" class="hidecard">O</span><a class="titleCard" href="#" tabindex="0">'+consulta["title"]+'</a><p class="descriptionCard">'+consulta["description"]+'</p></div>');
                    break;
                }                 
                                    
            }
        });
    }
}