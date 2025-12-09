export default {
    chapters:
        [
            {
                number: 0,
                name: 'universe_formation',
                labelFR: "Le Big Bang et la formation de l'univers",
                labelEN: 'Universe Formation',
                icon: require('@/app/assets/other/universe2.png'),
                dateStart: -13800000000,
                dateEnd: -4600000000,
                courseNB: 0,
            },
            {
                number: 1,
                name: 'earth_moon_formation',
                labelFR: "La naissance de la Terre et de la Lune",
                labelEN: 'Earth and Moon Formation',
                icon: require('@/app/assets/other/pangea.png'),
                dateStart: -4600000000,
                dateEnd: -200000000,
                courseNB: 0,
            },
            {
                number: 2,
                name: 'first_life_forms',
                labelFR: "L'apparition des premières formes de vie",
                labelEN: 'First Life Forms',
                icon: require('@/app/assets/other/molecule.png'),
                dateStart: -200000000,
                dateEnd: -50000000,
                courseNB: 0,
            },
            {
                number: 3,
                name: 'age_of_dinosaurs',
                labelFR: "L'évolution des espèces jusqu'aux dinosaures",
                labelEN: 'Age of Dinosaurs',
                icon: require('@/app/assets/other/dinosaur.png'),
                dateStart: -50000000,
                dateEnd: -6600000,
                courseNB: 0,
            },
        ]
};


/*
    async function createChaptersInBDD() {
        const chapters = Chapters.chapters;

        chapters.forEach(async (chapter, index) => {
            if (chapter.icon) {
                let base64Icon = await functions.convertImageToBase64(chapter.icon);
                let _chapter = new Chapter(
                    chapter.number,
                    chapter.name,
                    chapter.labelFR,
                    chapter.labelEN,
                    // convert icon name to base64 string
                    base64Icon,
                    chapter.dateStart,
                    chapter.dateEnd,
                    route.params.course._id!,
                    chapter.courseNB
                );
                console.log(route.params.course._id!);
                chapterService.create(_chapter);

            }
        });
    }
*/