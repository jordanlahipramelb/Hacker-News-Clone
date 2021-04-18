'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);

  // hides pretty much everything on the page. After calling this, individual components can re-show just what they want.
  hidePageComponents();
  //function from stories.js
  putStoriesOnPage();
}
$body.on('click', '#nav-all', navAllStories);

// Show submit story form when submit is clicked on nav

function navSubmitStoryClick(evt) {
  console.debug('navSubmitStoryClick', evt);
  hidePageComponents();
  $submitForm.show();
}
$navSubmitStory.on('click', navSubmitStoryClick);

// Show favorite stories list when favorites is clicked on nav

function navFavoritesClick(evt) {
  console.debug('navFavoritesClick', evt);
  hidePageComponents();
  putFavoritesListOnPage();
}
$body.on('click', '#nav-favorites', navFavoritesClick);

// Show user's stories when my stories is clicked in the nav

function navMyStories(evt) {
  console.debug('navMyStories', evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}
$body.on('click', '#nav-my-stories', navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
