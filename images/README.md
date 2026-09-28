# The Grill House KS - Image Assets Directory (`images/`)

This directory contains all localized image assets for **The Grill House KS** website.

## 📁 Included Image Files

| Filename | Description | Usage Location |
| :--- | :--- | :--- |
| `hero-bg.jpg` | Dark blended hero section food photography background | `css/layout.css` (`.hero-section`) |
| `handcut-ribeye.jpg` | Hand-Cut 12oz Ribeye steak photo | `js/menu-data.js` (Dish `s1`) & `index.html` showcase |
| `chorizo-burrito.jpg` | Chorizo Potato Burrito photo | `js/menu-data.js` (Dish `b1`) & `index.html` showcase |
| `all-meat-omelette.jpg` | All-Meat Omelette photo | `js/menu-data.js` (Dish `b2`) & `index.html` showcase |
| `classic-pancakes.jpg` | Classic Pancake Stack photo | `js/menu-data.js` (Dish `b3`) |
| `country-skillet.jpg` | Country Skillet photo | `js/menu-data.js` (Dish `b4`) |
| `bacon-and-eggs.jpg` | Bacon & Eggs Plate photo | `js/menu-data.js` (Dish `b5`) |
| `carne-asada-tacos.jpg` | Carne Asada Tacos photo | `js/menu-data.js` (Dish `m1`) & `index.html` showcase |
| `chicken-fajitas.jpg` | Chicken Fajita Plate photo | `js/menu-data.js` (Dish `m2`) |
| `enchiladas.jpg` | Authentic Enchiladas photo | `js/menu-data.js` (Dish `m3`) |
| `breakfast-quesadilla.jpg` | Breakfast Quesadilla photo | `js/menu-data.js` (Dish `m4`) |
| `classic-cheeseburger.jpg` | Classic Grill Cheeseburger photo | `js/menu-data.js` (Dish `a1`) |
| `chicken-fried-steak.jpg` | Chicken Fried Steak photo | `js/menu-data.js` (Dish `a2`) & `index.html` showcase |
| `grilled-chicken-dinner.jpg` | Grilled Chicken Breast Dinner photo | `js/menu-data.js` (Dish `s2`) |

---

## 🛠️ How to Add or Swap Food Photos

1. **Add Your File**: Place your new photo (e.g. `my-new-burger.jpg`) inside this `images/` folder.
2. **Update the Reference**:
   - For dishes, open `js/menu-data.js` and change the `image` field:
     ```javascript
     image: "images/my-new-burger.jpg"
     ```
   - For static html cards, open `index.html` and update the `src` attribute of the `<img>` tag:
     ```html
     <img src="images/my-new-burger.jpg" alt="Description">
     ```
3. **Recommended Image Dimensions**:
   - Dish photos: `600x400px` or `800x600px` (Aspect ratio ~ 4:3 or 16:9, compressed JPG).
   - Hero background: `1600x900px` or `1920x1080px`.
