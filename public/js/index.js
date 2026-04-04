$(document).ready(function () {
  if (HandleRequestedView()) {
    return;
  }

  $.ajax({
    url: "metadata.json",
    cache: true,
    dataType: "json"
  })
    .done(function (result) {
      HandleMeta(result);
    })
    .catch(function (err) {
      alert("Failed loading JSON");
      console.error(err);
    });
});

let allProjects = []; // Store all projects globally for filtering

function HandleRequestedView() {
  let params = new URLSearchParams(window.location.search);
  let requestedView = (params.get("view") || params.get("page") || "").toLowerCase();

  if (requestedView !== "resume") {
    return false;
  }

  let targetUrl = new URL("resume.html", window.location.href);
  let hash = window.location.hash;

  if (hash) {
    targetUrl.hash = hash;
  }

  window.location.replace(targetUrl.toString());
  return true;
}

function HandleMeta(meta) {
  window.metaData = meta; // Store metadata globally for tag ordering
  allProjects = meta.projects; // Store projects
  GenerateWorkExperience(meta.work);
  GenerateTags(meta.tags);
  GenerateProjectTagFilters(meta.projects);
  GenerateProjects(meta.projects);
  GenerateAboutMe(meta.aboutMe);
  EventHandlers();
}

function GenerateAboutMe(loadedInfo) {
  $("#aboutMe").append(`
  <span class="fullText">${loadedInfo}</span>
  `);
}

function GenerateTags(loadedTags) {
  let allTags = new Set();
  for (const [key, tags] of Object.entries(loadedTags)) {
    tags.forEach(allTags.add, allTags);
    let parent = $("#" + key);
    drawTags(parent, tags);
  }
  let sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b));
  drawTags($("#allTags"), sortedTags);
}

function drawTags(parent, tags) {
  tags.forEach((tag) => {
    parent.append(
      `<span class='px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-200 transition inline-block'>${tag}</span>`
    );
  });
}

function GenerateProjectTagFilters(projects) {
  const filterContainer = $("#projectTagFilters");
  filterContainer.empty();

  let allTags = new Set();
  projects.forEach((project) => {
    project.tags.forEach((tag) => allTags.add(tag));
  });

  // Search keeps long tag lists easy to navigate without growing the panel.
  filterContainer.append(
    `<div class="mb-3 sticky top-0 bg-gray-50 pb-3 z-10 border-b border-gray-200">
      <label for="projectTagSearch" class="sr-only">Search project tags</label>
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input id="projectTagSearch" type="text" placeholder="Search tags..." class="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
    </div>`
  );

  filterContainer.append(`<div id="projectTagFilterGroups" class="space-y-4"></div>`);
  const filterGroups = $("#projectTagFilterGroups");

  function appendCategory(name, tags) {
    if (!tags.length) {
      return;
    }

    const chips = tags
      .map((tag) => {
        const isAll = tag.toLowerCase() === "all";
        const displayTag = isAll ? "All" : tag;
        const tagValue = isAll ? "all" : tag;
        return `<button class="tag-filter-btn px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 hover:text-black" data-tag="${tagValue}" data-label="${displayTag.toLowerCase()}">${displayTag}</button>`;
      })
      .join("");

    filterGroups.append(
      `<div class="tag-filter-group">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">${name}</h4>
        <div class="flex flex-wrap gap-2">${chips}</div>
      </div>`
    );
  }

  appendCategory("Quick", ["all"]);

  if (window.metaData && window.metaData.tagOrder && window.metaData.tagOrder.categories) {
    let uncategorizedTags = new Set(allTags);

    window.metaData.tagOrder.categories.forEach((category) => {
      let categoryTags = category.tags.filter((tag) => allTags.has(tag));

      if (categoryTags.length > 0) {
        appendCategory(category.name, categoryTags);
        categoryTags.forEach((tag) => uncategorizedTags.delete(tag));
      }
    });

    if (uncategorizedTags.size > 0) {
      let sortedRemaining = Array.from(uncategorizedTags).sort((a, b) => a.localeCompare(b));
      appendCategory("Other", sortedRemaining);
    }
  } else {
    let sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b));
    appendCategory("Tags", sortedTags);
  }

  $(".tag-filter-btn[data-tag='all']").addClass("active");
}

function ApplyTagSearch(query) {
  const normalizedQuery = (query || "").toLowerCase().trim();

  $("#projectTagFilterGroups .tag-filter-group").each(function () {
    let visibleTagCount = 0;

    $(this).find(".tag-filter-btn").each(function () {
      const label = $(this).data("label") || "";
      const shouldShow = !normalizedQuery || label.includes(normalizedQuery);
      $(this).toggleClass("hidden", !shouldShow);
      if (shouldShow) {
        visibleTagCount += 1;
      }
    });

    $(this).toggleClass("hidden", visibleTagCount === 0);
  });
}

