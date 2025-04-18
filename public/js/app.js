const mainContainer = document.querySelector(".main-container");
const loadingConatiner = document.querySelector(".loading");
function replacePage(url) {
  loadingConatiner.classList.add("active");
  // 간단한 page loading 표시
  setTimeout(() => {
    loadingConatiner.classList.remove("active");
  }, 300);
  location.assign(url);
}

mainContainer.classList.add("active");
