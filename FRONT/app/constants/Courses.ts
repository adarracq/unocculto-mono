export default {
    courses:
        [
            {
                number: 0,
                name: 'origins_time_life',
                labelFR: "Aux origines du temps et de la vie",
                labelEN: 'Origins of Time and Life',
                icon: require('@/app/assets/other/universe.png'),
            },
            {
                number: 1,
                name: 'humanity_emergence',
                labelFR: "L'émergence de l'humanité",
                labelEN: 'Emergence of Humanity',
                icon: require('@/app/assets/other/caveman.png'),
            },
            {
                number: 2,
                name: 'antiquity_great_civilizations',
                labelFR: "Les grandes civilisations de l'Antiquité",
                labelEN: 'Great Civilizations of Antiquity',
                icon: require('@/app/assets/other/antiquity.png'),
            },
            {
                number: 3,
                name: 'middle_ages',
                labelFR: "Le Moyen Âge",
                labelEN: 'Middle Ages',
                icon: require('@/app/assets/other/castle.png'),
            },
            {
                number: 4,
                name: 'modern_times',
                labelFR: "les Temps modernes",
                labelEN: 'Modern Times',
                icon: require('@/app/assets/other/buildings.png'),
            },
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