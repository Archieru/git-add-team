const apiKey = process.env.GIT_API_KEY || ''
const organization = process.env.GIT_ORGANIZATION || 'acme'
const team = process.env.GIT_GROUP_TO_ADD || 'viewers'
const access = process.env.GIT_PERMISSION_TO_ADD || 'pull' // pull, push, admin

const fetch = require('node-fetch');
async function gitFetch(url, params = {}) { return fetch('https://api.github.com/'+url, {...{headers:{'Authorization': 'token '+apiKey}}, ...params}) }
async function gitOrgFetch(url, params = {}) { return gitFetch('orgs/'+organization+'/'+url, params) }

async function gitAddTeam() {
    const teamId = await gitOrgFetch('teams/' + team).then(res => res.json()).then(team => team.id)
    if (!teamId) { throw new Error('Unable to find team: ' + team)}
        
    const pagesTotal = await gitOrgFetch('repos').then(res => res.headers.get('link').split(',')[1].match(/page=([0-9]*)>/)[1])
    
    for (var pageNumber = 1; pageNumber <= pagesTotal; pageNumber++) {
        gitOrgFetch('repos?page=' + pageNumber).then(res => res.json()).then(json => json.forEach(repo => {
            gitFetch(
                'teams/' + teamId + '/repos/' + organization + '/' + repo.name, 
                { method:'PUT', body: JSON.stringify({'permission' : access})})
            .then(res => { 
                if (res.status == 204) { console.log('Successfully added repo: ' + repo.name) }
                else if (res.status == 403) { console.log('You don\'t have permission to add: ' + repo.name) }
                else { console.log('General error occured with repo: ' + repo.name + '  Status: ' + res.status) }
            })
        }))
    }
}
gitAddTeam()
