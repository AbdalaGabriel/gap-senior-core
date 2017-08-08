//baseurl = "http://gabrielabdala.com/";
 baseurl = "http://localhost:8000/";
var userID = "";
var userID = "";
var userName = "";
var userType = "";
var userEmail = "";
var consulta = "";
var seenTutorial = "no";
var ajaxsuccess = false;
var clientProjectsData = "";
var firstPhase = "";
var todos = $("#todo-column");
var inprogress = $("#inprogress-column");
var done = $("#done-column");
var newComentForAppended = false;
var actualProjectId = 0;
var consultedDataProject = false;
var token = $("#token").val();
var phasesOpen = false;
var projectInfoOpen = false;
var activePhaseId = 0;
var activeCard = 0;
var workingProject;
var actualPhaseForRenderCards;

//test2@test.com
//baseurl = "http://gabdala.ferozo.com/clean/public/";


$( document ).ready(function() {
    //console.log("- Se inicia el documento");
    init();
    mannageDragAndDrop();
    checkConection();
    initParticles();
    uifunctions();
    
    $('.loading').hide();
    //baseurl = "http://gabdala.ferozo.com/clean/public/";
    
    // Chequeamos si el server de destino soporta CORS
    // ENGLOBAR EN FUNCION CHEQUEOS, QUE VERIFIQUE TAMBN CONEXION   
    var xhr = createCORSRequest('GET', baseurl);
    if (!xhr) {
        console.log(" - CORS  not Suported");
        throw new Error('CORS not supported');
    }else{
        console.log("- CORS Suported");
    }
});

function initParticles(){
    particlesJS.load('particles-js', 'js/particles/particles.json', function() {
      //console.log('callback - particles.js config loaded');
  });
}

function checkConection()
{       
    let isData = localStorage.length;
    
    // Pregunto por conexión.
    //ONLINE
    if (navigator.onLine) 
    {
        console.log('- Online');
        if(isData==0)
        {
            console.log("Local storage vacio");
            needLogin();
        } 
        else{
            console.log("Local storage completo"); 
            userID = localStorage.getItem("id");
            userName = localStorage.getItem("name");
            userType = localStorage.getItem("typeUser");
            userEmail = localStorage.getItem("email");
            seenTutorial = localStorage.getItem("seen-tutorial");

            if(userName != "undefined"){
                pageInicio();
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#inicio");
            }
            else{
                needLogin();
            }

        }
    }   
    else 
    {  
        //OFFLINE
        console.log('- Offline');
        if(isData==0)
        {
            //console.log("Local storage vacio");
            alert("Lo sentimos en este momento no hay conexión y no posee una sesion iniciada.")
        } 
        else{
            //console.log("Local storage completo, pero no hay internet"); 
            //console.log(localStorage);
        }   
    }
}


function init()
    {
        //console.log("- Inicio de funcionalidades");

        $(".columns-container").slick({
            dots: true,
            infinite: false,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            draggable:false,
            swipe: false,
              arrows: true,

        });

        $('.slick-slide').click(function(){
            thisIndex = $(this).attr("data-slick-index");
            //console.log(thisIndex);
            $('.columns-container').slick('slickGoTo', thisIndex);
        });


        $(".tutorialProjects").slick({
            dots: true,
            infinite: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            draggable:false,

        });

        
}

// UI functions
// -----------------------------------------------------------------------
function uifunctions()
{
    console.log("init-others-function");
    var showphases = $(".show-phases");
    var hiddenMenuPhases = $(".grouptasks-container");

    var showProjectInfo = $(".show-project-info");
    var hiddenProjectinfo = $(".project-detail-container");

    showphases.click(function(ev)
    {
        //console.log("init-click-function");
        // Evitar propagacion para que los elementos del interior no disparen el evento mas de una vez
        ev.stopPropagation();
        
        if(phasesOpen){
            hiddenMenuPhases.removeClass("showmenu");
            hiddenMenuPhases.addClass("hidemenu");
            phasesOpen = false;
        }else{
           hiddenMenuPhases.addClass("showmenu");
           hiddenMenuPhases.removeClass("hidemenu");
           phasesOpen = true; 
        }
        
       
    });


    showProjectInfo.click(function(ev)
    {
        //console.log("init-click-function");
        // Evitar propagacion para que los elementos del interior no disparen el evento mas de una vez
        ev.stopPropagation();
        
        if(projectInfoOpen){
            hiddenProjectinfo.removeClass("showmenu");
            hiddenProjectinfo.addClass("hidemenu");
            projectInfoOpen = false;
        }else{
           hiddenProjectinfo.addClass("showmenu");
           hiddenProjectinfo.removeClass("hidemenu");
           projectInfoOpen = true; 
        }
        
       
    });


}



