"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  putFavoritesOnPage();
  putOwnOnPage();
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

  let favoriteIdsMap = currentUser.favorites.map(s => s.storyId);

  if(favoriteIdsMap.includes(story.storyId)) {
    
  return $(`
      <li id="${story.storyId}">
      <span class="material-symbols-outlined orange">star</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }

  else {
    return $(`
      <li id="${story.storyId}">
      <span class="material-symbols-outlined">star</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function generateFavoriteStoryMarkUp(story) {
  const hostName = "hostname.com"

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

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoritedList.empty();

  for(let story of currentUser.favorites) {
    const $story = generateFavoriteStoryMarkUp(story);
    $favoritedList.append($story);
  }

  $favoritedList.hide();
}

function generateOwnStoryMarkUp(story) {
  const hostName = "hostname.com"

  return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <button type="delete" class="deleter">remove</button>
    </li>
  `);
}

function putOwnOnPage() {
  console.debug("putFavoritesOnPage");

  $ownStoriesList.empty();

  for(let story of currentUser.ownStories) {
    const $story = generateOwnStoryMarkUp(story);
    $ownStoriesList.append($story);
  }

  $ownStoriesList.hide();
}

