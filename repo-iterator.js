const apiKey = process.env.GIT_API_KEY || ''
const organization = process.env.GIT_ORGANIZATION || 'toptal'

const fetch = require('node-fetch');
function gitFetch(url, params = {}) { return fetch(`https://api.github.com/${url}`, {headers:{'Authorization': 'token '+apiKey}, ...params}) }
function gitOrgFetch(url) { return gitFetch(`orgs/${organization}/${url}`) }
function gitRepoFetch(url) { return gitFetch(`repos/${organization}/${url}`) }

async function withEachRepo(repoFunction) {
    const pagesTotal = await gitOrgFetch(`repos`).then(res => res.headers.get('link').split(',')[1].match(/page=([0-9]*)>/)[1])
    
    for (var pageNumber = 1; pageNumber <= pagesTotal; pageNumber++) {
        gitOrgFetch(`repos?page=${pageNumber}`).then(res => res.json())
        .then(json => json.forEach(repo => { repoFunction(repo.name) }))
    }
}

module.exports.withEachRepo = withEachRepo;
module.exports.gitFetch = gitFetch;
module.exports.gitOrgFetch = gitOrgFetch;
module.exports.gitRepoFetch = gitRepoFetch;
module.exports.organization = organization;
