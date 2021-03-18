import React, { useState } from 'react';
import Axios from 'axios';
import './sass/App.sass';
import { motion } from 'framer-motion';
import Dishes from './Dishes';

const App = () => {
  const [actualIngredientName, setActualIngredientName] = useState('your product');
  const [actualIngredientCalories, setActualIngredientCalories] = useState(0);
  const [actualIngredientPhoto, setActualIngredientPhoto] = useState("https://image.flaticon.com/icons/png/512/985/985552.png");
  const dishObj = {
    name: 'Dish name',
    ingredients: [
      { ingredientName: 'bread', ingredientCal: 200, ingredientWeight: 10, ingredientPhoto: actualIngredientPhoto },
      { ingredientName: 'butter', ingredientCal: 250, ingredientWeight: 15, ingredientPhoto: actualIngredientPhoto }],
    caloriesDish: 300
  };

  const [dish, setDish] = useState(dishObj);
  const [nameDish, setNameDish] = useState('no name');
  const [actualIngredientWeight, setActualIngredientWeight] = useState(0);
  const APP_ID = "d91664c7";
  const APP_KEY = "42ccfb6e7bc9af092dcf9c81907435a3";

  async function postDish(event) {
    event.preventDefault();
    await fetch(`http://localhost:8000/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: dish.name,
        ingredients: dish.ingredients,
        calories: dish.caloriesDish
      })
    })
      .then(resp => resp.json())
  }

  const getData = async () => {
    let apiRes = null;
    try {
      apiRes = await Axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${actualIngredientName}&app_id=${APP_ID}&app_key=${APP_KEY}`);
      const caloriesPer100G = apiRes.data.parsed[0].food.nutrients.ENERC_KCAL;
      setActualIngredientCalories(caloriesPer100G / 100 * actualIngredientWeight);
      console.log(typeof apiRes.data.parsed[0].food.nutrients.ENERC_KCAL);
      if (apiRes.data.parsed[0].food.image) {
        setActualIngredientPhoto(apiRes.data.parsed[0].food.image);
      }
      else {
        setActualIngredientPhoto("https://static.thenounproject.com/png/802590-200.png");
      }
      console.log(apiRes.data.parsed[0].food.image);
      console.log(apiRes);

    } catch (err) {
      console.error("Error response:");
    } finally {
      console.log(apiRes);
    }

  };

  function setActualDish() {
    setDish(prevState => {
      // return { ...prevState, name: nameDish, ingredients: [...prevState.ingredients, actualIngredientName], caloriesDish: prevState.caloriesDish + calories };
      return {
        ...prevState, name: nameDish,

        ingredients: [...prevState.ingredients,
        {
          ingredientName: actualIngredientName
          , ingredientCal: actualIngredientCalories
          , ingredientPhoto: actualIngredientPhoto
          , ingredientWeight: actualIngredientWeight
        }],

        caloriesDish: prevState.caloriesDish + actualIngredientCalories
      };
    });
  }

  function resetActualDish() {
    setDish({
      name: 'Dish name',
      ingredients: [{ ingredientName: 'bread', ingredientCal: 200, ingredientWeight: 10, ingredientPhoto: "https://image.flaticon.com/icons/png/512/985/985552.png" },
      { ingredientName: 'butter', ingredientCal: 250, ingredientWeight: 15, ingredientPhoto: "https://image.flaticon.com/icons/png/512/985/985552.png" }],
      caloriesDish: 300
    });
  }

  function showDish() {
    console.log({ dish });
  }

  const handleText = e => {
    let h = e.target.value;
    setActualIngredientName(h);
  };

  const handleNameDish = e => {
    let h = e.target.value;
    setNameDish(h);
  };

  const handleWeightIngredient = e => {
    let h = e.target.value;
    setActualIngredientWeight(h);
  };

  const ingredientsToDisplay = dish.ingredients.map(
    ingredient => <li class="list-group-item">
      {ingredient.ingredientName},
      {ingredient.ingredientCal} cal,
      {ingredient.ingredientWeight} g,
      <img src={ingredient.ingredientPhoto} className="photo" alt='Logo'></img>
    </li>
  )

  return (
    <motion.div initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <h1 className="header">Food</h1>
      <div className="App">
        <h1 onClick={getData}>It's place where you can find caloric value of your food.</h1>
        <p>At first, type name of product (for example 'apple'), click 'search' buttom and  </p>


        <h5 className="text-secondary">New Dish</h5>
        <div class="form-inline">
          <div >
            <input type="text" placeholder="Dish name" autoComplete="off" className="form-control" onChange={handleNameDish} />
            <input type="submit" value="ChangeName" className="btn btn-outline-secondary  ml-2" onClick={setActualDish} />
          </div>
        </div>

        <h5 className="text-secondary">Add ingredient</h5>
        <div class="form-inline">
          <div >
            <input type="text" placeholder="Search food" autoComplete="off" className="form-control" onChange={handleText} />
            <input type="number" min="0" placeholder="Food weight [g]" autoComplete="off"
              className="form-control" onChange={handleWeightIngredient} />
            <input type="submit" value="Search" className="btn btn-outline-secondary  ml-2" onClick={getData} />
            <input type="submit" value="Add to dish" className="btn btn-outline-secondary  ml-2" onClick={setActualDish} />
          </div>
        </div>

        <h3>{actualIngredientCalories} cal/{actualIngredientWeight}g</h3>

        <div className="card" style={{ width: '18rem' }}>
          <div onClick={resetActualDish}>XReset</div>
          <div class="card-header">
            {dish.name}
          </div>
          <ul class="list-group list-group-flush">
            {/* ; {dish.ingredients.join()}; {dish.caloriesDish} */}
            {ingredientsToDisplay}
            <li class="list-group-item"><b>{dish.caloriesDish} calories</b> </li>
          </ul>
        </div>

        <button onClick={postDish}>postDish</button>
        <Dishes></Dishes>
      </div>
      

    </motion.div>
  );
};

export default App;