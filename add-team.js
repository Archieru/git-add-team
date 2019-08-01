var iterator = require('./repo-iterator.js')

const team = process.env.GIT_GROUP_TO_ADD || 'reviewers'
const access = process.env.GIT_PERMISSION_TO_ADD || 'pull' // pull, push, admin

async function addTeamToRepo(repoName) { 
    const teamId = await iterator.gitOrgFetch(`teams/${team}`).then(res => res.json()).then(team => team.id)
    if (!teamId) { throw new Error('Unable to find team: ' + team)}
        
    iterator.gitFetch(
        `teams/${teamId}/repos/${iterator.organization}/${repoName}`, 
        { method:'PUT', body: JSON.stringify({'permission' : access})})
    .then(res => { 
        if (res.status == 204) { console.log(`Successfully added repo: ${repoName}`) }
        else if (res.status == 403) { console.log(`You don't have permission to add: ${repoName}`) }
        else { console.log(`General error occured with repo: ${repoName} Status: ${res.status}`) }
    })
}

iterator.withEachRepo(addTeamToRepo)