// Necesita loguears
// -----------------------------------------------------------------------
function needLogin(){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#login");
    loginfunction();
}

// Inicio de eventos de login
// -----------------------------------------------------------------------
function loginfunction()
{
    //console.log("- Pantalla de Login");

    let submit = $("#loguser");
    let email = $(".mail");
    let pass = $(".pw");
    
    submit.click(function()
    {
        console.log("- Click enviar login");
        valorEmail = email.val();
        //valorEmail = 'gabrielabdala.dm@gmail.com';
        valorPass = pass.val();
        loginroute = baseurl + "app/userlogin/" + valorEmail;
        //loginroute = baseurl + "app/testcors";

       

        // Validaciones de login
        if(valorEmail == "" )
        {
            //console.log("Debe enviar un mail");
        }
        else if(valorPass == "")
        {
            //console.log("Debe ingresar su password");
        }
        else
        {
            //console.log("- Se envia login");
            $.ajax(
            {
                crossOrigin: true,
                url: loginroute,
                type: 'GET',
                dataType: 'json',//tipo de datos



                success: function(data)
                {
                    let userInfo = data;
                    console.log(userInfo);
                    console.log("- Se logueo usuario");
                    console.log(userInfo[0].name);
                    // Seteo en localstorage
                    localStorage.setItem("name", userInfo[0].name);
                    localStorage.setItem("id",  userInfo[0].id);
                    localStorage.setItem("email", userInfo[0].email);
                    localStorage.setItem("typeUser", userInfo[0].type);
                    localStorage.setItem("seen-tutorial", "yes");
        

                    // Levanto en variables globales
                    userID = localStorage.getItem("id");
                    userName = localStorage.getItem("name");
                    userType = localStorage.getItem("typeUser");
                    userEmail = localStorage.getItem("email");
                    seenTutorial = localStorage.getItem("seen-tutorial");


                    pageInicio();
                    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#inicio");
                   
                    
                }
            });
        }

    });
}


// Función logout
// -----------------------------------------------------------------------
function logout()
{
    //console.log("- Log out");
    $("#logout").off();
    localStorage.clear();
    //console.log("- Local storage cleared");
}

// Pagina de inicio.
// -----------------------------------------------------------------------
function pageInicio()
{
    
    $("#logout").click(function(){
      $( ":mobile-pagecontainer" ).pagecontainer( "change", "#login");
      logout();
    });

    $('.columns-container').slick('slickGoTo', 2);
    //console.log(localStorage.getItem("name"));

    $("#saludo").text("Hola, "+userName );
    console.log("ls");
    console.log(localStorage);
    //console.log("- Mostrando página proyectos");
    var route = baseurl+"app/projects/" + userID;
    if(!consultedDataProject)
    {
        //console.log("- Consulto datos de proyectos por primera vez");
        callAJAX(route, "simple", "projects");
    }
    else
    {
        //console.log("- Datos ya consultados, no vuelvo a hacer ajax")
    }

    $("#blogButton").click(function()
    {
        routeBlog = baseurl + "app/blog";
        callAJAX(routeBlog, "simple", "blog");
    });
    $("#resourcesButton").click(function()
    {
        routeResources = baseurl + "app/resources";
        callAJAX(routeResources, "simple", "resources");
    });

    $("#toProjects").click(function()
    {
        //Muestro tutorial si es la primerza vez que entra,
        if(seenTutorial == "no"){
            console.log("muestro tutorial");
            $(".tutorialProjects-container").css("display","block");

            $(".tut-next").click(function()
            {
                $(".tutorialProjects").slick('slickNext');
            });

            $(".tut-end").click(function()
            {
               $(".tutorialProjects-container").css("display","none");
               localStorage.setItem("seen-tutorial", "yes");
               seenTutorial = localStorage.getItem("seen-tutorial");
            });




        }
    });

}

 

