import parse from 'parse-link-header';

let selectedPage = 1;
let repos = [];
let link = {};
let pages = 0;
let pagingList;

export const buildHTMLPage = (repositories, linkHeader) => {
    //paging
    repos = repositories;
    link = parse(linkHeader);
    pages = parseInt(link.last.page);
    selectedPage = 1;

    //fill the paging list
    injectPagination();

    //start mapping the list
    injectPage();
}

const injectPagination = () => {
  pagingList = `
          <li class="page-item"><a id="prev" class="page-link" href="javascript:void(0)">Prev</a></li>
          <li class="page-item"><span class="page-link" id="spanSelectedPage">${selectedPage} of ${pages}</span></li>
          <li class="page-item"><a id="next" class="page-link" href="javascript:void(0)">Next</a></li>
          `;
  document.getElementById('paging').innerHTML = pagingList;
  document.getElementById('prev').addEventListener('click', goPrevious);
  document.getElementById('next').addEventListener('click', goNext);
};

const injectPage = () => {
  const list = repos ?  repos.reduce((acc, repo) => acc + `<li><p>${repo.id} ${repo.url}</p><hr /></li>`, '') : "";
  document.getElementById("repos-list").innerHTML = list;
};

const goPrevious = () => {
  if (link.prev) {
    fetchRemoteRepos(link.prev.url, false);    
  }
};

const goNext = () => {
  if (link.next) {
    fetchRemoteRepos(link.next.url, true);  
  }
};

const fetchRemoteRepos = (url, next = true) => {
  fetch(url)
  .then(response => {
    link = parse(response.headers.get('link'))
    return response.json()
  })
  .then(repositories => {
    repos = repositories;
    next ? selectedPage++ : selectedPage--;
    injectPage();
    injectPagination();  
  });
}