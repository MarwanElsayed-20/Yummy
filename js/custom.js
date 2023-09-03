$(document).ready(() => {
  geGeneralMealsData().then(() => {
    $(".loading").fadeOut(500);
    $(".loading-search").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

// slide animation
let asideWidth = $(".side-bar").innerWidth() - 15;
let navWidth = $("nav").outerWidth(true);

$("aside").css("left", -asideWidth);
$("nav ul").css("bottom", -navWidth);

function openSideBar() {
  $("aside").animate({ left: 0 }, 500);
  $(".fa-solid.fa-bars").addClass("d-none");
  $(".fa-solid.fa-x").removeClass("d-none").addClass("d-block");
  $("nav ul").animate({ bottom: 0 }, 1000);
  $("nav ul a.link1").animate({ bottom: 0 }, 200, function () {
    $("nav ul a.link2").animate({ bottom: 0 }, 200, function () {
      $("nav ul a.link3").animate({ bottom: 0 }, 200, function () {
        $("nav ul a.link4").animate({ bottom: 0 }, 200, function () {
          $("nav ul a.link5").animate({ bottom: 0 }, 200);
        });
      });
    });
  });
}

function closeSideBar() {
  $("aside").animate({ left: -asideWidth }, 500);
  $(".fa-solid.fa-x").addClass("d-none");
  $(".fa-solid.fa-bars").removeClass("d-none").addClass("d-block");
  $("nav ul").animate({ bottom: -navWidth }, 500);
  $("nav ul a").animate({ bottom: -40 }, 500);
}

$(".fa-solid.fa-bars").click(openSideBar);
$(".fa-solid.fa-x").click(closeSideBar);

// api
let generalMealsBody = document.getElementById("generalMealsBody");
let search = document.getElementById("search");

// home page meals
let generalMeals = [];
async function geGeneralMealsData() {
  let generalMealsData = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  generalMealsData = await generalMealsData.json();
  generalMeals = generalMealsData.meals;
  displayGeneralMeals(generalMealsData.meals);
}

function displayGeneralMeals(meals) {
  let box = "";
  if (meals) {
    for (let i = 0; i < meals.length; i++) {
      box += `
      <div class="col-md-3 p-2" onclick="getMailDetails(${meals[i].idMeal})">
      <div
        class="meal bg-danger rounded-3 overflow-hidden position-relative"
      >
        <img
          class="img-fluid rounded-3"
          src="${meals[i].strMealThumb}"
          alt=""
        />
        <div
          class="overlay position-absolute rounded-3 d-flex justify-content-center align-items-center p-3 text-center"
        >
          <h2>${meals[i].strMeal}</h2>
        </div>
      </div>
    </div>
      `;
    }
  }
  generalMealsBody.innerHTML = box;
}

// meal details
async function getMailDetails(id) {
  $(".loading").fadeIn();
  let mealDetails = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  mealDetails = await mealDetails.json();
  displayMeal(mealDetails.meals[0]);
  $(".loading").fadeOut(500);
}

function displayMeal(meals) {
  generalMealsBody.innerHTML = "";
  box = `
  <div class="col-md-4 text-white">
    <img
      class="img-fluid rounded-3"
      src="${meals.strMealThumb}"
      alt=""
    />
    <h3>${meals.strMeal}</h3>
  </div>
  <div class="col-md-8 text-white">
    <h3 class="fw-bold">Instructions</h3>
    <p>
    ${meals.strInstructions}
    </p>
    <h3 class="fw-bold">
      Area : <span class="fw-semibold">${meals.strArea}</span>
    </h3>
    <h3 class="fw-bold">
      Category : <span class="fw-semibold">${meals.strCategory}</span>
    </h3>
    <h3 class="fw-bold">Recipe :</h3>
    <ul class="p-2">
    ${getMealRecipe(meals)}
    </ul>
    <h3 class="fw-bold">Tags :</h3>
    <ul class="p-2">
      ${getMealTags(meals)}
    </ul>
    <div class="source">
      <button class="btn btn-success">
        <a class="p-0" href="${meals.strSource}" target="_blank">Source</a>
      </button>
      <button class="btn btn-danger">
        <a class="p-0" href="${meals.strYoutube}" target="_blank">Youtube</a>
      </button>
    </div>
  </div>
  `;
  generalMealsBody.innerHTML = box;
}

function getMealRecipe(meals) {
  let recipe = "";

  for (let i = 1; i <= 20; i++) {
    if (meals[`strIngredient${i}`]) {
      recipe += `<li class="alert alert-info d-inline-block p-2 me-3">${
        meals[`strMeasure${i}`]
      } of ${meals[`strIngredient${i}`]}</li>`;
    }
  }
  return recipe;
}

function getMealTags(meals) {
  let tags;

  if (meals.strTags) {
    tags = meals.strTags.split(",");
  } else {
    tags = `N/A`;
  }

  let tag = ``;

  for (let i = 0; i < tags.length; i++) {
    tag += `
    <li class="alert alert-danger d-inline-block p-2 me-2">${tags[i]}</li>`;
  }
  return tag;
}

// search for meals
let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeSideBar();
  displaySearchInputs();
});

function displaySearchInputs() {
  generalMealsBody.innerHTML = "";

  search.innerHTML = `
  <div class="row justify-content-center g-3 pb-5">
  <div class="col-md-5">
    <input
      type="text"
      class="form-control"
      placeholder="Search by name ..."
      aria-label="First name"
      onkeyup="searchMealByName(this)"
    />
  </div>
  <div class="col-md-5">
    <input
      type="text"
      class="form-control"
      placeholder="Search by first letter ..."
      aria-label="Last name"
      maxlength="1"
      onkeyup="searchMealByFirstLetter(this)"
    />
  </div>
</div>
  `;
}

async function searchMealByName(name) {
  $(".loading-search").fadeIn();

  let mealName = name.value;
  let mealByName = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );
  mealByName = await mealByName.json();
  displayGeneralMeals(mealByName.meals);

  $(".loading-search").fadeOut(500);
}

async function searchMealByFirstLetter(letter) {
  $(".loading-search").fadeIn();

  if (letter.value) {
    let mealFirstLetter = letter.value;
    let mealByFirstLetter = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealFirstLetter}`
    );
    mealByFirstLetter = await mealByFirstLetter.json();
    displayGeneralMeals(mealByFirstLetter.meals);
  }

  $(".loading-search").fadeOut(500);
}

// categories
let categoriesBtn = document.getElementById("categoriesBtn");

categoriesBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeSideBar();
  getCategoriesData();
});

async function getCategoriesData() {
  $(".loading").fadeIn();

  let categoriesData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  categoriesData = await categoriesData.json();
  displayCategories(categoriesData.categories);

  $(".loading").fadeOut(500);
}

function displayCategories(categories) {
  generalMealsBody.innerHTML = "";
  search.innerHTML = "";

  let box = "";
  for (let i = 0; i < categories.length; i++) {
    box += `
    <div class="col-md-3 p-2" onclick="getCategoryMeal('${categories[
      i
    ].strCategory.toLowerCase()}')">
    <div
      class="meal bg-danger rounded-3 overflow-hidden position-relative"
    >
      <img
        class="img-fluid rounded-3 bg-black"
        src="${categories[i].strCategoryThumb}"
        alt=""
      />
      <div
        class="overlay position-absolute rounded-3 d-flex justify-content-center align-items-center flex-column p-2 text-center"
      >
        <h2>${categories[i].strCategory}</h2>
        <p>${categories[i].strCategoryDescription
          .split(" ")
          .slice(0, 25)
          .join(" ")}</p>
      </div>
    </div>
  </div>

    `;
  }
  generalMealsBody.innerHTML = box;
}

async function getCategoryMeal(category) {
  $(".loading").fadeIn();

  let categoryMealsData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  categoryMealsData = await categoryMealsData.json();
  let categoryMealsArr = categoryMealsData.meals.slice(0, 20);
  displayGeneralMeals(categoryMealsArr);

  $(".loading").fadeOut(500);
}

// area
let areaBtn = document.getElementById("areaBtn");

areaBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeSideBar();
  getAreaData();
});

async function getAreaData() {
  $(".loading").fadeIn();

  let areasData = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  areasData = await areasData.json();
  displayAreas(areasData.meals);
  console.log(areasData.meals);
  console.log("ss");

  $(".loading").fadeOut(500);
}

function displayAreas(areas) {
  generalMealsBody.innerHTML = "";
  search.innerHTML = "";

  let box = "";
  for (let i = 0; i < areas.length; i++) {
    box += `
    <div class="col-md-3 p-2" onclick="getAreaMeals('${areas[
      i
    ].strArea.toLowerCase()}')">
    <div
      class="meal bg-black text-center text-white rounded-3 overflow-hidden position-relative mb-3"
    >
    <i class="fa-solid fa-house-laptop"></i>
    <h2>${areas[i].strArea}</h2>
    </div>
  </div>
    `;

    generalMealsBody.innerHTML = box;
  }
}

async function getAreaMeals(area) {
  $(".loading").fadeIn();

  let areaMealsData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  areaMealsData = await areaMealsData.json();
  let areaMealsArr = areaMealsData.meals.slice(0, 20);
  displayGeneralMeals(areaMealsArr);

  $(".loading").fadeOut(500);
}

// ingredients
let ingredientsBtn = document.getElementById("ingredientsBtn");

ingredientsBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeSideBar();
  getIngredientsData();
});

async function getIngredientsData() {
  $(".loading").fadeIn();

  let ingredients = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  ingredients = await ingredients.json();
  let ingredientsArr = ingredients.meals.slice(0, 20);
  displayIngredients(ingredientsArr);

  $(".loading").fadeOut(500);
}

function displayIngredients(ingredients) {
  generalMealsBody.innerHTML = "";
  search.innerHTML = "";

  let box = "";
  for (let i = 0; i < ingredients.length; i++) {
    box += `
    <div class="col-md-3 p-2" onclick="getIngredientsMeals('${ingredients[
      i
    ].strIngredient.toLowerCase()}')">
    <div
      class="meal bg-black text-center text-white rounded-3 overflow-hidden position-relative mb-3"
    >
    <i class="fa-solid fa-drumstick-bite"></i>
    <h2>${ingredients[i].strIngredient}</h2>
    <p>${ingredients[i].strDescription.split(" ").slice(0, 25).join(" ")}</p>
    </div>
  </div>
    `;

    generalMealsBody.innerHTML = box;
  }
}

async function getIngredientsMeals(ingredient) {
  $(".loading").fadeIn();

  let ingredientMealsData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  ingredientMealsData = await ingredientMealsData.json();
  let ingredientMealsArr = ingredientMealsData.meals.slice(0, 20);
  displayGeneralMeals(ingredientMealsArr);

  $(".loading").fadeOut(500);
}

// contact us
let contactBtn = document.getElementById("contactBtn");

contactBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeSideBar();
  displayContactPage();
});

function displayContactPage() {
  search.innerHTML = "";
  generalMealsBody.innerHTML = `
  <div
  class="container w-75 vh-100 d-flex align-items-center justify-content-center"