// Render de proyectos.
// -----------------------------------------------------------------------
function renderProjects(consulta)
{
    

   

    //console.log(" - Render de proyectos");
    clientProjectsData = consulta;
    tablaDatos = $("#proyectos");
    tablaDatos.empty();

    projectPosition = 0;
    $(clientProjectsData).each(function(key, value)
    {
        tablaDatos.append('<div class="projectContainer" data-position="'+projectPosition+'" data-project-id="'+value.id+'">'+value.title+'<span class="data-datewp">Desde: <span class="from-project">'+value.created_at+'</span></span></div>');
        projectPosition++;
    });

    $(".projectContainer").off();
    $(".projectContainer").click(function()
    {
        actualProjectId = $(this).attr("data-project-id");
        $('.columns-container').slick('slickGoTo', 0);
        thisProjectPosition = $(this).attr("data-position")
        //console.log("- Posicion extraida: "+ thisProjectPosition);
        renderPhases(clientProjectsData, thisProjectPosition);
        console.log(actualProjectId);
        workingProject = $(this);
    });


   
}

// Crear nuevo proyecto
// -----------------------------------------------------------------------
$(".create-new").click(function()
    {
        $(".create-new").off()
        console.log( "- Inicio click listener: CREATE" );

        $("#confirm-create-clientproject").click(function()
        {
            $("#confirm-create-clientproject").off();
            title = $("#title").val();
            urlf = $("#urlf").val();
            description = $("#content").val();
            console.log( "- Inicio confirmation listener: CREATE" );
            console.log(userID);

            var newprojectRoute = baseurl+ '/mis-proyectos/create/'+userID+'/'+title+'/'+description;
            console.log(newprojectRoute);
            
            callAJAX(newprojectRoute, "complete", "newprojects");

        });
    });    


// Render de Fases por proyecto
// -----------------------------------------------------------------------
function renderPhases(clientProjectsData, thisProjectPosition)
{
    console.log("- Render de fases");
    console.log(thisProjectPosition);

    // Delete project
    $("#confirm-delete-project").off();   
    $("#confirm-delete-project").click(function(){
        console.log("-Deleteproject");
        workingProject.remove();
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");

        let deleteprojectroute = baseurl+"app/delete/clientproject/"+actualProjectId;

        callAJAX(deleteprojectroute, "complete", "deleteproject");
    });


    var thisProject = clientProjectsData[thisProjectPosition];
    console.log(thisProject);
    $("#tituloProject").text(thisProject.title);
    $(".project-description").text(thisProject.description);

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");
    
    var projectPhases = thisProject.phases;
    var faesContainer = $(".append-phases");
    faesContainer.empty();

    console.log(projectPhases);
    let i = 0;
    $(projectPhases).each(function(key, value)
    {
        faesContainer.append('<div class="phaseContainer" data-phase-position="'+i+'" data-phase-id="'+value.id+'">'+value.title+'</div>');
        i++;
        console.log("appendphase");
    });

    $(".new-phase").off();
    $(".new-phase").click(function(){
        console.log("- add ´phase");
        let phasedescr = $("#phasedesc").val();
        let phasetitle = $("#phasetitle").val();
        let newphaseroute = baseurl+"app/phases/"+actualProjectId+"/"+phasetitle+"/"+phasedescr;
        console.log(token);

        if(phasedescr != "" && phasetitle != ""){
           callAJAX(newphaseroute, "complete", "phases");
          
        }else{  
            console.log("- debe completar los campos")
        }
    });


   
    function redrawphase(){
        console.log("- redibujar fasees");

    }

    // Selecciono primer fase, para apendearle las tarjetas a la pantalla.
    firstPhase = thisProject.phases[0];
    $(".phaseContainer[data-phase-position='0']").addClass("activePhase");
    $("#phaseId").val(firstPhase.id);

    // Mi funcion de updateo de tarjetas, recibe la fase activa, con lo cual le envio la primera fase como fase activa.
    actualPhaseForRenderCards = firstPhase;
     updatecards(actualPhaseForRenderCards);

    // Click en phase;
    $(".phaseContainer").off();
    $(".phaseContainer").click(function()
    {
        console.log("- Click on phase");
        $(".phaseContainer").removeClass("activePhase");
        $(this).addClass("activePhase");
        thisPositionPhase = $(this).attr("data-phase-position");
        actualPhaseForRenderCards = thisProject.phases[thisPositionPhase];
        updatecards(actualPhaseForRenderCards);
        activePhaseId = $(".activePhase").attr("data-phase-id");
        console.log("Active phase " + activePhaseId);
    });

    activePhaseId = $(".activePhase").attr("data-phase-id");
    console.log("Active phase " + activePhaseId);

    $("#confirm-delete-phase").off();   
    $("#confirm-delete-phase").click(function(){
        console.log("-Delete ´phase");
        let deletephaseroute = baseurl+"app/delete/phase/"+activePhaseId;

        callAJAX(deletephaseroute, "complete", "deletephase");
        redrawphase();
    });


}

