function $(sel, root=document){ return root.querySelector(sel); }

function requireLogin(redirect='/login'){ 
  if(!Auth.isLoggedIn()){ 
    alert('로그인이 필요합니다.');
    location.href = redirect; 
    return false; 
  } 
  return true; 
}

function renderHeader() {
  const header = document.createElement('div');
  header.className = 'header';
  
  // 로그인 상태에 따른 헤더 내용 결정
  const isLoggedIn = Auth.isLoggedIn();
  const userProfile = Auth.profile();
  
  // 항상 프로필 이미지와 드롭다운 메뉴를 표시하되, 로그인 상태에 따라 메뉴 내용만 변경
  const profileImageUrl = isLoggedIn ? (userProfile.imageUrl || '/assets/images/account_circle.png') : '/assets/images/account_circle.png';
  
  const headerContent = `
    <div class="header-menu">
        <img class="menu-icon" src="/assets/images/menu.png" alt="메뉴" onclick="asideMenu()" />
    </div>
    <div class="logo-text">아무 말 대잔치</div>
    <div class="header-actions">
      <div class="header-dropdown">
        <img class="profile_circle" src="${profileImageUrl}" alt="프로필" onclick="toggleDropdown()" />
        <div id="dropdownMenu" class="dropdown-menu">
          ${isLoggedIn ? `
            <a href="/profile" class="dropdown-item">회원정보 수정</a>
            <a href="/change-password" class="dropdown-item">비밀번호 수정</a>
            <a href="#" class="dropdown-item logout" onclick="handleLogout()">로그아웃</a>
          ` : `
            <a href="/login" class="dropdown-item">로그인</a>
          `}
        </div>
      </div>
    </div>
  `;
  
  header.innerHTML = headerContent;
  document.querySelector('.wrap').prepend(header);
  
  // Aside 메뉴 렌더링
  renderAsideMenu();
  
  // 드롭다운 메뉴 기능 추가
  window.toggleDropdown = function() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
  };

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdownMenu');
    const profileImg = document.querySelector('.profile_circle');
    
    if (dropdown && profileImg && !profileImg.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.remove('show');
    }
  });

  // 로그아웃/로그인 처리 함수
  window.handleLogout = function() {
    if (isLoggedIn) {
      if (confirm('정말 로그아웃 하시겠습니까?')) {
        Auth.clear();
        alert('로그아웃되었습니다.');
        
        // 로그아웃 시 헤더 업데이트
        if (typeof updateHeader === 'function') {
          updateHeader();
        }
        
        location.href = '/login';
      }
    } else {
      // 로그인되지 않은 상태에서 프로필 클릭 시 로그인 페이지로 이동
      location.href = '/login';
    }
  };


  // // 프로필 이미지 클릭 시 로그인되지 않은 상태면 로그인 페이지로 이동
  // const profileImg = document.querySelector('.profile_circle');
  // if (profileImg && !isLoggedIn) {
  //   profileImg.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     location.href = '/login';
  //   });
  // }
}

function renderCardPost(post) {
  const cardPost = document.createElement('div');
  cardPost.className = 'card-post';
  cardPost.innerHTML = `
    <div class="card-post-top">
      <div class="card-post-title">${post.title}</div>
      <div class="card-post-info">
        <div class="card-post-count-info">
          <div class="card-post-lcv">
            <img class="card-post-icon" src="/assets/images/like.png" alt="like" />
            <div class="card-post-count">${post.likeCount || 0}</div>
          </div>
          <div class="card-post-lcv">
            <img class="card-post-icon" src="/assets/images/comment.png" alt="comment" />
            <div class="card-post-count">${post.commentCount || 0}</div>
          </div>
          <div class="card-post-lcv">
            <img class="card-post-icon" src="/assets/images/view.png" alt="view" />
            <div class="card-post-count">${post.viewCount || 0}</div>
          </div>
        </div>
        <div class="card-post-created">${post.updatedAt ? new Date(post.updatedAt).toLocaleString() : ''}</div>
      </div>
    </div>
    <div class="card-post-bottom">
      <img class="user-profile-img circular" src="${post.author.profileImageUrl || '/assets/images/account_circle.png'}" alt="profile" />
      <div class="user-id">${post.author.nickname || 'Anonymous'}</div>
    </div>
  `;
  
  // 클릭 이벤트 추가
  cardPost.addEventListener('click', () => {
    if (!Auth.isLoggedIn()) {
      location.href = '/login';
    } else {
      location.href = `/posts/detail?id=${post.id}`;
    }
  });
  
  return cardPost;
}