>
  <form class="row g-3 needs-validation text-center" novalidate>
    <div class="col-md-6 user-name">
      <input
        placeholder="Enter your name"
        type="text"
        class="form-control"
        id="validationCustom01"
        required
        onkeyup="inputsValidation()"
      />
      <div class="invalid-feedback alert alert-danger ">
        <ul>
          <h4>Please enter a valid name.</h4>
          <li>Must be more than 1 character</li>
          <li>Must not end with space</li>
          <li>Must not contain any number order special character</li>
        </ul>
      </div>
      <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
    </div>
    <div class="col-md-6 email">
      <input
        placeholder="Enter your email"
        type="email"
        class="form-control"
        id="validationCustom02"
        required
        onkeyup="inputsValidation()"
      />
      <div class="invalid-feedback alert alert-danger ">
      <ul>
      <h4>Please enter a valid email.</h4>
      <li>Must contain @</li>
      <li>Must end with a domain EX: .com</li>
    </ul>
    </div>
      <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
    </div>
    <div class="col-md-6 phone-number">
      <div class="input-group has-validation">
        <input
          placeholder="Enter your phone number"
          type="text"
          class="form-control"
          id="validationCustom03"
          aria-describedby="inputGroupPrepend"
          required
          onkeyup="inputsValidation()"
        />
        <div class="invalid-feedback alert alert-danger ">
        <ul>
        <h4>Please enter a valid phone number.</h4>
        <li>Only numbers/li>
        <li>It must contain at least 10 numbers and maximum 12 numbers</li>
      </ul>
        </div>
        <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
      </div>
    </div>
    <div class="col-md-6 age">
      <input
        placeholder="Enter your age"
        type="number"
        class="form-control"
        id="validationCustom04"
        required
        onkeyup="inputsValidation()"
      />
      <div class="invalid-feedback alert alert-danger ">
      <ul>
      <h4>Please enter a valid age.</h4>
      <li>Cant be empty/li>
      <li>Cant be more than 2 numbers</li>
    </ul>
      </div>
      <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
    </div>
    <div class="col-md-6 password">
      <input
        placeholder="Enter your password"
        type="password"
        class="form-control"
        id="validationCustom05"
        required
        onkeyup="inputsValidation()"
      />
      <div class="invalid-feedback alert alert-danger ">
      <ul>
      <h4>Please enter a valid password.</h4>
      <li>Password length Must be 8 or more</li>
      <li>Must contain at least one number</li>
      <li>Must not contain any spaces</li>
    </ul>
      </div>
      <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
    </div>
    <div class="col-md-6 re-password">
      <input
        placeholder="Re-password"
        type="password"
        class="form-control"
        id="validationCustom06"
        required
        onkeyup="inputsValidation()"
      />
      <div class="invalid-feedback alert alert-danger ">
      <h4>Please enter the same password again.</h4>
      </div>
      <div class="valid-feedback bg-success text-white p-2 rounded-2">Looks good!</div>
    </div>
    <div class="col-12">
      <button id="submit" class="btn btn-outline-danger" type="submit" disabled>
        Submit
      </button>
    </div>
  </form>