// Eventos de tarjetas.
// -----------------------------------------------------------------------
function eventsForCards()
{
    console.log("- Eventos para tarjetas.");
    $(".task-container").off();
    $(".task-container").click(function()
    {
       console.log("- Click en tarjeta");
        
        // Extracion y seteo de variables
        cardId = $(this).attr("data-task-id");
        cardPosition = $(this).attr("data-array-position");
        fromPhase = $(this).attr("data-from-phase");
        title = $(this).find("a.titleCard").text();
        description = $(this).find("p.descriptionCard").text();
        cardroute = baseurl+"app/task/"+cardId+"/comments";
        activeCard = $(this);
        
        // Ajax para ver comentarios
        callAJAX(cardroute, "complete", "cards");
        
        // Cambio de informacion en pantalla de render.
        $("#titleCardPage").text(title);
        $("#descriptionCardPage").text(description);
        $("#thisTaskId").val(cardId);

    });
    $('.columns-container').slick('setPosition');
    console.log("-resize");
    
    hideloading();
    function hideloading() {
        setTimeout(function(){
         $('.loading').hide(); 
     }, 500);
    }

    $("#new-task").off();
    $("#new-task").click(function()
    {
        
        console.log( "- Inicio click listener: CREATE" );

        $("#confirm-create-task").click(function()
        {
            let title = $("#task-title").val();
            let urlf = $("#urlf").val();
            let description = $("#task-content").val();
            let order = 0;
            let status = 1;
            let phaseId = $(".activePhase").val();
            let projectId = $("#act-project-id").val();

            //checkorder
            order = todos.find(".task-container").length;

            console.log( "- Inicio confirmation listener: CREATE" );
            console.log(userID);

            var newTaskRoute = baseurl+ 'app/tasks/create/'+title+'/'+description+'/'+projectId+'/'+activePhaseId+'/'+status+'/'+order;
            console.log(newTaskRoute);
            
            callAJAX(newTaskRoute, "complete", "newTask");

        });
    });    

 
}

// Crear nueva tarjeta
// -----------------------------------------------------------------------



