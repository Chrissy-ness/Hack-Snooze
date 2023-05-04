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

//When the navigation submit button is clicked, show the submit form. 
$navSubmit.on("click", function(e) {
  e.preventDefault();
  $submitForm.show();
})

$navFav.on("click", function(e) {
  e.preventDefault();
  $allStoriesList.hide();
  $favoritedList.show();
})

//When submit is clicked, call on the api to create a new story and append it to the current story list. 
$submitBtn.on("click", async function(e) {
  e.preventDefault();
  const titleInt = $newTitle.val();
  const authorInt = $newAuthor.val();
  const urlInt = $newURL.val();

  const storyObj = {title: titleInt, author: authorInt, url: urlInt};

  let newStory = await storyList.addStory(currentUser, storyObj);
  
  if(newStory instanceof Story) {
    alert("New Story Added!");
  }

  this.hide();
})


//When a star is hovered on, change it's background color to yellow;

$body.on("mouseenter", ".material-symbols-outlined", function() {
  $(this).css({
    cursor: "pointer",
  })
})

$body.on("click", ".material-symbols-outlined", async function() {
  const mainClass = "material-symbols-outlined";
  const targetTHIS = $(this);
  const storyId = $(this).closest("li").attr("id");

  const targetData = await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "GET",
    params: {
      storyId: storyId
    },
  })

  const targetStory = targetData.data.story;
  
  $(this).attr("class") == mainClass ?  addToFav() : removeFromFav();
  
  async function addToFav() {
    targetTHIS.addClass("orange");
    currentUser.addFavoriteStory(targetStory);
    putFavoritesOnPage();
  }

  async function removeFromFav() {
    targetTHIS.removeClass("orange")
    currentUser.removeFavoriteStory(targetStory);
    console.log(currentUser.favorites);
    putFavoritesOnPage();
  }
})

$("#nav-all").on("click", function() {
  $favoritedList.hide();
})

$("#nav-own-stories").on("click", function(e) {
  e.preventDefault();
  $allStoriesList.hide();
  $favoritedList.hide();
  $ownStoriesList.show();
})

$body.on("click", ".deleter", async function() {
  const targetId = $(this).closest("li").attr('id');

  storyList.removeStory(currentUser, targetId);
  currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== targetId);
  putOwnOnPage();
})