</div>

  `;
}

function nameValidation() {
  let nameRegEx = /^[a-zA-Z]{2}(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if (nameRegEx.test(document.getElementById("validationCustom01").value)) {
    return true;
  } else {
    return false;
  }
}

function emailValidation() {
  let emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (emailRegEx.test(document.getElementById("validationCustom02").value)) {
    return true;
  } else {
    return false;
  }
}

function numberValidation() {
  let numberRegEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (numberRegEx.test(document.getElementById("validationCustom03").value)) {
    return true;
  } else {
    return false;
  }
}

function ageValidation() {
  let ageRegEx = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  if (ageRegEx.test(document.getElementById("validationCustom04").value)) {
    return true;
  } else {
    return false;
  }
}

function passwordValidation() {
  let passwordRegEx = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  if (passwordRegEx.test(document.getElementById("validationCustom05").value)) {
    return true;
  } else {
    return false;
  }
}

function rePasswordValidation() {
  if (
    document.getElementById("validationCustom06").value ==
    document.getElementById("validationCustom05").value
  ) {
    return true;
  } else {
    return false;
  }
}

function inputsValidation() {
  if (nameValidation()) {
    $(".user-name .valid-feedback").addClass("d-block");
    $(".user-name .invalid-feedback").removeClass("d-block");
  } else {
    $(".user-name .invalid-feedback").addClass("d-block");
    $(".user-name .valid-feedback").removeClass("d-block");
  }

  if (emailValidation()) {
    $(".email .valid-feedback").addClass("d-block");
    $(".email .invalid-feedback").removeClass("d-block");
  } else {
    $(".email .invalid-feedback").addClass("d-block");
    $(".email .valid-feedback").removeClass("d-block");
  }

  if (numberValidation()) {
    $(".phone-number .valid-feedback").addClass("d-block");
    $(".phone-number .invalid-feedback").removeClass("d-block");
  } else {
    $(".phone-number .invalid-feedback").addClass("d-block");
    $(".phone-number .valid-feedback").removeClass("d-block");
  }

  if (ageValidation()) {
    $(".age .valid-feedback").addClass("d-block");
    $(".age .invalid-feedback").removeClass("d-block");
  } else {
    $(".age .invalid-feedback").addClass("d-block");
    $(".age .valid-feedback").removeClass("d-block");
  }

  if (passwordValidation()) {
    $(".password .valid-feedback").addClass("d-block");
    $(".password .invalid-feedback").removeClass("d-block");
  } else {
    $(".password .invalid-feedback").addClass("d-block");
    $(".password .valid-feedback").removeClass("d-block");
  }

  if (rePasswordValidation()) {
    $(".re-password .valid-feedback").addClass("d-block");
    $(".re-password .invalid-feedback").removeClass("d-block");
  } else {
    $(".re-password .invalid-feedback").addClass("d-block");
    $(".re-password .valid-feedback").removeClass("d-block");
  }

  if (
    nameValidation() &&
    emailValidation() &&
    numberValidation() &&
    ageValidation() &&
    passwordValidation() &&
    rePasswordValidation()
  ) {
    $("#submit").removeAttr("disabled");
  } else {
    $("#submit").attr("disabled", "disabled");
  }
}
