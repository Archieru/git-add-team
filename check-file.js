var iterator = require('./repo-iterator.js')

const fileName = process.env.GIT_FILE_NAME || 'package-lock.json'

function checkFile(repoName) {
    iterator.gitRepoFetch(`${repoName}/contents/${fileName}`)
    .then(res => {
        if (res.status == 200) { console.log(`${fileName} [ V ] ${repoName}`) }
        else if (res.status == 404) { /* console.log(`${fileName} [X] ${repoName}`) */ }
        else { console.log(`General error occured with repo: ${repoName} Status: ${res.status}`) }
    })
}

iterator.withEachRepo(checkFile)