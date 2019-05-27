# git-add-team
Add a team to all repositories in a given organization

Example:

`GIT_API_KEY=4242 GIT_ORGANIZATION=acme GIT_GROUP_TO_ADD=viewers GIT_PERMISSION_TO_ADD=pull node index.js`

Will add a group `viewers` in organization `acme` to all `acme`'s repositories with `pull` (view only) permissions, 
but only to repositories available to a user with api_key `4242`. 

You can create your API key in https://github.com/settings/tokens
