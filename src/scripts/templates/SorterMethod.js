import SearchApi from "../api/SearchAPI";

/***
 *
 * Common Sorters Method
 *
 */

export default class SorterMethod {
  constructor(recipeMethod, $sorterSection, $tagsSection) {
    // Copy of the recipeMethod (for access to the data)
    this.recipeMethod = recipeMethod;
    // "State" of the tag selected by user
    this.tempTagsList = [];
    this.$sorterWrapper = $sorterSection;
    this.$tagsWrapper = $tagsSection;
    //Init of the search Api and give it initialData
    this.SearchApi = new SearchApi(this.recipeMethod);
  }

  // Utility function
  findUnique(arr) {
    const a = [];
    for (let i = 0; i < arr.length; i++) {
      if (a.indexOf(arr[i]) === -1 && arr[i] !== "") {
        a.push(arr[i]);
      }
    }
    return a;
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Create sorter data (to provide options for the creating of  the sorter)
  // If no data provided, based on initial data
  // Based on a given "type"
  createSorterData(type, data) {
    if (!data) {
      data = this.recipeMethod.initialData;
    }
    const tempsArr = [];
    switch (type) {
      case "ingredients":
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].ingredients.length; j++) {
            tempsArr.push(
              this.capitalizeFirstLetter(
                data[i].ingredients[j].ingredient.toLowerCase()
              )
            );
          }
        }
        break;
      case "appliances":
        for (let i = 0; i < data.length; i++) {
          tempsArr.push(
            this.capitalizeFirstLetter(data[i].appliance.toLowerCase())
          );
        }
        break;
      case "ustensils":
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].ustensils.length; j++) {
            tempsArr.push(
              this.capitalizeFirstLetter(data[i].ustensils[j].toLowerCase())
            );
          }
        }
        break;
      default:
        break;
    }
    return this.findUnique(tempsArr);
  }

  // Filter sorterData
  filterSorterData(option, data) {
    return data.filter((data) => {
      return data.toLowerCase().includes(option.toLowerCase());
    });
  }

  //Manage the different cases of search for the sorters and recipes
  // " The Brain "
  updateSortersManager(type, option) {
    //if not type is provided reset all
    if (type == undefined) {
      this.updateAllSorters();
      this.recipeMethod.updateRecipes();
    } else {
      // update sorters and recipes UI
      const result = this.callSearch(type, option);
      this.updateAllSorters(result, option);
      this.recipeMethod.updateRecipes(result);
    }

    // If a tag has been saved in "state" tempTagList, make a search on each tag in state
    if (this.tempTagsList.length == 0) {
      this.$tagsWrapper.classList.remove("show");
    } else {
      this.tempTagsList.forEach((tag) => {
        const result = this.callSearch(tag.label, tag.option);
        this.updateAllSorters(result, tag.option, tag.label);
        this.recipeMethod.updateRecipes(result);
      });
    }
  }

  //Update all the sorters
  updateAllSorters(newData, option, tag) {
    // If no Data provided, reset each sorter in sortsArray (added after instantiation of the object)
    if (newData == undefined) {
      this.sortersArray.forEach((sorter) => {
        sorter.updateSorter(this.recipeMethod.initialData);
      });
    } else {
      this.sortersArray.forEach((sorter) => {
        sorter.updateSorter(newData, option, tag);
      });
    }
  }

  // Close all the dropdown
  closeAllSortersDropdown() {
    this.sortersArray.forEach((sorter) => {
      sorter.closeDropdown();
    });
  }

  // Call the Search Api
  callSearch(label, value) {
    return this.SearchApi.search(value, label);
  }
}
