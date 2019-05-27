const apiKey = process.env.GIT_API_KEY || ''
const organization = process.env.GIT_ORGANIZATION || 'acme'
const team = process.env.GIT_GROUP_TO_ADD || 'viewers'
const access = process.env.GIT_PERMISSION_TO_ADD || 'pull' // pull, push, admin

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const team_id = getTeamId();

function getTeamId() {
    const url = 'https://api.github.com/orgs/' + organization + '/teams/' + team
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Authorization', 'token ' + apiKey)
    xhr.responseType = 'json';
    xhr.send();
    var json = JSON.parse(xhr.responseText)
    if (typeof json.id === 'undefined') { throw new Error('Unable to find team ' + team) }
    return json.id
}

function getReposPagesCount() {
    const url = 'https://api.github.com/orgs/' + organization + '/repos'
    var pagesTotal = 1
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Authorization', 'token ' + apiKey)
    xhr.responseType = 'json';
    xhr.send();

    var headers = xhr.getAllResponseHeaders();
    var lines = headers.trim().split(/[\r\n]+/);
    lines.forEach(line => {
        var parts = line.split(': ');
        var header = parts.shift();
        if (header === 'link') { 
            var value = parts.join(': ');
            pagesTotal = value.split(',')[1].match(/page=([0-9]*)>/)[1] 
        }
    });
    return pagesTotal;
}

function addTeamToRepo(repoName) {
    const url = 'https://api.github.com/teams/' + team_id + '/repos/' + organization + '/' + repoName
    var xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Authorization', 'token ' + apiKey)
    xhr.body
    xhr.send(JSON.stringify({'permission' : access}))
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200) { console.log(access + ' permissions granted to team ' + team + ' on ' + repoName); }
            else { console.log('Failed to add ' + team + ' to ' + repoName) }
        }
    }
}

function processPage(pageNumber) { 
    const url = 'https://api.github.com/orgs/' + organization + '/repos?page=' + pageNumber
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', 'token ' + apiKey)
    xhr.responseType = 'json';
    xhr.send();
    var json = JSON.parse(xhr.responseText)
    json.forEach(it => { 
        addTeamToRepo(it.name)
    })
}

// ===========================================
for (var pageNumber = 1; pageNumber <= getReposPagesCount(); pageNumber++) { processPage(pageNumber) }