// Render de tarjetas.
// -----------------------------------------------------------------------
function renderCards(consulta)
{
    console.log("- Mostrando detalle de tarjeta");
    // por ahora vamos a hacer una llamada ajax par ver comentarios
    // fijarse luego sin conex, localstorage.
    renderComments(consulta);

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#card");
    
    // Saco evento asi no se lo appendea cada vez que entra a la tarjeta y manda multiple cosltas.
    $("#sendComment").off();
    $("#sendComment").click(function()
    {
        //console.log("Click en enviar comentario");
        newComment = $("#newComment").val();
        if(newComment != ""){
            //console.log("- Enviar comentario");
            comentRoute = baseurl+"app/"+userID+"/task/"+cardId+"/"+newComment;
            //console.log(comentRoute);
            callAJAX(comentRoute, "complete", "comments");
        }
        else
        {
            //console.log("- Comentario vacio, no se envia nada");
        }
    });

    //Status para volver a pantalla anterior.
    let activeCardStatus = activeCard.attr("data-task-status");
    let finalStatus = activeCardStatus - 1;
    console.log("Final estatus" + finalStatus);

    //Confirmar ocultamiento de tarjeta
    confirmateHideButton = $("#confirm-hide-task");
    confirmateHideButton.off();
    confirmateHideButton.click(function()
    {
        cardId = $("#thisTaskId").val();
        console.log("Hide click");
        var newStatus = 4;
        var changeStatusRoute = baseurl+"tasks/"+cardId+"/changestatus/"+newStatus;
        var changeStatus =  $.get(changeStatusRoute, function(res)
        {
            console.log("cambiado a Oculto");
            activeCard.remove();
            $('.columns-container').slick('slickGoTo', finalStatus);
            updatecards(actualPhaseForRenderCards); 
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");

            //$("#hiddenCards").text("Ver tareas ocultas");
            //$("#hiddenCards").attr("href", baseurl+"/mis-proyectos/"+projectId+"/phase/"+phaseId+"/tareas-ocultas");
        });
    });


    //Confirmar borrado de tarjeta
    confirmateDeleteButton = $("#confirm-delete-task");
    confirmateDeleteButton.off();
    confirmateDeleteButton.click(function()
    {
        console.log("- Confirmate delete");
        $.ajax(
        {
            url: baseurl+"tasksmanager/deletesimpletask/"+cardId,
            headers: {'X-CSRF-TOKEN': token},
            type: 'GET',
            dataType: 'json',
                    

            success: function(data)
            {
                console.log("destroyed");
                activeCard.remove();
                $('.columns-container').slick('slickGoTo', finalStatus);
                updatecards(actualPhaseForRenderCards); 
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");
            }
        });
    });
}

// Funcion render de comentarios
// -----------------------------------------------------------------------
function renderComments(consulta){
    console.log(consulta);
    // SI lo que me llega e suna vairable en true significa que hay un nuevo comentario para apendear
    // Lo hago via html no es necesario que haga una consulta ajax, si lo q me llega es un objeto json, aahi si.

    if(newComentForAppended == true)
    {
        //console.log("- Solo appendeo porque es un nuevo coment de la misma fase..");
        let userCommentId = consulta.user_id;
        let hardDate  = consulta.created_at;
        //let splittedDate = hardDate.split(" ");
        //console.log(splittedDate);
        let commentDate = consulta.created_at;
        let commentTime = consulta.created_at;
        commentsContainer = $("#cardComments");
        newComment = $("#newComment").val();
        $("#newComment").val("");
        $("#newComment").attr("placeholder","Ingresar comentario");
        // @TODO: hacer username un eleento html para extraer el nombre, ahora sale de un objeto json.
        commentsContainer.append('<div class="commentContainer"><p class="commentbody">'+newComment+'<span class="date-container">El '+commentDate+' a las '+commentTime+'</span><span class="author">by <span class="username">'+userName+'</span></span></p> </div>');
        newComentForAppended = false;

    }
    else
    {
        //console.log("- Reset de coments porque llego objeto desde fase.");
        cardId = $("#thisTaskId").val();
        commentsContainer = $("#cardComments");
        commentsContainer.empty();

        ////console.log("- Se agrego comentario");
        if (consulta != "No-comments")
        {
            //console.log("- Render comments");
            $(consulta).each(function(key, value)
            {
                let userCommentId = value.user_id;
                let hardDate  = value.created_at;
                let splittedDate = hardDate.split(" ");
                let comment = value.comment;
                let userNameCom = value.username;
                let commentDate = splittedDate[0];
                let commentTime = splittedDate[1];
                commentsContainer.append('<div class="commentContainer"><p class="commentbody">'+comment+'<span class="date-container">El '+commentDate+' a las '+commentTime+'</span><span class="author">by <span class="username">'+userNameCom+'</span></span></p> </div>');
            });
        }
        else
        {
            //console.log("- No tiene comentarios");
            commentsContainer.append('<p class="no-coments">Esta tarjeta no tiene comentarios</p>')
        }
    }
}

// Fncion de limpieza de columnas.
// -----------------------------------------------------------------------
function cleancolumns()
{
    $("#confirm-create-task").off();
    $("#new-task").off();

    todos.empty();
    inprogress.empty();
    done.empty();
}


