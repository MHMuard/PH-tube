async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

let categories = [];
let isAscending = false;
let videos = [];
const loadData = async (id) => {
  document.getElementById("spinner").classList.remove("hidden");
  const emptyContainer = document.getElementById("empty");
  emptyContainer.innerHTML = "";
  const data = await fetchData(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  videos = data.data;
  document.getElementById("spinner").classList.add("hidden");
  if (videos.length > 0) {
    document.getElementById("sort-by").classList.remove("hidden");
    showVideos(videos);
  } else {
    document.getElementById("sort-by").classList.add("hidden");
    emptyContainer;
    showEmpty();
  }
};

const loadCategories = async (id) => {
  activeId = id;
  if (categories.length == 0) {
    const data = await fetchData(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    categories = data.data;
  }
  const categoryContainer = document.getElementById("categories-ul");
  categoryContainer.innerHTML = "";
  categories?.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <li  
    id = ${category.category_id}
    onclick="loadCategories(${category.category_id})"
    class="divide-y divide-dashed  ${
      id == category.category_id
        ? "bg-heroPrimary text-white"
        : "bg-heroGrayLight text-neutral-500"
    } rounded-md">
              <span class="sm:px-4 px-2.5 py-2 ">${category.category}</span>
            </li>`;
    categoryContainer.appendChild(div);
  });
  loadData(id);
};

const showEmpty = () => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  const emptyContainer = document.getElementById("empty");
  const div = document.createElement("div");
  div.innerHTML = `  <div class="drawing-div">
  <img src="./img/Icon.png" class="drawing-img" alt="" />
  <h2
    class="drawing-h2"
  >
    Oops!! Sorry, There is no content here
  </h2>
</div>`;
  emptyContainer.appendChild(div);
};

function sortViews(data, options) {
  const sortedData = data.sort((a, b) => {
    const aViews = parseInt(a.others.views);
    const bViews = parseInt(b.others.views);
    if (options) {
      console.log(options);
      return bViews - aViews;
    } else {
      console.log(options);
      return aViews - bViews;
    }
  });
  return sortedData;
};
const handleSort = () => {
  isAscending = !isAscending;
  if (!isAscending) {
    document
      .getElementById("sort-container")
      .setAttribute("data-tip", "Highest to Lowest");
  } else {
    document
      .getElementById("sort-container")
      .setAttribute("data-tip", "Lowest to Highest");
  }
  const sortedVideo = sortViews(videos, isAscending);
  showVideos(sortedVideo);
};
const showVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  videos?.forEach((video) => {
    const div = document.createElement("div");
    div.innerHTML = ` <div
    class="video-div"
  >
  <figure class="video-fig sm:h-[200px]">
  <img
    src="${video.thumbnail}"
    class="video-img"
    alt="product"
  />
  <div
    class="video-time"
  >
  <span> ${
    video?.others?.posted_date && formatTime(video?.others?.posted_date)
  }</span>
  </div>
</figure>
    <div class="flex gap-3 mt-5">
      <div class="w-fit mt-0.5">
        <div class="avatar">
          <div class="w-10  rounded-full">
            <img src=${video?.authors[0].profile_picture} />
          </div>
        </div>
      </div>
      <div class="flex-1">
        <h3
          class="video-title text-neutral-950 max-w-prose line-clamp-2 font-bold text-base "
        >
        ${video.title}
        </h3>
        <div class="flex gap-2  mt-2 mb-2 items-center">
          <p class="text-sm text-heroText">${video?.authors[0].profile_name}</p>
         ${
           video?.authors[0].verified
             ? '<img src="./fi_10629607.svg" alt="" />'
             : ""
         }
        </div>
        <p class="text-sm mt-2 text-heroText">${video?.others?.views} views</p>
      </div>
    </div>
  </div>`;
    videoContainer.appendChild(div);
  });
};


function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} ${
      remainingMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }
};
tailwind.config = {
    theme: {
        extend: {
        colors: {
            heroPrimary: "#FF1F3D",
            "light-pink": "#FBC0A8",
            heroGray: "rgba(37, 37, 37, 0.20);",
            heroGrayLight: "rgba(37, 37, 37, 0.15)",
            heroText: "rgba(23, 23, 23, 0.70)",
        },
        },
    },
};

loadCategories("1000");