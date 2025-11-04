$(document).ready(function () {
    $.ajax({
      url: "https://jadog1.github.io/Jadon-Steinmetz/metadata.json",
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

function HandleMeta(meta) {
  window.metaData = meta; // Store metadata globally for tag ordering
  allProjects = meta.projects; // Store projects
  GenerateWorkExperience(meta.work);
  GenerateTags(meta.tags);
  GenerateProjectTagFilters(meta.projects); // Generate filter buttons
  GenerateProjects(meta.projects);
  GenerateAboutMe(meta.aboutMe);
  EventHandlers();
}  function GenerateAboutMe(loadedInfo) {
    let shortenedText = loadedInfo.slice(0, 200);
  
    $("#aboutMe").append(`
    <span class="hidden fullText">${loadedInfo}</span>
      <span class="hidden shortenedText">${shortenedText}...</span>
      <span class="shortened-description text-gray-700 mb-2">${shortenedText}...</span>
      <button class="text-blue-600 text-sm font-semibold hover:text-blue-700 transition focus:outline-none">Read More</button>
    `);
  }
  
  function GenerateTags(loadedTags) {
    let allTags = new Set();
    for (const [key, tags] of Object.entries(loadedTags)) {
      tags.forEach(allTags.add, allTags);
      let parent = $("#" + key);
      drawTags(parent, tags);
    }
    let sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b))
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
  // Collect all unique tags from projects
  let allTags = new Set();
  projects.forEach(project => {
    project.tags.forEach(tag => allTags.add(tag));
  });
  
  // Get ordered tags from metadata if available
  let orderedTags = [];
  let remainingTags = new Set(allTags);
  
  // If tagOrder exists in metadata, use it to order tags
  if (window.metaData && window.metaData.tagOrder && window.metaData.tagOrder.categories) {
    window.metaData.tagOrder.categories.forEach(category => {
      category.tags.forEach(tag => {
        if (allTags.has(tag)) {
          orderedTags.push(tag);
          remainingTags.delete(tag);
        }
      });
    });
  }
  
  // Append any remaining tags that weren't in the order list (sorted alphabetically)
  let sortedRemaining = Array.from(remainingTags).sort((a, b) => a.localeCompare(b));
  orderedTags = orderedTags.concat(sortedRemaining);
  
  // Add "All" button first
  $("#projectTagFilters").append(
    `<button class="tag-filter-btn active px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-black" data-tag="all">All</button>`
  );
  
  // Add individual tag buttons in order
  orderedTags.forEach(tag => {
    $("#projectTagFilters").append(
      `<button class="tag-filter-btn px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-black" data-tag="${tag}">${tag}</button>`
    );
  });
}  function FilterProjects(selectedTag) {
    let filteredProjects = selectedTag === "all" 
      ? allProjects 
      : allProjects.filter(project => project.tags.includes(selectedTag));
    
    // Clear and regenerate projects
    $("#projects").empty();
    filteredProjects.forEach(project => {
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
      <!-- Trigger button -->
      <span class="relative">
        <button type="button" class="popover-button py-1 rounded font-medium text-gray-700 hover:text-blue-600 transition text-sm">${work.title} <i class="fa-solid fa-circle-info text-blue-600"></i>
        </button>
  
        <!-- Popover content -->
        <div class="popover-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
          <div class="p-6 bg-white rounded-lg shadow-2xl max-w-xl m-4 animate-slide-up">
              <p class="text-gray-700 leading-relaxed mb-4 text-sm">${work.description}</p>
              <button class='bg-gray-900 text-white px-4 py-2 rounded-md float-right hover:bg-gray-800 transition' onclick='hideAllPopovers()'>
              Close
            </button>
            </div>
          </div>
      </span>
      <!-- End popover -->
      <br />
      <!-- These tags are auto-generated from json file -->
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
    // Add event handlers to the popover buttons
    $(".popover-button").on({
      click: function () {
        hideAllPopovers();
        $(this).siblings(".popover-content").removeClass("hidden");
      }
    });
  
    // Read more/less toggle
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
    
    // Tag filter buttons
    $(".tag-filter-btn").on("click", function () {
      // Remove active class from all buttons
      $(".tag-filter-btn").removeClass("active");
      // Add active class to clicked button
      $(this).addClass("active");
      
      // Get selected tag and filter
      let selectedTag = $(this).data("tag");
      FilterProjects(selectedTag);
      
      // Re-attach event handlers for newly created elements
      AttachProjectEventHandlers();
    });
  }
  
  function AttachProjectEventHandlers() {
    // Reattach read more/less handlers for project cards
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
  