function updatecards(activephase)
{
    console.log( "- Iniciar la carga de tareas" );
    $('.loading').show();
    // Limpieza de listeners y contenedores de elementos.
    cleancolumns();
    ////console.log( "- Limpieza" );


    // Generación dinámica de ruta en base a la vista de grupo de tareas activa.
    phaseId = activephase.id;
    activeProjectId = activephase.client_project_id;
    //console.log("Estoy laburando con la fase + " + phaseId);

    $("#act-project-id").val(activeProjectId);
    // Por cada columna de tareas leo mi objeto data.
    count = 0;
    $(".task-column").each(function(key, value)
    {
        console.log("col");
        phaseId = $("#phaseId").val();
        
        // Datos columna actual
        thisColumn = $(this);
        thisColumnStatus = thisColumn.attr("data-tasks-status");    
        //console.log("el status de esta columna es "+ thisColumnStatus);

        // Búsqueda de tareas para éste estado de columna, dentro de ésta fase.
        switch(thisColumnStatus) 
        {
            case "1":
            //console.log("Corresponde a: todos")
                ////console.log(activephase);
                ////console.log(activephase["cards"]);
                console.log(activephase["cards"]["todos"]);
                largoTarjetas = activephase["cards"]["todos"].length;
                thiscards = activephase["cards"]["todos"];
                console.log("y tiene " + largoTarjetas + "tareas")
                break;
                case "2":
                //console.log("Corresponde a: in progress")
                ////console.log(activephase);
                ////console.log(activephase["cards"]);
                ////console.log(activephase["cards"]["inprogress"]);
                largoTarjetas = activephase["cards"]["inprogress"].length;
                thiscards = activephase["cards"]["inprogress"];
                //console.log("y tiene " + largoTarjetas + "tareas")
                break;
                case "3":
                //console.log("Corresponde a: done")
                ////console.log(activephase);
                ////console.log(activephase["cards"]);
                ////console.log(activephase["cards"]["done"]);
                largoTarjetas = activephase["cards"]["done"].length;
                thiscards = activephase["cards"]["done"];
                //console.log("y tiene " + largoTarjetas + "tareas")
                break;

                case "4":
                //console.log("Corresponde a: hidden")
                ////console.log(activephase);
                ////console.log(activephase["cards"]);
                ////console.log(activephase["cards"]["hidden"]);
                largoTarjetas = activephas["cards"]["hidden"].length;
                thiscards = activephase["cards"]["hidden"];
                //console.log("y tiene " + largoTarjetas + "tareas")
                break;

            }

        //largoTarjetas = activephase.cards.length;
        if(largoTarjetas > 0)
        {
            colstatus = thiscards[0].status;
            columnForAppend = $('.task-column[data-tasks-status="'+colstatus+'"]')

            //console.log("data no es distinto de null y la columna es ");
            //console.log(columnForAppend);
            for(i=0;i<largoTarjetas;i++)
            {
                columnForAppend.append('<div  class="task-container" data-array-position="'+i+'" data-from-phase="'+phaseId+'" data-task-order="'+thiscards[i].task_order+'" data-task-status="'+thiscards[i].status+'" data-task-id="'+thiscards[i].id+'"><span data-status="4" data-id="'+thiscards[i].id+'" class="hidecard">O</span><a class="titleCard" href="#">'+thiscards[i].title+'</a><p class="descriptionCard">'+thiscards[i].description+'</p></div>');                            
            }

        }   

        count = count+1;
        ////console.log(count);
        if(count == 3){
            //console.log("terminaron las consultas, llamo func");
            eventsForCards();
        }
        
    });
    
  //  mannageDragAndDrop();
}

