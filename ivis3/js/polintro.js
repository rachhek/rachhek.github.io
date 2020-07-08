

function runIntro(){
    $(function () {
        var introguide = introJs();
        introguide.setOptions({
            steps: [
                {
                    element: '#map',
                    intro: 'This is the map of Stockholm Royal Seaport where the project is happening. You can click on the colored section to get information about the different phases.',
                    position: 'bottom'
                },
                {
                    element: '#map-subject',
                    intro: 'Select options from dropdown to assign size and color to the projects.',
                    position: 'right'
                },
                {
                    element: '#project-dropdown',
                    intro: 'You can use the dropdown menu to select individual project and get some information about them.',
                    position: 'left'
                },
                
                {
                    element:'#gaugebox',
                    intro: 'Showcases transportation-related requirements and values. Green is meeting the requirement, orange is falling short of it. Use the buttons to swap requirement. ',
                    position: 'left'
                },

                {
                    element:'#co2box',
                    intro: 'Showcases CO2 emissions, and giving the context of the Swedish Requirements as well as the requirements set by agenda 2030.',
                    position: 'left'
                },

                {
                    element:'#energybox',
                    intro: 'Shows total energy generated from related sources for a given project.',
                    position: 'left'
                },
                
            ]
        });
        introguide.start();
    });
};