function FilterProjects(selectedTag) {
  let filteredProjects = selectedTag === "all"
    ? allProjects
    : allProjects.filter((project) => project.tags.includes(selectedTag));

  $("#projects").empty();
  filteredProjects.forEach((project) => {
    drawProject(project);
  });
}

function GenerateWorkExperience(loadedWork) {
  for (let i = 0; i < loadedWork.length; i++) {
    drawWorkExperience(loadedWork[i]);
    if (i < loadedWork.length - 1) $("#workExperiences").append("<hr class='my-5 border-gray-200' />");
  }
}

function drawWorkExperience(work) {
  $("#workExperiences").append(`
  <div class="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
    <span class="text-lg font-semibold text-gray-900">
      <a href="${work.companylink}" target="_blank" class="hover:text-blue-600 transition">${work.company}</a>
    </span>
    <span class="lg:hidden"><br /></span>
    <span class="text-gray-600 lg:float-right text-sm"><i class="fa-regular fa-calendar-days"></i>&emsp;${work.daterange}</span>
    <br />
    <span class="relative">
      <button type="button" class="popover-button py-1 rounded font-medium text-gray-700 hover:text-blue-600 transition text-sm">${work.title} <i class="fa-solid fa-circle-info text-blue-600"></i>
      </button>

      <div class="popover-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
        <div class="p-6 bg-white rounded-lg shadow-2xl max-w-xl m-4 animate-slide-up">
            <p class="text-gray-700 leading-relaxed mb-4 text-sm">${work.description}</p>
            <button class='bg-gray-900 text-white px-4 py-2 rounded-md float-right hover:bg-gray-800 transition' onclick='hideAllPopovers()'>
            Close
          </button>
          </div>
        </div>
    </span>
    <br />
    <div id="${work.id}" class="mt-3 flex flex-wrap gap-2"></div>
  </div>
  `);
}

function GenerateProjects(loadedProjects) {
  for (let i = 0; i < loadedProjects.length; i++) {
    drawProject(loadedProjects[i]);
  }
}

function drawProject(project) {
  let shortenedText = project.description.slice(0, 100);
  $("#projects").append(`
  <div class="project-card border border-gray-200 p-5 rounded-lg bg-white hover:border-blue-300" data-tags='${JSON.stringify(project.tags)}'>
    <h3 class="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
      <a href="${project.link}" target="_blank">${project.title}</a>
    </h3>
    <div class="mb-4">
      <span class="hidden fullText">${project.description}</span>
      <span class="hidden shortenedText mb-4">${shortenedText}...</span>
      <span class="shortened-description text-gray-700 mb-4 leading-relaxed text-sm">${shortenedText}...</span>
      <button class="text-blue-600 text-xs font-semibold hover:text-blue-700 transition focus:outline-none">Read More</button>
    </div>
    <div class="flex flex-wrap gap-1.5">
      ${project.tags
        .map(
          (value) =>
            `<span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200 font-medium">${value}</span>`
        )
        .join("")}
    </div>
  </div>
  `);
}

function EventHandlers() {
  $(".popover-button").on({
    click: function () {
      hideAllPopovers();
      $(this).siblings(".popover-content").removeClass("hidden");
    }
  });

  $(".shortened-description + button").on("click", function () {
    let shortenedText = $(this).prevAll(".shortenedText").text();
    let fullText = $(this).prevAll(".fullText").text();
    $(this).text(function (_, text) {
      $(this)
        .prev(".shortened-description")
        .text(text == "Read More" ? fullText : shortenedText);
      return text === "Read More" ? "Read Less" : "Read More";
    });
  });

  $("#toggleFilters").on("click", function () {
    $("#projectTagFilters").toggleClass("hidden");
    $("#filterChevron").toggleClass("rotate-180");

    if (!$("#projectTagFilters").hasClass("hidden")) {
      $("#projectTagSearch").val("");
      ApplyTagSearch("");
    }
  });

  $("#projectTagSearch").on("input", function () {
    ApplyTagSearch($(this).val());
  });

  $(".tag-filter-btn").on("click", function () {
    $(".tag-filter-btn").removeClass("active");
    $(this).addClass("active");

    let selectedTag = $(this).data("tag");
    let displayTag = selectedTag === "all" ? "All" : selectedTag;

    $("#selectedFilterTag").text(displayTag);

    $("#projectTagFilters").addClass("hidden");
    $("#filterChevron").removeClass("rotate-180");

    FilterProjects(selectedTag);
    AttachProjectEventHandlers();
  });
}

function AttachProjectEventHandlers() {
  $(".project-card .shortened-description + button").off("click").on("click", function () {
    let shortenedText = $(this).prevAll(".shortenedText").text();
    let fullText = $(this).prevAll(".fullText").text();
    $(this).text(function (_, text) {
      $(this)
        .prev(".shortened-description")
        .text(text == "Read More" ? fullText : shortenedText);
      return text === "Read More" ? "Read Less" : "Read More";
    });
  });
}

function hideAllPopovers() {
  $(".popover-content").addClass("hidden");
}
  