// -----------------------------------------------------------------------
// Funcion render blog:
function renderBlog(consulta)
{
   console.log(" - Render de posteos");
   postsData = consulta;
   postContainer = $("#postsContainer");
   postContainer.empty();
   keyNumber = 0;
   $(postsData).each(function(key, value)
   {

       let htmlToAppend = '<div class=" blogItem" data-project-id="'+value.id+'">';
       htmlToAppend += '<a href="#"><img class="image-container" src="'+baseurl+'uploads/posts/'+value.cover_image+'"></a>';
       htmlToAppend += '<span class="grid-date-container">'+value.created_at+'</span>'
       htmlToAppend += '<h2 class="post-title">'+value.title+'</h2>';
       htmlToAppend += '<div class="extract-container">'+value.extract+'</div>';
       htmlToAppend += '<a data-new-key="'+keyNumber+'" class="readNew" href="#">Leer noticia</a>'
       htmlToAppend += '</div>';

       postContainer.append(htmlToAppend);
       keyNumber++;

       
   });

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#blog");

    let readNew = $(".readNew");
    readNew.off();
    readNew.click(function(){
         thisKeyNumber = $(this).attr("data-new-key");
         noticeObject = postsData[thisKeyNumber];
        console.log(postsData[0]);
        renderNew(noticeObject);

    });

 }

// -----------------------------------------------------------------------
// Funcion render recursos:
function renderResources(consulta)
{
   console.log(" - Render de recursos");
   postsData = consulta;
   postContainer = $("#resourcesContainer");
   postContainer.empty();
   keyNumber = 0;
   $(postsData).each(function(key, value)
   {

       let htmlToAppend = '<div class=" blogItem" data-project-id="'+value.id+'">';
       htmlToAppend += '<a href="#"><img class="image-container" src="'+baseurl+'uploads/resources/'+value.cover_image+'"></a>';
       htmlToAppend += '<span class="grid-date-container">'+value.created_at+'</span>'
       htmlToAppend += '<h2 class="post-title">'+value.title+'</h2>';
       htmlToAppend += '<a data-new-key="'+keyNumber+'" class="readNew" href="#">Ver!</a>'
       htmlToAppend += '</div>';

       postContainer.append(htmlToAppend);
       keyNumber++;

       
   });

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#recursos");

    let readNew = $(".readNew");
    readNew.off();
    readNew.click(function(){
         thisKeyNumber = $(this).attr("data-new-key");
         noticeObject = postsData[thisKeyNumber];
        console.log(postsData[0]);
        renderResource(noticeObject);

    });

 }

// -----------------------------------------------------------------------
// Funcion render noticia
function renderNew(noticia)
{
    //noticeContent
    console.log("- render noticia");
    let noticeSpace = $("#noticeContent");
    noticeSpace.empty();

    let htmlToAppend = '<div class=" blogItem" data-project-id="'+noticia.id+'">';
    htmlToAppend += '<a href="#"><img class="image-container" src="'+baseurl+'uploads/posts/'+noticia.cover_image+'"></a>';
    htmlToAppend += '<div class="post-content">';
    htmlToAppend += '<span class="grid-date-container">'+noticia.created_at+'</span>';
    htmlToAppend += '<h2 class="post-title">'+noticia.title+'</h2>';
    htmlToAppend += '<div class="bodynew-container">'+noticia.content+'</div>';
    htmlToAppend += '</div>';
    htmlToAppend += '</div>';

    noticeSpace.html(htmlToAppend);

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#notice");
};



// -----------------------------------------------------------------------
// Funcion render recurso
function renderResource(noticia)
{
    //noticeContent
    console.log("- render noticia");
    let noticeSpace = $("#noticeContent");
    noticeSpace.empty();

    let htmlToAppend = '<div class=" blogItem" data-project-id="'+noticia.id+'">';
    htmlToAppend += '<a href="#"><img class="image-container" src="'+baseurl+'uploads/resources/'+noticia.cover_image+'"></a>';
    htmlToAppend += '<div class="post-content">';
    htmlToAppend += '<span class="grid-date-container">'+noticia.created_at+'</span>';
    htmlToAppend += '<h2 class="post-title">'+noticia.title+'</h2>';
    htmlToAppend += '<div class="bodynew-container">'+noticia.content+'</div>';
    htmlToAppend += '</div>';
    htmlToAppend += '</div>';

    noticeSpace.html(htmlToAppend);

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#notice");
};


// -----------------------------------------------------------------------
// Funcion para saber si server de destino soporta CORS:
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

} else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

} else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

}
return xhr;
}

