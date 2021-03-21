import './styles/index.css';
import { buildHTMLPage } from './utils';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-users').addEventListener('click', event => {
    searchGithub(event, `https://api.github.com/search/users?q=${document.getElementById('search').value}`);
  });

  document.getElementById('search-repos').addEventListener('click', event => {
    searchGithub(event, `https://api.github.com/search/repositories?q=${document.getElementById('search').value}`);
  });
});

const searchGithub = (event, url) => {
  event.preventDefault();
    
  let element = document.getElementById("user-list");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  element = document.getElementById("repos-list");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  
  fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  }).then(response => response.json())
    .then(result => result.items.forEach(item => listUserDetails(item)));
};

const listUserDetails = userDetails => {
  const usersList = document.getElementById('user-list');
  
  const prev = document.createElement('button');
  const next = document.createElement('button');
  prev.innerHTML = '<i class="fa fa-backward" style="font-size:24px"></i>';
  next.innerHTML = '<i class="fa fa-forward" style="font-size:24px" ></i>';
  
  // usersList.parentNode.insertBefore(next, usersList.nextSibling);
  // usersList.parentNode.insertBefore(prev, usersList.nextSibling);

  const userList = document.createElement('li');
  const userAvatar = document.createElement('img');
  const userLink = document.createElement('a');

  userLink.href = userDetails.html_url;
  userLink.innerText = userDetails.html_url;

  userAvatar.src = userDetails.avatar_url;
  userAvatar.alt = 'My Github Avatar';
  userAvatar.style.width = '50px';
  userAvatar.style.height = '50px';  

  userList.innerText = userDetails.login;
  userList.appendChild(userLink);
  userList.appendChild(userAvatar);

  usersList.appendChild(userList);

  const userDivider = document.createElement('hr');
  userDivider.className = 'solid';
  userList.appendChild(userDivider);

  userList.addEventListener('click', () => {
    fetch(`https://api.github.com/users/${userDetails.login}/repos?per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }).then(response => ({
        json: response.json(),
        link: response.headers.get('link')
      }))
      .then(result => result.json.then(repos => {
        let element = document.getElementById("repos-list");
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        // repos.forEach(repo => listUserRepos(repo))
        buildHTMLPage(repos, result.link);
      }));   
  })
}

const listUserRepos = repo => {
  // document.getElementById('user-repos').innerText += repo.owner.login;
  const reposList = document.getElementById('repos-list');
  
  const prev = document.createElement('button');
  const next = document.createElement('button');
  prev.innerHTML = '<i class="fa fa-backward" style="font-size:24px"></i>';
  next.innerHTML = '<i class="fa fa-forward" style="font-size:24px" ></i>';
  
  // usersList.parentNode.insertBefore(next, usersList.nextSibling);
  // usersList.parentNode.insertBefore(prev, usersList.nextSibling);

  const repoList = document.createElement('li');
  const repoId = `ID: ${repo.id}`;
  const repoLink = document.createElement('a');

  repoLink.href = repo.url;
  repoLink.innerText = repo.url;

  repoList.innerText = repoId;
  repoList.appendChild(repoLink);

  reposList.appendChild(repoList);

  const repoDivider = document.createElement('hr');
  repoDivider.className = 'solid';
  repoList.appendChild(repoDivider);
}