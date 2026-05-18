document.addEventListener("DOMContentLoaded", () => {
    // 1. Centralized Class Database (All expanded to exactly 7 items to fit the 550px container)
    const classData = {
        "strength training": {
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
                { name: "BARBELL SQUATS", category: "Lower Body", sets: "4", reps: "8-10" },
                { name: "DEADLIFTS", category: "Full Body", sets: "3", reps: "8" },
                { name: "BENCH PRESS", category: "Upper Body", sets: "4", reps: "8-10" },
                { name: "WEIGHTED PLANKS", category: "Core", sets: "3", reps: "60 SEC" },
                { name: "OVERHEAD PRESS", category: "Upper Body", sets: "3", reps: "10" },
                { name: "BICEP CURLS", category: "Upper Body", sets: "3", reps: "12" },
                { name: "HAMSTRING CURLS", category: "Lower Body", sets: "3", reps: "10" }
            ],
            videoSrc: "videos/strength-demonstration.mp4"
        },

        "aerobic power": {
            title: "AEROBIC POWER",
            level: "BEGINNER",
            duration: "1 HOUR",
            capacity: "MAX 30 PEOPLE",
            description: "A 1-hour high-energy aerobic session designed to boost your cardiovascular endurance and burn calories with Trainer Alia.",
            metrics: ["Beginner", "Cardio Endurance", "None Required", "1 Hour"],
            price: "$20.00",
            rating: "4.8",
            reviews: "(215 reviews)",
            scheduleFocus: [
                "Light Cardio Warmup",
                "High Intensity Aerobics",
                "Active Recovery",
                "Endurance Circuits",
                "Cardio Core",
                "Full Body Aerobics",
                "Rest"
            ],
            exercises: [
                { name: "JUMPING JACKS", category: "Warm Up", sets: "3", reps: "60 SEC" },
                { name: "HIGH KNEES", category: "Cardio", sets: "4", reps: "45 SEC" },
                { name: "BURPEES", category: "Full Body", sets: "3", reps: "15" },
                { name: "MOUNTAIN CLIMBERS", category: "Core/Cardio", sets: "4", reps: "60 SEC" },
                { name: "JUMP SQUATS", category: "Lower Body", sets: "3", reps: "20" },
                { name: "SKATER HOPS", category: "Cardio", sets: "3", reps: "45 SEC" },
                { name: "SHUTTLE RUNS", category: "Cardio", sets: "4", reps: "30 SEC" }
            ],
            videoSrc: "/videos/aerobic-demonstration.mp4"
        },

        "flexibility and balance": {
            title: "FLEXIBILITY & MOBILITY",
            level: "ALL LEVELS",
            duration: "45 MINS",
            capacity: "MAX 25 PEOPLE",
            description: "A restorative 45-minute session focused on deep stretching, improving your range of motion, and releasing muscle tension to help you recover faster.",
            metrics: ["All Levels", "Recovery & Mobility", "Yoga Mat", "45 Mins"],
            price: "$15.00",
            rating: "4.9",
            reviews: "(189 reviews)",
            scheduleFocus: [
                "Dynamic Warmup",
                "Lower Body Stretches",
                "Upper Body Openers",
                "Spinal Mobility",
                "Deep Tissue Release",
                "Full Body Flow",
                "Rest & Breathe"
            ],
            exercises: [
                { name: "CAT-COW STRETCH", category: "Spine", sets: "3", reps: "60 SEC" },
                { name: "DOWNWARD DOG", category: "Full Body", sets: "3", reps: "45 SEC" },
                { name: "PIGEON POSE", category: "Lower Body", sets: "3", reps: "60 SEC" },
                { name: "CHILD'S POSE", category: "Recovery", sets: "3", reps: "90 SEC" },
                { name: "SEATED FORWARD FOLD", category: "Hamstrings", sets: "3", reps: "60 SEC" },
                { name: "COBRA POSE", category: "Spine/Core", sets: "3", reps: "45 SEC" },
                { name: "DYNAMIC MOBILITY FLOW", category: "Mobility", sets: "3", reps: "5 EACH" }
            ],
            videoSrc: "/videos/flexibility-demonstration.mp4"
        },

        "hiit boot camp": {
            title: "HIIT BOOTCAMP",
            level: "ADVANCED",
            duration: "45 MINS",
            capacity: "MAX 20 PEOPLE",
            description: "A high-intensity bootcamp designed to push your physical limits, burn maximum calories, and build explosive power through fast-paced intervals.",
            metrics: ["Advanced", "Fat Loss & Power", "Minimal Equipment", "45 Mins"],
            price: "$15.00",
            rating: "4.9",
            reviews: "(312 reviews)",
            scheduleFocus: [
                "Full Body HIIT",
                "Core & Cardio",
                "Active Recovery",
                "Lower Body Power",
                "Upper Body Burn",
                "Endurance Push",
                "Rest"
            ],
            exercises: [
                { name: "KETTLEBELL SWINGS", category: "Full Body", sets: "4", reps: "45 SEC" },
                { name: "BOX JUMPS", category: "Lower Body", sets: "4", reps: "30 SEC" },
                { name: "BURPEES", category: "Full Body", sets: "4", reps: "45 SEC" },
                { name: "BATTLE ROPES", category: "Upper/Core", sets: "4", reps: "30 SEC" },
                { name: "SPRINT INTERVALS", category: "Cardio", sets: "5", reps: "30 SEC" },
                { name: "MEDICINE BALL SLAMS", category: "Full Body", sets: "4", reps: "15" },
                { name: "THRUSTERS", category: "Full Body", sets: "4", reps: "45 SEC" }
            ],
            videoSrc: "/videos/hiit-bootcamp.mp4"
        }
    };

    // 2. Read and Normalize URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const rawClassKey = urlParams.get('class') || '';
    const classKey = rawClassKey.toLowerCase().trim();
    
    // Fall back safely to strength training if key isn't matched
    const data = classData[classKey] || classData['strength training'];

    // 3. Populate Description Banner
    const descriptionBanner = document.querySelector('.banner-text');
    if (descriptionBanner) descriptionBanner.textContent = data.description;

    // 4. Populate Main Header Title
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = data.title;

    // 5. Populate Metrics Overview Boxes
    const metricValues = document.querySelectorAll('.metric-value');
    if (metricValues.length >= 4) {
        metricValues[0].textContent = data.metrics[0];
        metricValues[1].textContent = data.metrics[1];
        metricValues[2].textContent = data.metrics[2];
        metricValues[3].textContent = data.metrics[3];
    }

    // 6. Populate Weekly Schedule Focus Column
    const focusItems = document.querySelectorAll('.focus-item');
    focusItems.forEach((item, index) => {
        if (data.scheduleFocus[index]) item.textContent = data.scheduleFocus[index];
    });

    // 7. Populate Dynamic Exercise Rows
    const exerciseListContainer = document.querySelector('.exercise-name-list');
    if (exerciseListContainer) {
        exerciseListContainer.innerHTML = ''; 
        
        data.exercises.forEach((ex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'exercise-item';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'exercise-info';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'exercise-name';
            nameDiv.textContent = ex.name;

            const catDiv = document.createElement('div');
            catDiv.className = 'exercise-category';
            catDiv.textContent = ex.category;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(catDiv);

            // Sets Column Element
            const setsDiv = document.createElement('div');
            setsDiv.className = 'stat-sets';
            setsDiv.textContent = ex.sets;

            // Reps Column Element
            const repsDiv = document.createElement('div');
            repsDiv.className = 'stat-reps';
            repsDiv.textContent = ex.reps;

            // Assemble row nodes
            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(setsDiv);
            itemDiv.appendChild(repsDiv);

            exerciseListContainer.appendChild(itemDiv);
        });
    }

    // 8. Video Player Target Handling
    const videoElement = document.querySelector('.video-box video');
    const videoSource = document.querySelector('.video-box video source');
    if (videoSource && videoElement && data.videoSrc) {
        videoSource.src = data.videoSrc;
        videoElement.load();
    }

    // 9. Pricing and Reviews Updates
    const priceValue = document.querySelector('.price-value');
    if (priceValue) priceValue.textContent = data.price;

    const ratingValue = document.querySelector('.rating-value');
    if (ratingValue) ratingValue.textContent = data.rating;

    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) reviewCount.textContent = data.reviews;
});