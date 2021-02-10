// declearing all variables to use different function
const searchBtn = document.getElementById('submit');
const mealsNotFound = document.getElementById('wrong-search');
const mealsShow = document.getElementById('showing-meals');
const mealsDiv = document.getElementById('single-meal-details');
const spinner = document.getElementById("spinner");

// Search Button To take Meal name
searchBtn.addEventListener('click', function () {
    const mealsName = document.getElementById('meal-name').value;
    mealsShow.innerHTML = '';
    if (mealsName === '') {
        mealsNotFound.style.display = 'block';
    }
    if (mealsName.length >= 1) {
        spinner.removeAttribute('hidden');
        fetchMealsData(mealsName);
        mealsNotFound.style.display = 'none';
    }
});

// validation and calling api to fetch meal information
const fetchMealsData = mealsName => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealsName}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            spinner.setAttribute('hidden', '');
            if(data.meals == null || data.meals == undefined || data.meals === ''){
                mealsNotFound.style.display = 'block';
            } else{
                displayMealsData(data.meals)
            }
        }).catch(error => console.log(error));
}

// displaying all meals information using api
const displayMealsData = mealsInfo => {
    const mealsDiv = document.getElementById('showing-meals');
    mealsInfo.forEach(meal => {
        const mealDiv = document.createElement('div');
        const mealInfo = `
        <div class="col">
        <div class="card h-100 text-center" onClick="singleMealDeatils(${meal.idMeal});">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-footer">
            <small class="text-muted"><b>${meal.strMeal}</b></small>
          </div>
        </div>
        </div>`;
        mealDiv.innerHTML = mealInfo;
        mealsDiv.appendChild(mealDiv);
    });
}

// for showing individual meals information
const singleMealDeatils = idMeal =>{
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    fetch(url)
    .then(res => res.json())
    .then(data => renderMealInfo(data.meals[0]))
    .catch(error => console.log(error));
}

// rendering individual meals information
const renderMealInfo = mealsId =>{
    console.log(mealsId.idMeal);
    let ingredientAndMeasures = [];
    for (let item = 1; item <= 20; item++) {
        if (mealsId[`strIngredient${item}`]) {
            ingredientAndMeasures.push(`${mealsId[`strMeasure${item}`]} ${mealsId[`strIngredient${item}`]}`);
        } else {
            break;
        }
    }
    mealsDiv.innerHTML = `
    <img src="${mealsId.strMealThumb}" class="rounded img-fluid" alt="...">
        <h2 class="py-3">${mealsId.strMeal}</h2>
        <h5 class="py-3">Ingredients</h5>
        ${ingredientAndMeasures.map((ingredientAndMeasure) =>`
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
          <label class="form-check-label" for="flexCheckChecked">
          ${ingredientAndMeasure}
          </label>
        </div>`).join('')}`;
}