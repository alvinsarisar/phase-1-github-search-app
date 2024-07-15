document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        // Clear previous results
        userList.innerHTML = '';
        reposList.innerHTML = '';
  
        // Perform user search
        searchUsers(searchTerm);
      }
    });
  
    async function searchUsers(searchTerm) {
      try {
        const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        displayUsers(data.items);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  
    async function getUserRepos(username) {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        displayRepos(data);
      } catch (error) {
        console.error('Error fetching user repos:', error);
      }
    }
  
    function displayUsers(users) {
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <div>
            <img src='${user.avatar_url}' alt='${user.login}' style='width: 50px; height: 50px;'>
            <span>${user.login}</span>
            <a href='${user.html_url}' target='_blank'>Profile</a>
          </div>
        `;
        userItem.addEventListener('click', function() {
          getUserRepos(user.login);
        });
        userList.appendChild(userItem);
      });
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <div>
            <h3>${repo.name}</h3>
            <p>${repo.description || ''}</p>
            <a href='${repo.html_url}' target='_blank'>Visit Repo</a>
          </div>
        `;
        reposList.appendChild(repoItem);
      });
    }
  });
  