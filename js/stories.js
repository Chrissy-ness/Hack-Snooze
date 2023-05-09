"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  OwnStoriesOnPage();
  favoritesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    currentUser.favorites.some(s => s.storyId === story.storyId) ? addFaveStar($story) : addStar($story);

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function OwnStoriesOnPage() {
  console.debug("ownStoriesOnPage");

  $ownList.empty();
  if(currentUser.ownStories.length == "") {
    $ownList.append($("<p>User has no story to share...</p>"));
  }

  else {
    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      const $originText = $story.find(".story-user").text();
      
      $story.find(".story-user").html(`${$originText} <button class="delete">Delete</button>`);
      $ownList.append($story);
    }

    $ownList.hide();
  }
}



function favoritesOnPage() {
  if(currentUser.favorites.length === 0) {
    $favoritesList.append($("<p>User has no favorite story...</p>"));
  }

  else {
    for(let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    addFaveStar($story);
    $favoritesList.append($story);
    }
  }
}

function addStar(targetElement) {
  targetElement.prepend($('<span class="material-symbols-outlined">star</span>'))
}

function addFaveStar(targetElement) {
  targetElement.prepend($('<span class="material-symbols-outlined orange">star</span>'))
}