"use client"
import { useState } from 'react';
import { Trash2, Plus, Clock, Users, Image, ChefHat, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import moment from 'moment';

export default function RecipeForm() {
  // Recipe details
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([{ value: '' }]);
  const [methods, setMethods] = useState([{ value: '' }]);
  
  // Chef details
  const [chefName, setChefName] = useState('');
  const [chefSpeciality, setChefSpeciality] = useState('');
  const [chefExperience, setChefExperience] = useState('');
  const [chefTotalRecipe, setChefTotalRecipe] = useState('');
  
  // Image upload
  const [recipeImage, setRecipeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { value: '' }]);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index].value = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const addMethod = () => {
    setMethods([...methods, { value: '' }]);
  };

  const updateMethod = (index, value) => {
    const newMethods = [...methods];
    newMethods[index].value = value;
    setMethods(newMethods);
  };

  const removeMethod = (index) => {
    const newMethods = [...methods];
    newMethods.splice(index, 1);
    setMethods(newMethods);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeImage(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!recipeName.trim()) newErrors.recipeName = "Recipe name is required";
    if (!servings.trim()) newErrors.servings = "Servings information is required";
    if (!cookingTime.trim()) newErrors.cookingTime = "Cooking time is required";
    if (!chefName.trim()) newErrors.chefName = "Chef name is required";
    
    // Validate all ingredients have values
    const emptyIngredientIndex = ingredients.findIndex(ing => !ing.value.trim());
    if (emptyIngredientIndex !== -1) {
      newErrors.ingredients = `Ingredient #${emptyIngredientIndex + 1} cannot be empty`;
    }
    
    // Validate all method steps have values
    const emptyMethodIndex = methods.findIndex(method => !method.value.trim());
    if (emptyMethodIndex !== -1) {
      newErrors.methods = `Method step #${emptyMethodIndex + 1} cannot be empty`;
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      // Scroll to the first error
      document.getElementById(Object.keys(formErrors)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Prepare form data for submission
    const recipeData = {
      recipe: {
        name: recipeName,
        servings,
        cookingTime,
        ingredients: ingredients.map(ing => ing.value),
        methods: methods.map(method => method.value)
      },
      chef: {
        name: chefName,
        speciality: chefSpeciality,
        experience: chefExperience
      }
    };
    
    // If there's an image, you would typically upload it separately or encode it
    if (recipeImage) {
      // In a real app, you might use FormData to upload the image
      console.log('Image to upload:', recipeImage.name);

    }
    // Simulate API call
    try {
      let imageUrl = "";
      
      if (recipeImage) {
        const imageRef = ref(storage, `recipes/${recipeImage.name}`);
        await uploadBytes(imageRef, recipeImage);
        imageUrl = await getDownloadURL(imageRef);
      }
      const recipeData = {
        recipe: {
          name: recipeName,
          servings,
          cookingTime,
          ingredients: ingredients.map((ing) => ing.value),
          methods: methods.map((method) => method.value),
          imageUrl: imageUrl,
        },
        chef: {
          name: chefName,
          speciality: chefSpeciality,
          experience: chefExperience,
          totalrecipe: chefTotalRecipe,
        },
        createdAt: moment().unix(),
      };

      await addDoc(collection(db, "RecipesDetails"), recipeData);
      console.log('Submitting recipe data:', recipeData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      // Reset form after successful submission if needed
      resetForm();
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setErrors({ form: 'Failed to submit recipe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRecipeName('');
    setServings('');
    setCookingTime('');
    setIngredients([{ value: '' }]);
    setMethods([{ value: '' }]);
    setChefName('');
    setChefSpeciality('');
    setChefExperience('');
    setRecipeImage(null);
    setImagePreview('');
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Recipe Details</CardTitle>
        </CardHeader>
        <CardContent>
          {submitSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-600">
                Recipe submitted successfully!
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Name */}
            <div>
              <Label htmlFor="recipeName" className="text-lg font-medium">
                Recipe Name
              </Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className={`w-full mt-1 ${errors.recipeName ? 'border-red-500' : ''}`}
                placeholder="e.g. Pad Thai"
              />
              {errors.recipeName && (
                <p className="text-red-500 text-sm mt-1">{errors.recipeName}</p>
              )}
            </div>

            {/* Recipe Image Upload */}
            <div>
              <Label htmlFor="recipeImage" className="text-lg font-medium">
                Recipe Image
              </Label>
              <div className="mt-1 flex items-center gap-4">
                <Label 
                  htmlFor="recipeImage" 
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 w-40 hover:border-gray-400 transition-colors"
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Recipe preview" 
                      className="h-full w-full object-cover rounded-lg" 
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Image className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to upload</p>
                    </div>
                  )}
                </Label>
                <Input
                  id="recipeImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Upload a high-quality image of your recipe</p>
                  {recipeImage && (
                    <p className="text-sm font-medium">{recipeImage.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Servings and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servings" className="font-medium flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Servings
                </Label>
                <Input
                  id="servings"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className={`w-full mt-1 ${errors.servings ? 'border-red-500' : ''}`}
                  placeholder="e.g. 4 servings"
                />
                {errors.servings && (
                  <p className="text-red-500 text-sm mt-1">{errors.servings}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cookingTime" className="font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Cooking Time
                </Label>
                <Input
                  id="cookingTime"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className={`w-full mt-1 ${errors.cookingTime ? 'border-red-500' : ''}`}
                  placeholder="e.g. 30 minutes"
                />
                {errors.cookingTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.cookingTime}</p>
                )}
              </div>
            </div>

            {/* Chef Details Section */}
            <Card className="border border-gray-200">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ChefHat className="mr-2 h-5 w-5" /> 
                  Chef Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div>
                  <Label htmlFor="chefName" className="font-medium">
                    Chef Name
                  </Label>
                  <Input
                    id="chefName"
                    value={chefName}
                    onChange={(e) => setChefName(e.target.value)}
                    className={`w-full mt-1 ${errors.chefName ? 'border-red-500' : ''}`}
                    placeholder="e.g. Somchai Rattanapong"
                  />
                  {errors.chefName && (
                    <p className="text-red-500 text-sm mt-1">{errors.chefName}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chefSpeciality" className="font-medium flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Speciality
                    </Label>
                    <Input
                      id="chefSpeciality"
                      value={chefSpeciality}
                      onChange={(e) => setChefSpeciality(e.target.value)}
                      className="w-full mt-1"
                      placeholder="e.g. Street Food"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chefExperience" className="font-medium flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Experience (years)
                    </Label>
                    <Input
                      id="chefExperience"
                      type="number"
                      min="0"
                      value={chefExperience}
                      onChange={(e) => setChefExperience(e.target.value)}
                      className="w-full mt-1"
                      placeholder="e.g. 14"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chefTotalRecipe" className="font-medium flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Chef Total Recipes
                    </Label>
                    <Input
                      id="chefTotalrecipe"
                      type="number"
                      min="0"
                      value={chefTotalRecipe}
                      onChange={(e) => setChefTotalRecipe(e.target.value)}
                      className="w-full mt-1"
                      placeholder="e.g. 14"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <div>
              <Label htmlFor="ingredients" className="text-lg font-medium">
                Ingredients
              </Label>
              <div className="space-y-2 mt-2">
                <AnimatePresence>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center h-10 w-10 rounded-full bg-emerald-100 justify-center flex-shrink-0">
                        <span className="text-emerald-600 font-medium">{index + 1}</span>
                      </div>
                      <Input
                        value={ingredient.value}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="w-full"
                        placeholder="e.g. 200g rice noodles"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {errors.ingredients && (
                  <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>
                )}
                <Button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>
            </div>

            {/* Method */}
            <div>
              <Label htmlFor="methods" className="text-lg font-medium">
                Method
              </Label>
              <div className="space-y-2 mt-2">
                <AnimatePresence>
                  {methods.map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center h-10 w-10 rounded-full bg-gray-100 justify-center flex-shrink-0">
                        <span className="text-gray-600 font-medium">{index + 1}</span>
                      </div>
                      <Textarea
                        value={method.value}
                        onChange={(e) => updateMethod(index, e.target.value)}
                        className="w-full min-h-[60px]"
                        placeholder="e.g. Soak rice noodles in warm water until soft"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMethod(index)}
                        disabled={methods.length === 1}
                        className="flex-shrink-0 self-start mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {errors.methods && (
                  <p className="text-red-500 text-sm mt-1">{errors.methods}</p>
                )}
                <Button
                  type="button"
                  onClick={addMethod}
                  className="mt-2 w-full bg-gray-50 text-gray-600 hover:bg-gray-100"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Step
                </Button>
              </div>
            </div>

            {/* Form error if any */}
            {errors.form && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-600">
                  {errors.form}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Recipe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}