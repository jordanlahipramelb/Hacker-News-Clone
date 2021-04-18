'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - showDeleteBtn: show delete button?
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // show favorite/unfavorite star for logged in user
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${deleteBtn ? deleteBtnHTML() : ''}
        ${showStar ? starBtnHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}</a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//Create DELETE button for HTML

function deleteBtnHTML() {
  return `
      <span class="trash-can"><i class="fas fa-trash-alt"></i></span>`;
}

// Toggle favorite/unfavorite
function starBtnHTML(story, user) {
  // isFavoriteStory method from User class in models.js
  const isFavoriteStory = user.isFavoriteStory(story);

  //fas is solid star, far is open star
  const starType = isFavoriteStory ? 'fas' : 'far';
  return `
      <span class="star"><i class="${starType} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Handles deleting a story

async function deleteStory(evt) {
  console.debug('deleteStory');
  //closest Li is selected nearest clicked target
  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);
  // reloads story list
  await putUserStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory);

//Handles submit new story form
async function submitNewStory(evt) {
  console.debug('submitNewStory');
  evt.preventDefault();

  // gather values inputed from submit new story form
  const author = $('#author').val();
  const title = $('#title').val();
  const url = $('#url').val();

  const username = currentUser.username;
  const storyData = { title, url, author, username };

  // StoryList class -> addStory() from models.js file
  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide the form and reset it
  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}

$submitForm.on('submit', submitNewStory);

// Generate markup for list of user's own stories
// Puts the stories on to the page

function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage');
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append('<h2>No stories added by user</h2>');
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// Generate markup for list of favorited stories
// Puts the stories on to the page

function putFavoritesListOnPage() {
  console.debug('putFavoritesListOnPage');

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append('<h2>No favorites</h2>');
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

//Toggles favoriting/unfavoriting a story

async function toggleStoryFavorite(evt) {
  console.debug('toggleStoryFavorite');

  const $target = $(evt.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // checks to see if the target is favorited
  // fas is a solid star
  if ($target.hasClass('fas')) {
    // toggles story to unfavorite, star is toggled to open star
    await currentUser.removeFavorite(story);
    $target.closest('i').toggleClass('fas far');
  } else {
    // cdo the opposite if not favorited
    await currentUser.addFavorite(story);
    $target.closest('i').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite);
