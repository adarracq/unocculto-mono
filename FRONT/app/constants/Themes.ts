export default {
    themes:
        [
            {
                id: 0,
                name: 'history_politics',
                labelFR: 'Histoire & Politique',
                labelEN: 'History & Politics',
                icon: require('@/app/assets/other/taj-mahal.png'),
                selected: true
            },
            {
                id: 1,
                name: 'science_technology',
                labelFR: 'Sciences & Technologies',
                labelEN: 'Science & Technology',
                icon: require('@/app/assets/other/science.png'),
                selected: true
            },
            {
                id: 2,
                name: 'arts_culture',
                labelFR: 'Arts & Culture',
                labelEN: 'Arts & Culture',
                icon: require('@/app/assets/other/art.png'),
                selected: true
            },
            {
                id: 3,
                name: 'literature_philosophy',
                labelFR: 'Littérature & Philosophie',
                labelEN: 'Literature & Philosophy',
                icon: require('@/app/assets/other/philosopher.png'),
                selected: true
            },
            {
                id: 4,
                name: 'society_religion',
                labelFR: 'Société & Religion',
                labelEN: 'Society & Religion',
                icon: require('@/app/assets/other/religions.png'),
                selected: true
            },
            {
                id: 5,
                name: 'geography_nature',
                labelFR: 'Géographie & Nature',
                labelEN: 'Geography & Nature',
                icon: require('@/app/assets/other/volcano.png'),
                selected: true
            },
            {
                id: 6,
                name: 'sports_leisure',
                labelFR: 'Sport & Loisirs',
                labelEN: 'Sports & Leisure',
                icon: require('@/app/assets/other/torch.png'),
                selected: true
            },
            {
                id: 7,
                name: 'geopolitics_economy',
                labelFR: 'Géopolitique & Économie',
                labelEN: 'Geopolitics & Economy',
                icon: require('@/app/assets/other/geopolitics.png'),
                selected: true
            },
        ]
};

/*
    async function createThemesInBDD() {
        const themes = Themes.themes;

        themes.forEach(async (theme, index) => {
            if (theme.icon) {
                let base64Icon = await functions.convertImageToBase64(theme.icon);
                let _theme = new Theme(
                    theme.name,
                    theme.labelFR,
                    theme.labelEN,
                    // convert icon name to base64 string
                    base64Icon,
                );
                themeService.create(_theme);

            }
        });
    }
*/