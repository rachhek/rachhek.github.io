function civilIntro() {
    $(function () {
        var introguide = introJs();
        introguide.setOptions({
            steps: [
                {
                    element: '#map',
                    intro: 'This is the map of Stockholm Royal Seaport where the project is happening',
                    position: 'bottom'
                },
                {
                    element: '#slider-outer-container',
                    intro: 'Adjust the weight of the sliders to determine the best developer',
                    position: 'left'
                },
                {
                    element: '.bubble-chart-container',
                    intro: 'View the results here. Click on the bubbles to check the results below',
                    position: 'bottom'
                },
                {
                    element: '.developer-detail',
                    intro: 'View the details of the developer here',
                    position: 'bottom'
                },
            ]
        });
        introguide.start();
    });
};