var iterator = require('./repo-iterator.js')

const expected_label = process.env.GIT_LABEL_TO_FIND || 'WIP'

async function findLabel(repoName) { 
    iterator.gitRepoFetch(`${repoName}/issues`).then(res => res.json())
    .then(json => { json.forEach(pr => { if (pr.state == 'open')
        pr.labels.forEach(label => { if (label.name == expected_label) { console.log(pr.html_url) } })
    })})
}

iterator.withEachRepo(findLabel)