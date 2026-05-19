document.addEventListener("DOMContentLoaded", () => {
    // 1. Centralized Database (Contains BOTH your original Classes AND your Workout Plans)
    const classData = {
        // --- YOUR ORIGINAL CLASSES DATA ---
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
            scheduleFocus: ["Light Cardio Warmup", "High Intensity Aerobics", "Active Recovery", "Endurance Circuits", "Cardio Core", "Full Body Aerobics", "Rest"],
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
            scheduleFocus: ["Dynamic Warmup", "Lower Body Stretches", "Upper Body Openers", "Spinal Mobility", "Deep Tissue Release", "Full Body Flow", "Rest & Breathe"],
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
            scheduleFocus: ["Full Body HIIT", "Core & Cardio", "Active Recovery", "Lower Body Power", "Upper Body Burn", "Endurance Push", "Rest"],
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
        },

        // --- ADDED WORKOUT PLANS DATA ---
        "7 days quick start": {
            title: "7 DAYS QUICK START",
            level: "BEGINNER",
            duration: "7 DAYS",
            capacity: "MAX 20 PEOPLE",
            description: "Perfect for beginners starting their fitness journey. Build fundamental strength and establish healthy habits.",
            metrics: ["Beginner", "Build Foundation", "None Required", "7 Days"],
            price: "$29.99",
            rating: "4.8",
            reviews: "(342 reviews)",
            scheduleFocus: ["Full Body Intro", "Core Foundation", "Rest Day", "Lower Body Focus", "Upper Body Form", "Active Mobility", "Rest Day"],
            exercises: [
                { name: "BODYWEIGHT SQUATS", category: "Lower Body", sets: "3", reps: "12 Reps" },
                { name: "INCLINE PUSH-UPS", category: "Upper Body", sets: "3", reps: "10 Reps" },
                { name: "GLUTE BRIDGES", category: "Lower Body", sets: "3", reps: "15 Reps" },
                { name: "PLANK HOLD", category: "Core", sets: "3", reps: "30 Sec" },
                { name: "BIRD DOG", category: "Stability", sets: "3", reps: "10 Each" },
                { name: "JUMPING JACKS", category: "Cardio Warmup", sets: "3", reps: "45 Sec" },
                { name: "WALL SITS", category: "Quad Strength", sets: "3", reps: "30 Sec" }
            ],
            videoSrc: "/videos/workout-demonstration.mp4"
        },
        "10 days challenge": {
            title: "10 DAYS CHALLENGE",
            level: "INTERMEDIATE",
            duration: "10 DAYS",
            capacity: "MAX 15 PEOPLE",
            description: "Take your fitness to the next level with this intensive 10 day program designed to boost endurance and strength.",
            metrics: ["Intermediate", "Build Foundation", "None Required", "10 Days"],
            price: "$39.99",
            rating: "4.9",
            reviews: "(521 reviews)",
            scheduleFocus: ["Endurance Intro", "Strength Circuit", "Core Burn", "Active Recovery", "Power Output", "Stamina Building", "Rest Day"],
            exercises: [
                { name: "BURPEES", category: "Full Body", sets: "4", reps: "12 Reps" },
                { name: "WALKING LUNGES", category: "Lower Body", sets: "3", reps: "20 Total" },
                { name: "STANDARD PUSH-UPS", category: "Upper Body", sets: "4", reps: "12 Reps" },
                { name: "MOUNTAIN CLIMBERS", category: "Cardio/Core", sets: "3", reps: "45 Sec" },
                { name: "DUMBBELL ROW", category: "Upper Back", sets: "3", reps: "10 Reps" },
                { name: "BICYCLE CRUNCHES", category: "Abs", sets: "3", reps: "20 Reps" },
                { name: "JUMP SQUATS", category: "Explosive", sets: "4", reps: "15 Reps" }
            ],
            videoSrc: "/videos/workout-demonstration.mp4"
        },
        "for busy professionals": {
            title: "FOR BUSY PROFESSIONALS",
            level: "ALL LEVELS",
            duration: "4 WEEKS",
            capacity: "MAX 25 PEOPLE",
            description: "Maximize results with minimal time investment. 20-30 minute high-efficiency workouts designed for tight schedules.",
            metrics: ["All Levels", "Time Efficient", "Minimal Gear", "4 Weeks"],
            price: "$49.99",
            rating: "4.8",
            reviews: "(342 reviews)",
            scheduleFocus: ["Express Full Body", "Upper Body Blast", "Rest Day", "Express Lower Body", "Core & Cardio Sprint", "Active Stretching", "Rest Day"],
            exercises: [
                { name: "THRUSTERS", category: "Full Body Compound", sets: "3", reps: "12 Reps" },
                { name: "COMMANDO PLANKS", category: "Core/Shoulders", sets: "3", reps: "45 Sec" },
                { name: "KETTLEBELL SWINGS", category: "Posterior Chain", sets: "4", reps: "15 Reps" },
                { name: "DIAMOND PUSH-UPS", category: "Triceps/Chest", sets: "3", reps: "10 Reps" },
                { name: "GOBLET SQUATS", category: "Lower Body", sets: "3", reps: "12 Reps" },
                { name: "HIGH KNEES", category: "Cardio Interval", sets: "3", reps: "30 Sec" },
                { name: "SUPERMAN HOLD", category: "Lower Back", sets: "3", reps: "45 Sec" }
            ],
            videoSrc: "/videos/workout-demonstration.mp4"
        },
        "30 days challenge": {
            title: "30 DAYS CHALLENGE",
            level: "ADVANCED",
            duration: "30 DAYS",
            capacity: "MAX 10 PEOPLE",
            description: "Transform your body in 30 days with this intensive program. Advanced techniques for maximum muscle gain and strength.",
            metrics: ["Advanced", "Transformation", "Full Gym Access", "30 Days"],
            price: "$59.99",
            rating: "4.9",
            reviews: "(1243 reviews)",
            scheduleFocus: ["Heavy Pull Day", "Heavy Push Day", "Rest & Roll", "Quad & Calf Focus", "Shoulder Hypertrophy", "Hamstring & Core", "Rest Day"],
            exercises: [
                { name: "BARBELL SQUATS", category: "Lower Body", sets: "4", reps: "8-10 Reps" },
                { name: "BARBELL DEADLIFTS", category: "Power/Compound", sets: "3", reps: "6-8 Reps" },
                { name: "BARBELL BENCH PRESS", category: "Upper Body Push", sets: "4", reps: "8 Reps" },
                { name: "OVERHEAD PRESS", category: "Shoulders", sets: "4", reps: "10 Reps" },
                { name: "PULL-UPS", category: "Upper Body Pull", sets: "4", reps: "Max Reps" },
                { name: "HANGING LEG RAISES", category: "Core", sets: "3", reps: "15 Reps" },
                { name: "DUMBBELL BICEP CURLS", category: "Arms", sets: "3", reps: "12 Reps" }
            ],
            videoSrc: "/videos/workout-demonstration.mp4"
        },
        "fat burn program": {
            title: "FAT BURN PROGRAM",
            level: "INTERMEDIATE",
            duration: "8 WEEKS",
            capacity: "MAX 15 PEOPLE",
            description: "Science-based fat burning program combining HIIT cardio intervals and strength circuits for optimal weight loss.",
            metrics: ["Intermediate", "Weight Loss", "Cardio Gear", "8 Weeks"],
            price: "$49.99",
            rating: "4.8",
            reviews: "(892 reviews)",
            scheduleFocus: ["HIIT Sprint Circuit", "Metabolic Conditioning", "Rest Day", "Tabata Shred", "Steady-State Cardio", "Full Body Circuit", "Rest Day"],
            exercises: [
                { name: "SLED PUSHES", category: "Power Cardio", sets: "4", reps: "20 Meters" },
                { name: "BATTLE ROPES", category: "Upper Body Stamina", sets: "4", reps: "30 Sec" },
                { name: "BOX JUMPS", category: "Plyometrics", sets: "3", reps: "12 Reps" },
                { name: "MEDICINE BALL SLAMS", category: "Core/Power", sets: "4", reps: "15 Reps" },
                { name: "SKATER HOPS", category: "Agility/Cardio", sets: "3", reps: "45 Sec" },
                { name: "PLANK JACKS", category: "Core Stability", sets: "3", reps: "45 Sec" },
                { name: "ROWING MACHINE", category: "Full Body Cardio", sets: "4", reps: "250 Meters" }
            ],
            videoSrc: "/videos/workout-demonstration.mp4"
        }
    };

    // 2. Read URL Parameter (Checks for BOTH 'workout' parameter or 'class' parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const rawKey = urlParams.get('workout') || urlParams.get('class') || '';
    const uniqueKey = rawKey.toLowerCase().trim();
    
    // Safely defaults to strength training if no query parameters are found
    const data = classData[uniqueKey] || classData['strength training'];

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

            const setsDiv = document.createElement('div');
            setsDiv.className = 'stat-sets';
            setsDiv.textContent = ex.sets;

            const repsDiv = document.createElement('div');
            repsDiv.className = 'stat-reps';
            repsDiv.textContent = ex.reps;

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