(function(){

    ////////////////////////////////////////////////////////////////////////////////////////////

    Handlebars.templates = Handlebars.templates || {}

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    )

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML)
    })

    ////////////////////////////////////////////////////////////////////////////////////////////
    var rememberUser = localStorage.getItem("username")
    var rememberPass = localStorage.getItem("password")
    var rememberSearch = localStorage.getItem("usernameToSearch")

    $('input[name="username"]').val(rememberUser)

    $('input[name="password"]').val(rememberPass)

    $('input[name="username-to-search"]').val(rememberSearch)

    $("input").on("keydown", function(e) {
        if (e.keyCode == 13) {
            $("buttton").click();
        }
    })

    $('button').on('click', function(e){
        e.preventDefault()
        var username = $('input[name="username"]').val()
        var password = $('input[name="password"]').val()
        var usernameToSearch = $('input[name="username-to-search"]').val()
        var baseUrl = 'https://api.github.com'
        var endPoint = '/users/' + usernameToSearch + '/repos'
        var myGithubApiUrl = baseUrl + endPoint
        if(rememberUser){
            localStorage.setItem("username", username)
        }
        if(rememberPass){
            localStorage.setItem("password", password)
        }
        if(rememberSearch){
            localStorage.setItem("usernameToSearch", usernameToSearch)
        }
        console.log(myGithubApiUrl);
        console.log('full Github url: ' , baseUrl + endPoint);

        // console.log(username,password);

        $.ajax({
            url: myGithubApiUrl,
            headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password)
            },
            success: function(data) {
                var repos = []
                for (var i = 0; i < data.length; i++) {
                    repos.push(data[i])
                    if (repos.length >= 10) {
                      break;
                    }
                }
                var reposDiv = $('.repos')
                reposDiv.html(Handlebars.templates.listOfRepos({
                    reposResults: repos
                }))
                console.log(data);

                $('.name').on('click', function(e){
                    var repoName = $(e.target).text()
                    var repoDeployApi = baseUrl + "/repos/" + repoName + "/commits"
                    $.ajax({
                        url: repoDeployApi,
                        success: function(d) {
                            var messagesDiv = $(e.target).parent().parent().find(".message")
                            messagesDiv.html(Handlebars.templates.messages({
                                messagesResults: d
                            }))
                        }
                    });
                })
            }
        });
    })
})();
