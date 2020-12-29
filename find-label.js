var iterator = require('./repo-iterator.js')

const expected_label = process.env.GIT_LABEL_TO_FIND || 'WIP'
const ignored_label = process.env.GIT_LABEL_TO_FIND || 'ignored'

async function findLabel(repoName) { 
    iterator.gitRepoFetch(`${repoName}/issues`).then(res => res.json())
    .then(json => { json.forEach(pr => { if (pr.state == 'open')
        var label_names = pr.labels.map(function(label) { return label.name })
        if (label_names.includes(expected_label) && !label_names.includes(ignored_label)) {
            console.log(pr.html_url)
        }
    })})
}

iterator.withEachRepo(findLabel)