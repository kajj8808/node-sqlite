let currentPage = 0;

const imageContainer = document.querySelector(".image_container");
const titleContainer = document.querySelector(".title-container");
const imageViewer = document.querySelector(".image_viewer");
const closeButton = document.querySelector(".close_btn");

const subtitle = titleContainer.querySelector("h3");

const footerContainer = document.querySelector("footer");

const checkCurrentGroupName = (groupName) =>
  groupName === "group_one" || groupName === "group_two" || groupName === "all";

const pathParts = window.location.pathname.split("/");
const groupName = pathParts[pathParts.length - 1];

function onImageClick(e) {
  imageViewer.style.backgroundImage = e.target.style.backgroundImage;
  imageViewer.classList.remove("hidden");
  imageViewer.classList.add("visible");
  lockScroll();
}

function onCloseClick() {
  imageViewer.classList.remove("visible");
  imageViewer.classList.add("hidden");
  unlockScroll();
}

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

function clearAllContent() {
  try {
    const subtitle = titleContainer.querySelector("h3");
    imageContainer.innerHTML = "";
    footerContainer.innerHTML = "";
    subtitle.innerText = "";
  } catch (error) {
    console.error(error);
  }
}

function renderContents(contents) {
  contents.map((content) => {
    const imageBox = document.createElement("div");
    imageBox.style.backgroundImage = `url("/image/${content.image}")`;
    imageBox.classList.add("image_box");
    imageBox.id = content.id;
    imageBox.addEventListener("click", onImageClick);

    imageContainer.appendChild(imageBox);
  });
}

function renderPaginationButtons({ groupName, pages }) {
  for (let page = 0; page < pages; page++) {
    const button = document.createElement("button");
    button.innerText = page + 1;

    if (currentPage === page) {
      button.classList.add("current_page");
    }

    button.addEventListener("click", () => {
      // page 가 1부터 시작하는 관계로.. -1
      currentPage = page;
      fetchAndRenderGroup(groupName, page);
    });

    footerContainer.appendChild(button);
  }
}

async function fetchAndRenderGroup(groupName, page = 0) {
  // get data with aws server. ( 10개씩 )
  const limit = 18;
  const offset = page * limit;
  const json = await (
    await fetch(
      `/get_contents/group?name=${groupName}&limit=${limit}&offset=${offset}`
    )
  ).json();
  // response ok
  if (json.ok) {
    // make images ... 😊
    const contents = json.contents;
    const totalPages = json.totalPages;
    // clear page!
    clearAllContent();
    // subtitle
    subtitle.innerText = groupName;
    titleContainer.appendChild(subtitle);
    // contents
    renderContents(contents);
    //groupName, json.totalPages
    renderPaginationButtons({
      groupName: groupName,
      pages: totalPages,
    });
  }
}

function replacePage(url) {
  location.assign(url);
}

async function main() {
  const body = document.querySelector("body");
  body.classList.add("visible");

  if (checkCurrentGroupName(groupName)) {
    fetchAndRenderGroup(groupName, 0);
  }
}

window.onload = () => {
  main();
};

imageViewer.addEventListener("click", onCloseClick);
closeButton.addEventListener("click", onCloseClick);
