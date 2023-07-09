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
  
  function HandleMeta(meta) {
    GenerateWorkExperience(meta.work);
    GenerateTags(meta.tags);
    GenerateProjects(meta.projects);
    GenerateAboutMe(meta.aboutMe);
    EventHandlers();
  }
  
  function GenerateAboutMe(loadedInfo) {
    let shortenedText = loadedInfo.slice(0, 200);
  
    $("#aboutMe").append(`
    <span class="hidden fullText">${loadedInfo}</span>
      <span class="hidden shortenedText">${shortenedText}...</span>
      <span class="shortened-description text-gray-600 mb-2">${shortenedText}...</span>
      <button class="text-blue-500 text-sm font-medium focus:outline-none">Read More</button>
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
        `<span class='px-2 py-1 rounded bg-blue-400 mt-2 mr-2 inline-block'>${tag}</span>`
      );
    });
  }
  
  function GenerateWorkExperience(loadedWork) {
    for (let i = 0; i < loadedWork.length; i++) {
      drawWorkExperience(loadedWork[i]);
      if (i < loadedWork.length - 1) $("#workExperiences").append("<br /><hr />");
    }
  }
  
  function drawWorkExperience(work) {
    $("#workExperiences").append(`
    <span class="text-lg text-blue-400 hover:underline underline-offset-2">
    <a href="${work.companylink}">${work.company}</a>
      </span>
      <span class="lg:hidden"><br /></span>
      <span class="text-yellow-600 lg:float-right space-y-1"><i class="fa-regular fa-calendar-days"></i>&emsp;${work.daterange}</span>
      <br />
      <!-- Trigger button -->
      <span class="relative">
        <button type="button" class="popover-button py-1 rounded">${work.title} <i class="fa-solid fa-circle-info text-blue-800"></i>
        </button>
  
        <!-- Popover content -->
        <div class="popover-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-10">
          <div class="p-2 bg-white rounded-lg shadow-lg max-w-xl">
              ${work.description} <br/>
              <button class='bg-blue-400 text-black px-2 py-1 float-right m-2' onclick='hideAllPopovers()'>
              Close
            </button>
            </div>
          </div>
      </span>
      <!-- End popover -->
      <br />
      <!-- These tags are auto-generated from json file -->
      <div id="${work.id}"></div>
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
    <div class="border p-4 w-4/5 m-auto">
      <h3 class="text-lg font-semibold w-full text-center text-blue-400 underline-2 hover:underline"><a href="${
        project.link
      }">${project.title}</a></h3>
      <div class="mb-2">
      <span class="hidden fullText">${project.description}</span>
      <span class="hidden shortenedText mb-4">${shortenedText}...</span>
      <span class="shortened-description text-gray-600 mb-4">${shortenedText}...</span>
      <button class="text-blue-500 text-sm font-medium focus:outline-none">Read More</button> </div>
      ${project.tags
        .map(
          (value) =>
            `<span class="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded p-1">${value}</span>`
        )
        .join("&ensp;")}
      
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
  }
  function hideAllPopovers() {
    $(".popover-content").addClass("hidden");
  }
  