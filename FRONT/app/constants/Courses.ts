export default {
    courses:
        [
            {
                number: 0,
                name: 'origins_time_life',
                labelFR: "Aux origines du temps et de la vie",
                labelEN: 'Origins of Time and Life',
                descriptionFR: "Découvrez les mystères de l'univers, de la formation des étoiles à l'apparition de la vie sur Terre.",
                descriptionEN: "Discover the mysteries of the universe, from the formation of stars to the emergence of life on Earth.",
                icon: require('@/app/assets/other/universe.png'),
            },
            {
                number: 1,
                name: 'humanity_emergence',
                labelFR: "L'émergence de l'humanité",
                labelEN: 'Emergence of Humanity',
                descriptionFR: "Explorez l'évolution de l'humanité, des premiers hominidés aux civilisations anciennes.",
                descriptionEN: "Explore the evolution of humanity, from early hominids to ancient civilizations.",
                icon: require('@/app/assets/other/caveman.png'),
            },
            {
                number: 2,
                name: 'antiquity_great_civilizations',
                labelFR: "Les grandes civilisations de l'Antiquité",
                labelEN: 'Great Civilizations of Antiquity',
                descriptionFR: "Plongez dans l'histoire des grandes civilisations antiques telles que l'Égypte, la Grèce et Rome.",
                descriptionEN: "Dive into the history of great ancient civilizations such as Egypt, Greece, and Rome.",
                icon: require('@/app/assets/other/antiquity.png'),
            },
            {
                number: 3,
                name: 'middle_ages',
                labelFR: "Le Moyen Âge",
                labelEN: 'Middle Ages',
                descriptionFR: "Découvrez les événements marquants du Moyen Âge, des châteaux forts aux croisades.",
                descriptionEN: "Discover the significant events of the Middle Ages, from castles to the Crusades.",
                icon: require('@/app/assets/other/castle.png'),
            },
            {
                number: 4,
                name: 'modern_times',
                labelFR: "Les Temps modernes",
                labelEN: 'Modern Times',
                descriptionFR: "Explorez la Renaissance, les révolutions scientifiques et les grandes découvertes qui ont façonné le monde moderne.",
                descriptionEN: "Explore the Renaissance, scientific revolutions, and great discoveries that shaped the modern world.",
                icon: require('@/app/assets/other/buildings.png'),
            },
            {
                number: 5,
                name: 'contemporary_world',
                labelFR: "Le monde contemporain",
                labelEN: 'Contemporary World',
                descriptionFR: "Analysez les événements clés du XXe siècle, des guerres mondiales à la mondialisation.",
                descriptionEN: "Analyze key events of the 20th century, from world wars to globalization.",
                icon: require('@/app/assets/other/technology.png'),
            }
        ]
};


/*
    async function createCoursesInBDD() {
        const courses = Courses.courses;

        courses.forEach(async (course, index) => {
            if (course.icon) {
                let base64Icon = await functions.convertImageToBase64(course.icon);
                let _course = new Course(
                course.number,
                    course.name,
                    course.labelFR,
                    course.labelEN,
                    // convert icon name to base64 string
                    base64Icon,
                );
                courseService.create(_course);

            }
        });
    }
*/