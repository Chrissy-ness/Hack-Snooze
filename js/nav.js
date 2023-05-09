"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show create form when the nav-create is clicked
 *  Get the values of the inputs when submit is clicked, then reset all values and alert user that story has been created
 *  Reset all values and hide submit form container when cancel is clicked
 */

$navCreate.on("click", function(e) {
  e.preventDefault();
  $submitContainer.show();
})

$submit.on("click", async function(e) {
  e.preventDefault();

  let $title = $("input[placeholder|=Title").val();
  let $author = $("input[placeholder|=Author").val();
  let $url = $("input[placeholder|=URL").val();

  /** Check for valid url */
  const response = $url.includes("http://") || $url.includes("https://") ? true : false;

  if(response !== true) {
    return alert("URL must include (http://) or (https://)");
  } 

  /** Use addStory method from models.js */
  let newStory = await storyList.addStory(currentUser, {
    title: $title, 
    author: $author, 
    url: $url,
  });

  newStory instanceof Story ? alert("New story added! Reloading Page!") : alert("Failed to create story!");
  $submitForm.trigger("reset");
  $submitContainer.hide(); 

  setTimeout(function() {
    location.reload(true);
  },2000);
})

$cancel.on("click", function(e) {
  e.preventDefault();

  $submitForm.trigger("reset");
  $submitContainer.hide();
})

$navOwn.on("click", function(e) {
  e.preventDefault();

  $allStoriesList.hide();
  $favoritesList.hide();
  $ownList.show();
})

$body.on("click", ".delete", async function(e) {
  e.preventDefault();

  const storyId = $(this).closest("li").attr("id");
  const response = await storyList.removeStory(currentUser, storyId);

  if(response === true) {
    alert("Story has been deleted! Reloading Page!");
    
    setTimeout(function() {
      location.reload(true);
    },2000);
  }
})

$navAll.on("click", function(e) {
  $ownList.hide();
  $favoritesList.hide();
})

/** When star is clicked, add events and append to page */
$body.on("mouseenter", ".material-symbols-outlined", function() {
  $(this).css({cursor: "pointer"});
})

$body.on("click", ".material-symbols-outlined", async function(e) {
  e.preventDefault();
  const $clickedStar = $(this);
  const storyId = $clickedStar.closest("li").attr("id");
  const response = await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "GET",
    params: {storyId: storyId}
  })
  
  const story = response.data.story;

  $clickedStar.attr("class") === "material-symbols-outlined" ? addFavorite() : removeFavorite();

  async function addFavorite() {
    $clickedStar.addClass("orange");
    await currentUser.addToFavorites(story);

    alert("Added a new favorite! Refreshing Page!");

    setTimeout(function() {
      location.reload(true);
    },2000);
  }

  async function removeFavorite() {
    $clickedStar.removeClass("orange");
    await currentUser.removeFromFavorites(story);

    alert("Removed a favorite! Refreshing Page!");

    setTimeout(function() {
      location.reload(true);
    },2000);
  }
})

$navFave.on("click", function(e) {
  e.preventDefault();

  $allStoriesList.hide();
  $ownList.hide();

  $favoritesList.show();
})