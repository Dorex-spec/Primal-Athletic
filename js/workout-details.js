document.addEventListener("DOMContentLoaded", () => {
    // 1. Centralized Class Database (Now with Sets & Reps)
    const classData = {
        strength: {
            title: "STRENGTH TRAINING",
            level: "INTERMEDIATE",
            duration: "45 MINS",
            capacity: "MAX 15 PEOPLE",
            description: "A 45-minute strength training focused on building muscle and core stability.",
            metrics: ["Intermediate", "Build Muscle", "Barbells & Dumbbells", "45 Mins"],
            price: "$25.00",
            rating: "4.9",
            reviews: "(420 reviews)",
            scheduleFocus: ["Upper Body Push", "Lower Body Power", "Rest", "Core & Stability", "Full Body Lift", "Active Recovery", "Rest"],
            exercises: [
                { name: "BARBELL SQUATS", category: "Lower Body", sets: "4 SETS", reps: "8-10 REPS" },
                { name: "DEADLIFTS", category: "Full Body", sets: "3 SETS", reps: "8 REPS" },
                { name: "BENCH PRESS", category: "Upper Body", sets: "4 SETS", reps: "8-10 REPS" },
                { name: "WEIGHTED PLANKS", category: "Core", sets: "3 SETS", reps: "60 SECS" },
                { name: "OVERHEAD PRESS", category: "Upper Body", sets: "3 SETS", reps: "10 REPS" }
            ],
            videoSrc: "videos/strength-demonstration.mp4"
        },
        cardio: {
            title: "AEROBIC POWER",
            level: "ALL LEVELS",
            duration: "50 MINS",
            capacity: "MAX 20 PEOPLE",
            description: "High-intensity aerobic session for stamina, cardiovascular health, and fat burning.",
            metrics: ["All Levels", "Fat Burn & Stamina", "No Equipment", "50 Mins"],
            price: "$20.00",
            rating: "4.7",
            reviews: "(215 reviews)",
            scheduleFocus: ["Steady State Cardio", "Interval Sprints", "Active Recovery", "Tempo Run", "Full Body Aerobics", "Endurance Push", "Rest"],
            exercises: [
                { name: "JUMPING JACKS", category: "Warm-up", sets: "3 SETS", reps: "60 SECS" },
                { name: "HIGH KNEES", category: "Cardio", sets: "4 SETS", reps: "45 SECS" },
                { name: "BURPEES", category: "Full Body", sets: "3 SETS", reps: "15 REPS" },
                { name: "MOUNTAIN CLIMBERS", category: "Core/Cardio", sets: "4 SETS", reps: "60 SECS" },
                { name: "JUMP ROPE", category: "Cardio", sets: "5 SETS", reps: "2 MINS" }
            ],
            videoSrc: "videos/cardio-demonstration.mp4"
        },
        flexibility: {
            title: "FLEXIBILITY & BALANCE",
            level: "BEGINNER",
            duration: "60 MINS",
            capacity: "MAX 12 PEOPLE",
            description: "Enhance mobility, core balance, and posture through dynamic stretching and yoga flows.",
            metrics: ["Beginner", "Mobility & Posture", "Yoga Mat", "60 Mins"],
            price: "$22.00",
            rating: "4.8",
            reviews: "(150 reviews)",
            scheduleFocus: ["Full Body Flow", "Core & Balance", "Rest", "Hip Mobility", "Spinal Health", "Dynamic Stretching", "Rest"],
            exercises: [
                { name: "DOWNWARD DOG", category: "Full Body", sets: "3 SETS", reps: "30 SECS" },
                { name: "CAT-COW", category: "Core/Back", sets: "3 SETS", reps: "10 REPS" },
                { name: "WARRIOR POSE", category: "Balance", sets: "3 SETS", reps: "45 SECS" },
                { name: "CHILD'S POSE", category: "Recovery", sets: "2 SETS", reps: "60 SECS" },
                { name: "TREE POSE", category: "Balance", sets: "3 SETS", reps: "30 SECS" }
            ],
            videoSrc: "videos/flexibility-demonstration.mp4"
        },
        hiit: {
            title: "HIIT BOOTCAMP",
            level: "ADVANCED",
            duration: "30 MINS",
            capacity: "MAX 18 PEOPLE",
            description: "Intense interval training designed for maximum calorie burn and cardiovascular endurance.",
            metrics: ["Advanced", "Max Calorie Burn", "Kettlebells", "30 Mins"],
            price: "$28.00",
            rating: "4.9",
            reviews: "(530 reviews)",
            scheduleFocus: ["Lower Body HIIT", "Upper Body Burn", "Active Recovery", "Core Crusher", "Full Body Power", "Cardio Blast", "Rest"],
            exercises: [
                { name: "KETTLEBELL SWINGS", category: "Full Body", sets: "4 SETS", reps: "20 REPS" },
                { name: "BATTLE ROPES", category: "Upper Body", sets: "4 SETS", reps: "30 SECS" },
                { name: "SQUAT JUMPS", category: "Lower Body", sets: "4 SETS", reps: "15 REPS" },
                { name: "MED BALL SLAMS", category: "Full Body", sets: "4 SETS", reps: "20 REPS" },
                { name: "SPRINTS", category: "Cardio", sets: "5 SETS", reps: "100 METERS" }
            ],
            videoSrc: "videos/hiit-demonstration.mp4"
        }
    };

    // 2. Read the URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const classKey = urlParams.get('class'); 
    const data = classData[classKey] || classData['strength']; 

    // 3. Populate Dynamic Overview Yellow Text Elements
    const dynTitle = document.getElementById('dyn-overview-title');
    const dynLevel = document.getElementById('dyn-overview-level');
    const dynDuration = document.getElementById('dyn-overview-duration');
    const dynCapacity = document.getElementById('dyn-overview-capacity');
    const dynText = document.getElementById('dyn-overview-text');

    if (dynTitle) dynTitle.textContent = data.title;
    if (dynLevel) dynLevel.textContent = data.level;
    if (dynDuration) dynDuration.textContent = data.duration;
    if (dynCapacity) dynCapacity.textContent = data.capacity;
    if (dynText) dynText.textContent = data.description;

    // 4. Populate Header
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = data.title;

    // 5. Populate Metrics Boxes
    const metricValues = document.querySelectorAll('.metric-value');
    if (metricValues.length >= 4) {
        metricValues[0].textContent = data.metrics[0];
        metricValues[1].textContent = data.metrics[1];
        metricValues[2].textContent = data.metrics[2];
        metricValues[3].textContent = data.metrics[3];
    }

    // 6. Populate Schedule Focus Items
    const focusItems = document.querySelectorAll('.focus-item');
    focusItems.forEach((item, index) => {
        if (data.scheduleFocus[index]) item.textContent = data.scheduleFocus[index];
    });

    // 7. Populate Dynamic Exercise List (Now with Numbers, Sets & Reps)
    const exerciseListContainer = document.querySelector('.exercise-name-list');
    if (exerciseListContainer) {
        exerciseListContainer.innerHTML = '';
        data.exercises.forEach((ex, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'exercise-item';
            
            // Left block container (Name + Category)
            const infoDiv = document.createElement('div');
            infoDiv.className = 'exercise-info';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'exercise-name';
            
            // Create the orange number span (e.g., "1. ")
            const numberSpan = document.createElement('span');
            numberSpan.className = 'exercise-number';
            numberSpan.textContent = `${index + 1}. `;
            
            // Add the number, then the exercise name to the name div
            nameDiv.appendChild(numberSpan);
            nameDiv.appendChild(document.createTextNode(ex.name));
            
            const catDiv = document.createElement('div');
            catDiv.className = 'exercise-category';
            catDiv.textContent = ex.category;
            
            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(catDiv);

            // Right block container (Sets & Reps)
            const statsDiv = document.createElement('div');
            statsDiv.className = 'exercise-stats';
            statsDiv.textContent = `${ex.sets}  |  ${ex.reps}`;
            
            const rowLine = document.createElement('div');
            rowLine.className = 'row-line';
            
            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(statsDiv);
            itemDiv.appendChild(rowLine);
            exerciseListContainer.appendChild(itemDiv);
        });
    }

    // 8. Video Source Handling
    const videoElement = document.querySelector('.video-box video');
    const videoSource = document.querySelector('.video-box video source');
    if (videoSource && videoElement && data.videoSrc) {
        videoSource.src = data.videoSrc;
        videoElement.load();
    }

    // 9. Price and Review values
    const priceValue = document.querySelector('.price-value');
    if (priceValue) priceValue.textContent = data.price;

    const ratingValue = document.querySelector('.rating-value');
    if (ratingValue) ratingValue.textContent = data.rating;

    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) reviewCount.textContent = data.reviews;
});